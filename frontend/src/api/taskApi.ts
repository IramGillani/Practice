import type { Task } from "@/types";
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { transformDates } from "@/utils";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_PATH = "todos";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data) {
      response.data = transformDates(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Session expired. Redirecting to login...");
    }
    return Promise.reject(error);
  },
);

async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  try {
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
  getAll: () => apiRequest<Task[]>(BASE_PATH),

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
