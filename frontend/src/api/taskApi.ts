import type { Task } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  console.log(
    `🚀 API Request: [${options?.method || "GET"}] ${url}`,
    options?.body ? JSON.parse(options.body as string) : "",
  );

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown Error" }));
    console.error("❌ API Error Detail:", error);
    throw new Error(error.message || `API Request Failed: ${response.status}`);
  }

  const data = await response.json();

  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (key === "createdAt" || key === "updatedAt") return new Date(value);
    return value;
  });
}

export const taskService = {
  getAll: () => apiRequest<Task[]>("/"),

  create: (taskText: string) =>
    apiRequest<Task>("/", {
      method: "POST",
      body: JSON.stringify({ text: taskText }),
    }),

  update: (id: string, updates: Partial<Task>) =>
    apiRequest<Task>(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/${id}`, {
      method: "DELETE",
    }),
};
