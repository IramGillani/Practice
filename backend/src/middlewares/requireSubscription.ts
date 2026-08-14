import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    subscriptionStatus: string;
    isOnboardingCompleted: boolean;
  };
}
export const requireActiveSubscription = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.subscriptionStatus !== "active") {
    res.status(403).json({
      success: false,
      message:
        "Access denied. Active paid subscription required to use premium features.",
    });
    return;
  }
  next();
};
