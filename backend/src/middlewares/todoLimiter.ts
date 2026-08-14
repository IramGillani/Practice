import { Request, Response, NextFunction } from "express";
import Task from "../models/Todo";
import { Subscription } from "../models/Subscription";
import { SubscriptionStatus } from "@/types/Subscription";

export const checkTodoLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User session not found." });
    }

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return res.status(403).json({
        message:
          "No active subscription found. Please select a plan to continue.",
      });
    }

    const isPaidOrTrial =
      subscription.planId !== "free" &&
      [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(
        subscription.status,
      );

    if (isPaidOrTrial) {
      return next();
    }

    const TODO_LIMIT = 5;
    const currentTodoCount = await Task.countDocuments({ userId });

    if (currentTodoCount >= TODO_LIMIT) {
      return res.status(403).json({
        message: `Free plan limit reached (${TODO_LIMIT} tasks). Please upgrade to an Individual or Team plan for unlimited tasks.`,
        code: "PLAN_LIMIT_REACHED",
      });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error enforcing feature limits." });
  }
};
