import { Response } from "express";

import { generateTokens } from "./generateToken";
import { IUser } from "../types";
import User from "../models/User";

export const sendAuthResponse = async (
  res: Response,
  user: IUser,
  statusCode: number = 200,
) => {

const { accessToken, refreshToken } = generateTokens(user._id,);


  await User.findByIdAndUpdate(user._id, { refreshToken });

  return res.status(statusCode).json({
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
