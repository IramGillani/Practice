import { apiRequest } from "@/utils";
import type { Task, User, DashboardData } from "@/types";
import type { PaginatedResponse } from "@/types";

const BASE_PATH = "admin";

export const adminService = {
  getDashboardStats: () =>
    apiRequest<DashboardData["stats"]>(`${BASE_PATH}/dashboard`),

  getAllUsers: (page: number, limit: number, search: string = "") =>
    apiRequest<PaginatedResponse<User[]>>(
      `${BASE_PATH}/users?page=${page}&limit=${limit}&search=${search}`,
    ),

  getAllTasks: (page: number, limit: number, search: string = "") =>
    apiRequest<PaginatedResponse<Task[]>>(
      `${BASE_PATH}/tasks?page=${page}&limit=${limit}&search=${search}`,
    ),

  deleteTask: (id: string) =>
    apiRequest<{ message: string }>(`${BASE_PATH}/tasks/${id}`, {
      method: "DELETE",
    }),

  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`${BASE_PATH}/users/${id}`, {
      method: "DELETE",
    }),
};
