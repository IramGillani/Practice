import { apiRequest } from "@/utils";
import type { Task, User, DashboardData } from "@/types";

const BASE_PATH = "admin";

export const adminService = {
  getDashboardStats: () =>
    apiRequest<DashboardData["stats"]>(`${BASE_PATH}/dashboard`),

  getAllUsers: (page: number, limit: number) =>
    apiRequest<User[]>(`${BASE_PATH}/users?page=${page}&limit=${limit}`),

  getAllTasks: (page: number, limit: number) =>
    apiRequest<Task[]>(`${BASE_PATH}/tasks?page=${page}&limit=${limit}`),

  deleteTask: (id: string) =>
    apiRequest<{ message: string }>(`${BASE_PATH}/tasks/${id}`, {
      method: "DELETE",
    }),

  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`${BASE_PATH}/users/${id}`, {
      method: "DELETE",
    }),
};
