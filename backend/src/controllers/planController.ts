import * as PlanService from "../services/planService";
import { asyncHandler } from "../utils/asyncHandler";
import { Request } from "express";
import { PlanSelectionPayload } from "@/types/Plan";

export const getPlans = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const plans = await PlanService.getAvailablePlans(userId);

  return res.status(200).json({
    data: plans,
  });
});

export const getRedirectUrl = asyncHandler(
  async (req: Request<{}, {}, PlanSelectionPayload>, res): Promise<void> => {
    const { planId } = req.body;
    const userId = req.user?._id;

    const result = await PlanService.getUrl(userId, planId);
    console.log("result for user", result);

    res.status(200).json(result);
  },
);
