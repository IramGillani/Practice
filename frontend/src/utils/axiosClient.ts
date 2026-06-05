import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";
import { transformDates } from "@/utils";
import { AUTH_KEYS } from "@/types/Auth";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_KEYS.ACCESS);
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
      response.data.message && toast.success(response.data.message);
    }
    return response;
  },
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        console.log("Attempting to refresh token...");

        const { data } = await axios.post(`${API_URL}users/refresh-token`, {
          token: refreshToken,
        });

        const newAccessToken = data.accessToken;
        localStorage.setItem(AUTH_KEYS.ACCESS, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem(AUTH_KEYS.ACCESS);
        localStorage.removeItem(AUTH_KEYS.REFRESH);
        localStorage.removeItem(AUTH_KEYS.USER);

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
          toast.error("Session expired. Please log in again.");
        }
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    console.error(`❌ API Error:`, errorMessage);
    toast.error(errorMessage);
    return Promise.reject(error);
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
