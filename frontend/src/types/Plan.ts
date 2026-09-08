import type { User } from "./Auth";

export interface Plan {
  planId: PlanId;
  billingCycle: "monthly" | "yearly";
  name: string;
  price: string | number;
  features: string[];
  isRecommended?: boolean;
  rank: number;
}
export type PlanId = "free" | "individual" | "team" | "enterprise";

export interface Subscription {
  id?: string;
  planId?: PlanId;
  status?: SubscriptionStatus;
  trialEndsAt?: string | null;
  expiresAt?: string | null;
  startedAt?: string | null;
}

export const SubscriptionStatus = {
  TRIAL: "trialing",
  PENDING: "pending_payment",
  ACTIVE: "active",
  CANCELED: "canceled",
  EXPIRED: "expired",
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface PlanSelectionPayload {
  planId: PlanId;
}

export interface PlanSelectionResponse {
  redirectUrl: string;
  user?: User;
}

export type SocketMessage = {
  event: string;
  payload: any;
};
