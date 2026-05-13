import { Response } from "express";

import { generateTokens } from "./generateToken";
import { IUser } from "../types";
import User from "../models/User";

export const sendAuthResponse = async (
  res: Response,
  user: IUser,
  statusCode: number = 200,
) => {
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  return res.status(statusCode).json({
    accessToken,
    refreshToken,
    user: user,
  });
};
