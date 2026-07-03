import { Request, Response, NextFunction } from "express";
import Task from "../models/Todo";
import User from "../models/User";

export const checkTodoLimit = async (
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
  try {
    if (user?.isVerified) {
      return next();
    }

    const TODO_LIMIT = 5;
    const currentTodoCount = await Task.countDocuments({
      userId: req.user?._id,
    });

    if (currentTodoCount >= TODO_LIMIT) {
      return res.status(403).json({
        message:
          "Limit reached. Please verify your email to create unlimited tasks.",
      });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error enforcing feature limits" });
  }
};
