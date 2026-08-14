import { Document, Types } from "mongoose";
import { PlanId } from "./Plan";

export interface ISubscription extends Document {
  userId: Types.ObjectId;

  planId: PlanId;
  plan: Types.ObjectId;
  status: SubscriptionStatus;
  startedAt?: Date;
  expiresAt?: Date | null;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  TRIAL = "trialing",
  PENDING = "pending_payment",
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
}
