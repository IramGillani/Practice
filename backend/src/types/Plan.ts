import { Document } from "mongoose";
import { IUser } from "./User";

export interface IPlan extends Document {
  planId: PlanId;
  name: string;
  price: number;

  billingCycle: "monthly" | "yearly" | "free";
  stripePriceId?: string;
  features: string[];
  isRecommended: boolean;
  maxTeamSize: number;
  trialPeriodDays: number;
}

export interface IPlanData {
  planId: PlanId;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly" | "free";
  stripePriceId?: string;
  features: string[];
  isRecommended: boolean;
  maxTeamSize: number;
  trialPeriodDays: number;
}

// 2. Mongoose Document type (for un-lean Mongoose queries)
export interface IPlanDocument extends IPlanData, Document {}

export type PlanId = "free" | "individual" | "team" | "enterprise";

export interface PlanSelectionPayload {
  planId: PlanId;
}

export interface PlanSelectionResponse {
  redirectUrl: string;
  user?: IUser | null;
}
