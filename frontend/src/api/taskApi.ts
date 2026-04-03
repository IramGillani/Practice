import type { Task } from "@/types";
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { transformDates } from "@/utils";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptors ---

// 1. Request Interceptor: Actions before the request is sent
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token"); // Or your auth store
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 [Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. Response Interceptor: Actions after the response is received
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Automatically transform dates for every successful response
    if (response.data) {
      response.data = transformDates(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Global Error Handling (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      console.error("Session expired. Redirecting to login...");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// --- Simplified apiRequest ---

async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  try {
    // The interceptors now handle logging and date transformation!
    const response = await api.request<T>({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || axiosError.message;

    console.error("❌ API Error:", errorMessage);
    throw new Error(errorMessage);
  }
}

export const taskService = {
  getAll: () => apiRequest<Task[]>("/todos"),

  create: (taskText: string) =>
    apiRequest<Task>("todos", {
      method: "POST",
      data: { text: taskText },
    }),

  update: (id: string, updates: Partial<Task>) =>
    apiRequest<Task>(`todos/${id}`, {
      method: "PATCH",
      data: updates,
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`todos/${id}`, {
      method: "DELETE",
    }),
};
