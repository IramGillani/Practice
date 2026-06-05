import { apiRequest } from "@/utils";

import type { Task } from "@/types";

const BASE_PATH = "todos";

export const taskService = {
  // getAll: () => apiRequest<Task[]>(BASE_PATH),
  getAll: (limit: number = 6, skip: number = 0) =>
    apiRequest<{ tasks: Task[]; hasMore: boolean }>(
      `${BASE_PATH}?limit=${limit}&skip=${skip}`,
    ),

  create: (taskText: string) =>
    apiRequest<Task>(BASE_PATH, {
      method: "POST",
      data: { text: taskText },
    }),

  update: (id: string, updates: Partial<Task>) =>
    apiRequest<Task>(`${BASE_PATH}/${id}`, {
      method: "PATCH",
      data: updates,
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`${BASE_PATH}/${id}`, {
      method: "DELETE",
    }),
};
