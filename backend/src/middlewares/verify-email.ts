import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const requireVerifiedEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email before updating.",
      code: "EMAIL_NOT_VERIFIED",
    });
  }

  next();
};
