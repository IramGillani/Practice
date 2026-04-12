import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";
import { transformDates } from "@/utils";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = transformDates(response.data);
    }
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    if (error.response?.status === 401) {
      console.warn("Unauthorized! Clearing session...");
      localStorage.removeItem("token");
    }

    console.error(`❌ API Error:`, errorMessage);
    return Promise.reject(new Error(errorMessage));
  },
);

export async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.request<T>({
    url: endpoint,
    ...options,
  });
  return response.data;
}
