import { apiRequest } from "@/utils";
import {
  type AuthResponse,
  type LoginFormValues,
  type SignupFormValues,
} from "@/types";
import type { VerifyEmailPayload } from "@/types";
const BASE_PATH = "users";

export const authService = {
  signup: (userData: SignupFormValues) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/signup`, {
      method: "POST",
      data: userData,
    }),

  login: (credentials: LoginFormValues) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/login`, {
      method: "POST",
      data: credentials,
    }),

  socialLogin: (firebaseToken: string) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/social-login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    }),

  logout: (refreshToken: string) => {
    return apiRequest<{ message: string }>(`${BASE_PATH}/logout`, {
      method: "POST",
      data: { token: refreshToken },
    });
  },
  forgotPassword: (email: string) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/forgot-password`, {
      method: "POST",
      data: { email },
    }),

  resetPassword: (payload: Record<string, string>) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/reset-password`, {
      method: "POST",
      data: payload,
    }),
  verifyEmail: (payload: VerifyEmailPayload) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/verify-email`, {
      method: "POST",
      data: payload,
    }),
  resendVerification: (email: string) =>
    apiRequest<AuthResponse>(`${BASE_PATH}/resend-verification`, {
      method: "POST",
      data: { email },
    }),

  // getProfile: () =>
  //   apiRequest<User>(`${BASE_PATH}/profile`, {
  //     method: "GET",
  //   }),
};
