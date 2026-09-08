import { Subscription } from "@/models/Subscription";
import { SubscriptionStatus } from "@/types/Subscription";
import { ISubscription } from "@/types/Subscription";
import { PlanId } from "@/types/Plan";

export const findSubscriptionByUserId = async (
  userId: string,
): Promise<ISubscription | null> => {
  return Subscription.findOne({ userId });
};

export const upsertLocalSubscription = async (
  userId: string,
  planId: string | null,
  status: SubscriptionStatus | null,
): Promise<ISubscription> => {
  return Subscription.findOneAndUpdate(
    { userId },
    {
      planId,
      status,
      startedAt: status === SubscriptionStatus.ACTIVE ? new Date() : null,
    },
    { upsert: true, new: true },
  );
};

export const upsertStripeSubscription = async (data: {
  userId: string;
  planId: string;
  status: string;
  trialEndsAt?: Date | null;
  startedAt?: Date | null;
  expiresAt?: Date | null;
}) => {
  return Subscription.findOneAndUpdate(
    { userId: data.userId },
    {
      planId: data.planId,
      status: data.status,
      trialEndsAt: data.trialEndsAt,
      startedAt: data.startedAt,
      expiresAt: data.expiresAt,
    },
    {
      upsert: true,
      new: true,
    },
  );
};

export const updateSubscriptionByUserId = async (
  userId: string,
  updateData: Partial<{
    status: string;
    planId: string;
    trialEndsAt?: Date | null;
    expiresAt?: Date | null;
    startedAt?: Date | null;
    pendingPlanId?: PlanId | null;
  }>,
): Promise<ISubscription | null> => {
  return Subscription.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true },
  );
};
