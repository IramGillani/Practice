import { Schema, model } from "mongoose";
import { ISubscription } from "../types/Subscription";
import { SubscriptionStatus } from "../types/Subscription";
const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    planId: {
      type: String,
      enum: ["free", "individual", "team", "enterprise"],
      default: null,
    },

    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    status: {
      type: String,

      enum: Object.values(SubscriptionStatus),
      default: null,
    },
    trialEndsAt: {
      type: Date,
      default: null,
    },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    pendingPlanId: { type: String, default: null },
  },

  { timestamps: true },
);

export const Subscription = model<ISubscription>(
  "Subscription",
  SubscriptionSchema,
);
