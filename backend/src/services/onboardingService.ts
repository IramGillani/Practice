import * as UserRepo from "../repositories/userRepo";
import * as SubscriptionRepo from "../repositories/subscriptionRepo";
import { AppError } from "../utils/customErrorHandler";
import { OnboardingFormData } from "@/types";

export const completeOnboarding = async (
  userId: string,
  data: OnboardingFormData,
) => {
  const user = await UserRepo.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  const updatedUser = await UserRepo.updateById(userId, {
    $set: {
      organization: {
        name: data.name,
        url: data.url,
        teamSize: data.teamSize,
      },
      isOnboardingCompleted: true,
    },
  });

  await SubscriptionRepo.upsertLocalSubscription(userId, null, null);

  if (!updatedUser) {
    throw new AppError(500, "Failed to update onboarding details.");
  }
  console.log("the updatedOne", updatedUser);
  return updatedUser;
};
