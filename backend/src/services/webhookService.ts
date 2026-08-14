import * as SubscriptionRepo from "../repositories/subscriptionRepo";
import * as planRepo from "../repositories/planRepo";
import * as UserRepo from "@/repositories/userRepo";
import User from "@/models/User";
import { stripe } from "@/config/stripe";
import Stripe from "stripe";
import { sendToUser } from "@/utils/activeConnection";

export const verifyStripeSignature = (
  rawPayload: Buffer,
  signature: string,
): Stripe.Event => {
  return stripe.webhooks.constructEvent(
    rawPayload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
};

export const processWebhookEvent = async (
  event: Stripe.Event,
): Promise<void> => {
  console.log("➡️ Received Stripe Event Type:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(invoice);
      break;
    }

    default:
      break;
  }
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription || !session.customer) return;

  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.warn("Missing metadata in checkout session:", session.id);
    //  throw new AppError(
    //   400,
    //   `Missing required checkout metadata (userId: ${userId ?? "null"}, planId: ${planId ?? "null"})`
    // );
    return;
  }

  const user = await UserRepo.findById(userId);
  if (!user) return;

  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  const stripeSub =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(stripeSubscriptionId)
      : session.subscription;
  console.log("Stripe session", session);
  console.log("Stripe subscription object", stripeSub);
  // user.stripeCustomerId = session.customer as string;
  user.stripeSubscriptionId = stripeSubscriptionId;

  if (stripeSub.status === "trialing" && !user.hasUsedTrial) {
    user.hasUsedTrial = true;
  }

  await SubscriptionRepo.upsertStripeSubscription({
    userId: user._id,
    planId: planId,
    status: stripeSub.status,
    trialEndsAt: stripeSub.trial_end
      ? new Date(stripeSub.trial_end * 1000)
      : undefined,
    // startedAt: stripeSub.start_date
    //   ? new Date(stripeSub.start_date * 1000)
    //   : undefined,
    // expiresAt: new Date(stripeSub.current_period_end * 1000),
  });

  await user.save();
  console.log("updated user at chekout completed", user);
  sendToUser(userId.toString(), "CHECKOUT_COMPLETED", user);
}

async function handleSubscriptionUpdated(stripeSub: Stripe.Subscription) {
  const stripeCustomerId = stripeSub.customer as string;
  const priceId = stripeSub.items.data[0]?.price.id;

  const user = await User.findOne({ stripeCustomerId });
  if (!user) {
    console.warn(`User not found for customerId: ${stripeCustomerId}`);
    return;
  }

  const plan = await planRepo.findPlanByStripePriceId(priceId);

  await SubscriptionRepo.updateSubscriptionByUserId(user._id, {
    status: stripeSub.status,
    ...(plan && { planId: plan.planId }),
    trialEndsAt: stripeSub.trial_end
      ? new Date(stripeSub.trial_end * 1000)
      : undefined,
  });
}

async function handleSubscriptionCanceled(stripeSub: Stripe.Subscription) {
  const stripeCustomerId = stripeSub.customer as string;

  const user = await User.findOne({ stripeCustomerId });
  if (!user) return;

  await SubscriptionRepo.updateSubscriptionByUserId(user._id, {
    status: "canceled",
  });

  user.stripeSubscriptionId = null;
  await user.save();
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id;

  console.log("Invoice_p", invoice);
  console.log("SubscriptionId", subscriptionId);

  if (!subscriptionId) return;

  const stripeCustomerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  if (!stripeCustomerId) return;

  const user = await UserRepo.findUserByStripeCustomerId(stripeCustomerId);
  if (!user) return;

  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
  user.stripeSubscriptionId = subscriptionId;
  console.log("Stripe payment subscription object", stripeSub);

  const priceId = stripeSub.items.data[0]?.price.id;
  const plan = await planRepo.findPlanByStripePriceId(priceId);
  if (!plan) return;

  const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end;

  await SubscriptionRepo.upsertStripeSubscription({
    userId: user._id,
    planId: plan.planId,
    status: stripeSub.status,
    trialEndsAt: stripeSub.trial_end
      ? new Date(stripeSub.trial_end * 1000)
      : undefined,
    startedAt: stripeSub.start_date
      ? new Date(stripeSub.start_date * 1000)
      : undefined,
    expiresAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
  });
  console.log("updated user at invoice payment succeeded", user);
  await user.save();
  sendToUser(user._id.toString(), "PAYMENT_SUCCESS", user);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === "string"
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id;

  if (!subscriptionId) return;

  const stripeCustomerId = invoice.customer as string;
  const user = await User.findOne({ stripeCustomerId });
  if (!user) return;

  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

  await SubscriptionRepo.updateSubscriptionByUserId(user._id, {
    status: stripeSub.status,
  });

  sendToUser(user._id.toString(), "PAYMENT_FAILED", {
    invoiceId: invoice.id,
    subscriptionId,
    status: stripeSub.status,
  });
}
