import { IPlan } from "@/types/Plan";
import { Schema, model } from "mongoose";
const PlanSchema = new Schema<IPlan>(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      enum: ["free", "individual", "team", "enterprise"],
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "free"],
    },
    stripePriceId: { type: String, required: true },
    features: { type: [String], default: [] },
    isRecommended: { type: Boolean, default: false },
    maxTeamSize: { type: Number, required: true },
    trialPeriodDays: { type: Number, default: 0 },
    rank: { type: Number, index: true },
  },
  { timestamps: true },
);

export const Plan = model<IPlan>("Plan", PlanSchema);
