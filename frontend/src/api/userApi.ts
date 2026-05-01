import { apiRequest } from "@/utils";
import type { User } from "@/types";

const BASE_PATH = "profile";

export const userService = {
  updateInfo: (data: FormData) =>
    apiRequest<{ user: User }>(`${BASE_PATH}/updateInfo`, {
      method: "PATCH",
      data: data,
    }),
};
