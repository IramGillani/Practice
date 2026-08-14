import { Subscription } from "@/models/Subscription";
import { SubscriptionStatus } from "@/types/Subscription";
import { ISubscription } from "@/types/Subscription";

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
  trialEndsAt?: Date;
  startedAt?: Date;
  expiresAt?: Date;
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
  updateData: Partial<{ status: string; planId: string; trialEndsAt?: Date }>,
): Promise<ISubscription | null> => {
  return Subscription.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true },
  );
};
