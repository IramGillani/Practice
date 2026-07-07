import * as authTokensRepo from "../repositories/authTokensRepo";
import * as UserRepo from "../repositories/userRepo";
import { cryptoUtil } from "../utils/generateRandomToken";
import { sendEmail } from "../utils/sendEmail";
import { EmailType, ResetPasswordProps, VerifyEmailProps } from "../types";
import { AppError } from "../utils/customErrorHandler";
import { isTokenExpired } from "../utils/tokenExpChecker";
import { LoginProps } from "../types/Auth";
import { adminAuth } from "../config/firebase";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateToken";

export const signup = async (name: string, email: string, password: string) => {
  if (!password || password.trim() === "") {
    throw new AppError(400, "Password is required for email registration.");
  }
  const existingUser = await UserRepo.findUserByEmail(email);

  if (existingUser) {
    throw new AppError(409, "Email already registered");
  }

  const user = await UserRepo.createUser({
    name,
    email,
    password,
    isVerified: false,
  });

  const rawToken = cryptoUtil.generateRandomToken();
  const hashedToken = cryptoUtil.hashToken(rawToken);

  await authTokensRepo.saveAuthToken(
    user._id,
    hashedToken,
    "EMAIL_VERIFICATION",
  );

  const link = `${process.env.CLIENT_URL}verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    email,
    rawToken,
    route: "verify-email",
    type: EmailType.EMAIL_VERIFICATION,
  });

  return user;
};

export const login = async ({ email, password }: LoginProps) => {
  const user = await UserRepo.findUserByEmail(email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.isSocialLogin) {
    throw new AppError(
      403,
      "This account uses social sign-in. Please log in using your social provider.",
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  return user;
};

export const logout = async (token: string) => {
  if (!token) {
    throw new AppError(400, "Refresh Token is required");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
    _id: string;
  };

  await UserRepo.clearRefreshToken(decoded._id);
};

export const socialLogin = async (authHeader?: string) => {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "Missing or malformed authorization header");
  }

  const firebaseToken = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = await adminAuth.verifyIdToken(firebaseToken);
  } catch (error) {
    console.error("Firebase verification failed:", error);

    throw new AppError(
      401,
      "Invalid or expired provider configuration mapping token.",
    );
  }

  const { email, name, email_verified } = decoded;

  if (!email) {
    throw new AppError(
      400,
      "Provider must provide a valid verified email address.",
    );
  }

  const existingUser = await UserRepo.findUserByEmail(email);

  if (existingUser) {
    if (!existingUser.isSocialLogin) {
      throw new AppError(
        409,
        "An account with this email already exists using standard registration. Please enter your password manually.",
      );
    }

    return existingUser;
  }

  return UserRepo.createSocialUser({
    email,
    name: name ?? "",
    isVerified: email_verified,
  });
};

export const forgotPassword = async (email: string) => {
  const genericMessage =
    "If an account exists with that email, a reset link has been sent.";

  const user = await UserRepo.findUserByEmail(email);

  if (!user) {
    return genericMessage;
  }

  if (user.isSocialLogin) {
    console.log(`Password reset blocked for social account: ${email}`);
    return genericMessage;
  }

  const rawToken = cryptoUtil.generateRandomToken();
  const hashedToken = cryptoUtil.hashToken(rawToken);

  await authTokensRepo.saveAuthToken(user._id, hashedToken, "PASSWORD_RESET");

  await sendEmail({
    email,
    rawToken,
    route: "reset-password",
    type: EmailType.PASSWORD_RESET,
  });

  return genericMessage;
};

export const resetPassword = async ({
  token,
  email,
  password,
}: ResetPasswordProps) => {
  if (!token || !email || !password) {
    throw new AppError(400, "All fields (token, email, password) are required");
  }

  const user = await UserRepo.findUserByEmail(email);

  if (!user) {
    throw new AppError(400, "Invalid or expired token");
  }

  if (user.isSocialLogin) {
    throw new AppError(
      400,
      "Accounts registered via social provider cannot modify local password values.",
    );
  }

  const hashedToken = cryptoUtil.hashToken(token);

  const tokenDoc = await authTokensRepo.findAuthToken(
    user._id,
    hashedToken,
    EmailType.PASSWORD_RESET,
  );

  if (!tokenDoc) {
    throw new AppError(400, "Invalid or expired token");
  }

  const ONE_HOUR = 60 * 60 * 1000;

  if (isTokenExpired(tokenDoc.createdAt, ONE_HOUR)) {
    await authTokensRepo.deleteAuthToken(
      tokenDoc._id,
      EmailType.PASSWORD_RESET,
    );

    throw new AppError(400, "Invalid or expired token");
  }

  user.password = password;
  await user.save();

  await authTokensRepo.deleteAuthTokens(user._id, EmailType.PASSWORD_RESET);

  return "Password reset successful";
};

export const verifyEmail = async ({ token, email }: VerifyEmailProps) => {
  if (!token || !email) {
    throw new AppError(400, "All fields (token, email) are required");
  }

  const user = await UserRepo.findUserByEmail(email);

  if (!user) {
    throw new AppError(400, "Invalid or expired token");
  }

  if (user.isSocialLogin) {
    throw new AppError(
      400,
      "Accounts registered via social provider cannot verify via local tokens.",
    );
  }

  if (user.isVerified) {
    throw new AppError(400, "This email address has already been verified.");
  }

  const hashedToken = cryptoUtil.hashToken(token);

  const tokenDoc = await authTokensRepo.findAuthToken(
    user._id,
    hashedToken,
    EmailType.EMAIL_VERIFICATION,
  );

  if (!tokenDoc) {
    throw new AppError(400, "Invalid or expired token");
  }

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  if (isTokenExpired(tokenDoc.createdAt, TWENTY_FOUR_HOURS)) {
    await authTokensRepo.deleteAuthToken(
      tokenDoc._id,
      EmailType.EMAIL_VERIFICATION,
    );

    throw new AppError(400, "Invalid or expired token");
  }

  user.isVerified = true;
  await user.save();

  await authTokensRepo.deleteAuthTokens(user._id, EmailType.EMAIL_VERIFICATION);

  return "Email verification successful";
};

export const resendVerificationEmail = async (email: string) => {
  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const genericMessage =
    "If the email exists, a new verification link has been sent.";

  const user = await UserRepo.findUserByEmail(email);

  if (!user) {
    return genericMessage;
  }

  if (user.isVerified) {
    throw new AppError(400, "This email address is already verified.");
  }

  const rawToken = cryptoUtil.generateRandomToken();
  const hashedToken = cryptoUtil.hashToken(rawToken);

  await authTokensRepo.saveAuthToken(
    user._id,
    hashedToken,
    EmailType.EMAIL_VERIFICATION,
  );

  await sendEmail({
    email,
    rawToken,
    route: "verify-email",
    type: EmailType.EMAIL_VERIFICATION,
  });

  return "A fresh verification link has been sent to your email.";
};

export const refreshAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, "Refresh Token required");
  }

  let decoded: { _id: string };

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      _id: string;
    };
  } catch {
    throw new AppError(403, "Invalid or expired refresh token");
  }

  const user = await UserRepo.findById(decoded._id);

  if (!user || user.refreshToken !== token) {
    throw new AppError(403, "Invalid refresh token");
  }

  const { accessToken } = generateTokens(decoded._id, user.role);

  return accessToken;
};
