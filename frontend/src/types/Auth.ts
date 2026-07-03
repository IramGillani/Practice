export interface User {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  profileUrl: string;
  taskCount?: number;
  isVerified: boolean;
}

import * as yup from "yup";

export interface AuthContextType {
  user: User | null;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserData: (userData: User) => void;
  isLoading: boolean;
  handleSocialLogin: (provider: Provider) => void;
  handleResendEmail: (email: string) => Promise<void>;
}

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type SignupFormValues = yup.InferType<typeof signupSchema>;

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export const AUTH_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
  USER: "user",
};

export const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),

  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export type PasswordFormValues = yup.InferType<typeof passwordSchema>;

export type Provider = "google" | "github";

export interface SocialLoginPayload {
  token: string;
}

export interface SuccessPageProps {
  heading: string;
  desc: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface VerifyEmailPayload {
  token: string;
  email: string;
}
