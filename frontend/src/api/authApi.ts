import { apiRequest } from "@/utils";
import {
  AUTH_KEYS,
  type AuthResponse,
  type LoginFormValues,
  type SignupFormValues,
} from "@/types";

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

  logout: () => {
    const token = localStorage.getItem(AUTH_KEYS.REFRESH);
    return apiRequest<{ message: string }>(`${BASE_PATH}/logout`, {
      method: "POST",
      data: { token },
    });
  },

  // getProfile: () =>
  //   apiRequest<User>(`${BASE_PATH}/profile`, {
  //     method: "GET",
  //   }),
};
