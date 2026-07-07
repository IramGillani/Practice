import { Request, Response } from "express";
import { sendAuthResponse } from "../utils/authHelper";

import * as AuthService from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await AuthService.signup(name, email, password);

  return sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await AuthService.login({ email, password });

  return sendAuthResponse(res, user, 200);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  await AuthService.logout(token);

  return res.json({
    message: "Logged out successfully",
  });
});

export const socialLogin = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  const user = await AuthService.socialLogin(authHeader);

  return sendAuthResponse(res, user, 200);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const message = await AuthService.forgotPassword(email);

  return res.status(200).json({
    message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;

  const message = await AuthService.resetPassword({
    token,
    email,
    password,
  });

  return res.status(200).json({
    message,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.body;

  const message = await AuthService.verifyEmail({
    token,
    email,
  });

  return res.status(200).json({
    message,
  });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const message = await AuthService.resendVerificationEmail(email);

  return res.status(200).json({
    message,
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const accessToken = await AuthService.refreshAccessToken(token);

  return res.status(200).json({
    accessToken,
  });
});

// export const getProfile = async (req: any, res: Response) => {
//   if (req.user) {
//     res.json(req.user);
//   } else {
//     res.status(404).json({ message: "User not found" });
//   }
// };
