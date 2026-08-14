import { asyncHandler } from "../utils/asyncHandler";
import * as OnboardingService from "../services/onboardingService";

export const submitOnboarding = asyncHandler(async (req, res) => {
  const { name, url, teamSize } = req.body;

  const user = await OnboardingService.completeOnboarding(req.user._id, {
    name,
    url,
    teamSize,
  });
  console.log("user formatted JSON:", user.toJSON());
  console.log("Direct virtual access:", user.subscription);
  console.log("user sending back after submitting onboarding", user);
  return res.status(200).json(user);
});
