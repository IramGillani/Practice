import User from "../models/User";
import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { sendAuthResponse } from "../utils/authHelper";
import { adminAuth } from "../config/firebase";

import { generateTokens } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.trim() === "") {
      return res
        .status(400)
        .json({ message: "Password is required for email registration." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    console.log("✨ User Created:", user);

    return sendAuthResponse(res, user, 201);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    res.status(500).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 User Found:", email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(isMatch);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return sendAuthResponse(res, user, 200);
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Refresh Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      _id: string;
    };

    await User.findByIdAndUpdate(decoded._id, { refreshToken: null });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(200).json({ message: "Session already cleared" });
  }
};
export const socialLogin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or malformed authorization header" });
  }

  const firebaseToken = authHeader.split(" ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(firebaseToken);
    const { email, name } = decoded;

    if (!email) {
      return res.status(400).json({
        message: "Provider must provide a valid verified email address.",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: name,
      });
    }

    return sendAuthResponse(res, user, 200);
  } catch (error) {
    console.error("🔥 Detailed Firebase Admin Verification Error:", error);
    return res.status(401).json({
      message: "Invalid or expired provider configuration mapping token.",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ message: "Refresh Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      _id: string;
    };
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const { accessToken } = generateTokens(decoded._id, user.role);

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// export const getProfile = async (req: any, res: Response) => {
//   if (req.user) {
//     res.json(req.user);
//   } else {
//     res.status(404).json({ message: "User not found" });
//   }
// };
