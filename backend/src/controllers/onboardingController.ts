import { asyncHandler } from "../utils/asyncHandler";
import * as OnboardingService from "../services/onboardingService";

export const submitOnboarding = asyncHandler(async (req, res) => {
  const { name, url, teamSize } = req.body;

  const user = await OnboardingService.completeOnboarding(req.user._id, {
    name,
    url,
    teamSize,
  });
  return res.status(200).json(user);
});
