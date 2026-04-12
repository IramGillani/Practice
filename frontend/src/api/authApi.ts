import { apiRequest } from "@/utils";
import type { AuthResponse, LoginFormValues, SignupFormValues } from "@/types";

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

  logout: () =>
    apiRequest<{ message: string }>(`${BASE_PATH}/logout`, {
      method: "POST",
    }),

  // getProfile: () =>
  //   apiRequest<User>(`${BASE_PATH}/profile`, {
  //     method: "GET",
  //   }),
};
