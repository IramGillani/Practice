import { AppError } from "@/utils/customErrorHandler.js";
import { stripe } from "../config/stripe.js";

export const StripeService = {
  async createCustomer(email: string, name: string) {
    return await stripe.customers.create({
      email,
      name,
    });
  },

  async createCheckoutSession({
    customerId,
    priceId,
    successUrl,
    cancelUrl,
    trialDays,
    metadata,
  }: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    trialDays?: number;
    metadata?: Record<string, string>;
  }) {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],

      ...(metadata && { metadata }),

      subscription_data: {
        ...(metadata && { metadata }),
        ...(trialDays && { trial_period_days: trialDays }),
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new AppError(502, "Failed to generate Stripe Checkout URL");
    }

    return session.url;
  },

  async updateSubscriptionPlan({
    subscriptionId,
    newPriceId,
  }: {
    subscriptionId: string;
    newPriceId: string;
  }) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription || subscription.items.data.length === 0) {
      throw new AppError(
        404,
        "Active subscription not found on payment processor.",
      );
    }

    const currentSubscriptionItemId = subscription.items.data[0].id;
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            id: currentSubscriptionItemId,
            price: newPriceId,
          },
        ],
        proration_behavior: "always_invoice",
        payment_behavior: "error_if_incomplete",
      },
    );
    return updatedSubscription;
  },
};
