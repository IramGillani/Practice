import { apiRequest } from "@/utils";
import type {
  Plan,
  PlanSelectionPayload,
  PlanSelectionResponse,
} from "@/types/Plan";
const BASE_PATH = "plans";

export const planService = {
  getPlans: () =>
    apiRequest<{ data: Plan[] }>(`${BASE_PATH}`, {
      method: "GET",
    }),
  selectPlan: (payload: PlanSelectionPayload) =>
    apiRequest<PlanSelectionResponse>(`${BASE_PATH}/selectPlan`, {
      method: "POST",
      data: payload,
    }),
};
