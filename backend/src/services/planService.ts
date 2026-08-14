import { IPlanData, PlanId } from "@/types/Plan";
import * as PlanRepo from "../repositories/planRepo";
import * as SubscriptionRepo from "../repositories/subscriptionRepo";
import * as UserRepo from "../repositories/userRepo";
import { StripeService } from "./stripeServices";
import { AppError } from "../utils/customErrorHandler";
import { PlanSelectionResponse } from "@/types/Plan";
import { SubscriptionStatus } from "@/types/Subscription";
import { getRecommendedPlanId } from "@/utils/planMapper";

export const getAvailablePlans = async (
  userId: string,
): Promise<IPlanData[]> => {
  const user = await UserRepo.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const plans = await PlanRepo.getAllPlans();

  if (!plans || plans.length === 0) {
    throw new AppError(404, "No plans have been seeded in the system.");
  }

  const teamSize = user.organization?.teamSize;
  const recommendedPlanId = getRecommendedPlanId(teamSize);

  return plans.map((plan) => ({
    ...plan,
    isRecommended: plan.planId === recommendedPlanId,
  }));
};

export const getUrl = async (
  userId: string,
  planId: PlanId,
): Promise<PlanSelectionResponse> => {
  if (!userId) {
    throw new AppError(401, "Unauthorized. User session not found.");
  }

  const user = await UserRepo.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const targetPlan = await PlanRepo.findByPlanId(planId);
  if (!targetPlan) {
    throw new AppError(400, `Invalid plan selection: ${planId}`);
  }
  console.log("target plan", targetPlan);

  if (planId === "free") {
    await SubscriptionRepo.upsertLocalSubscription(
      userId,
      planId,
      SubscriptionStatus.ACTIVE,
    );

    return {
      redirectUrl: `${process.env.CLIENT_URL}todos`,
      user,
    };
  }

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await StripeService.createCustomer(user.email, user.name);
    stripeCustomerId = customer.id;
    await UserRepo.updateById(userId, { stripeCustomerId });
  }

  const stripePriceId = targetPlan.stripePriceId;
  if (!stripePriceId) {
    throw new AppError(500, `Stripe Price ID missing for plan: ${planId}`);
  }

  const trialDays = user.hasUsedTrial
    ? undefined
    : (targetPlan.trialPeriodDays ?? undefined);

  const checkoutUrl = await StripeService.createCheckoutSession({
    customerId: stripeCustomerId,
    priceId: stripePriceId,
    trialDays,
    metadata: {
      userId,
      planId: targetPlan.planId,
    },
    successUrl: `${process.env.CLIENT_URL}checkoutSuccess`,
    cancelUrl: `${process.env.CLIENT_URL}plans?canceled=true`,
  });

  return {
    redirectUrl: checkoutUrl,
  };
};
