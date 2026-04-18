import { apiRequest } from "@/utils";
import type { User } from "@/types";

const BASE_PATH = "profile";

export const userService = {
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest(`${BASE_PATH}/updatePassword`, {
      method: "PATCH",
      data: data,
    }),

  updateProfile: (formData: FormData) =>
    apiRequest<User>(`${BASE_PATH}/updateProfile`, {
      method: "PATCH",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
