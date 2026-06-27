import User from "../models/User";
import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { cryptoUtil } from "../utils/generateResetToken";
import { sendAuthResponse } from "../utils/authHelper";
import { adminAuth } from "../config/firebase";

import { generateTokens } from "../utils/generateToken";
import { Password_Reset } from "../models/Password-reset";
import { sendEmail } from "../utils/sendEmail";

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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isSocialLogin) {
      return res.status(403).json({
        message:
          "This account uses social sign-in. Please log in using your social provider.",
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
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

    if (user) {
      if (!user.isSocialLogin) {
        return res.status(409).json({
          message:
            "An account with this email already exists using standard registration. Please enter your password manually.",
        });
      }
    } else {
      user = await User.create({
        email,
        name: name,
        isSocialLogin: true,
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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({
    email,
  });

  const genericResponse = {
    message:
      "If an account exists with that email, a reset link has been sent.",
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  if (user.isSocialLogin) {
    console.log(`Password reset blocked for social account: ${email}`);
    return res.status(200).json(genericResponse);
  }

  await Password_Reset.deleteMany({
    userId: user._id,
  });

  const rawToken = cryptoUtil.generateResetToken();

  const hashedToken = cryptoUtil.hashToken(rawToken);

  await Password_Reset.create({
    userId: user._id,
    token: hashedToken,
  });

  const resetLink = `${process.env.CLIENT_URL}reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  await sendEmail({ email, resetLink });

  return res.status(200).json(genericResponse);
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        message: "All fields (token, email, password) are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.isSocialLogin) {
      return res.status(400).json({
        message:
          "Accounts registered via social provider cannot modify local password values.",
      });
    }

    const hashedToken = cryptoUtil.hashToken(token);

    const tokenDoc = await Password_Reset.findOne({
      userId: user._id,
      token: hashedToken,
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const ONE_HOUR = 60 * 60 * 1000;
    const isExpired =
      Date.now() - new Date(tokenDoc.createdAt).getTime() > ONE_HOUR;

    if (isExpired) {
      await Password_Reset.deleteOne({ _id: tokenDoc._id });
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    await user.save();

    await Password_Reset.deleteMany({ userId: user._id });

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      message: "An internal server error occurred",
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
