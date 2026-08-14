import { apiRequest } from "@/utils";
import type { OnboardingFormData, OnboardingResponse } from "@/types";

const BASE_PATH = "onboarding";

export const onboardingService = {
  submitOnboarding: (payload: OnboardingFormData) =>
    apiRequest<OnboardingResponse>(`${BASE_PATH}`, {
      method: "POST",
      data: payload,
    }),
};
