import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import { storage } from "../utils/localStorage";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,//1second 
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT + identity headers per PRD spec.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.get(STORAGE_KEYS.token);
  const userId = storage.get(STORAGE_KEYS.userId);
  const username = storage.get(STORAGE_KEYS.username);

  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  if (userId) config.headers.set("X-User-Id", userId);
  if (username) config.headers.set("X-User-Name", username);

  return config;
});

// Response interceptor — map HTTP status to global UX rules.
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const msg =
      (error.response?.data as any)?.message ||
      error.message ||
      "Something went wrong";

    if (typeof window !== "undefined") {
      if (status === 401) {

        if (error.config?.url?.includes("/auth/login")) {
            toast.error(
                error.response?.data?.message || "Invalid credentials"
            );
            return Promise.reject(error);
        }
        storage.clearAuth();
        toast.error("Session expired. Please login again.");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      } else if (status === 403) {
        toast.error("Access denied");
        window.location.href = "/403";
      } else if (status === 404) {
        toast.error("Resource not found");
      } else if (status && status >= 500) {
        toast.error("Server error. Please try again.");
      }
      // } else if (!error.response) {
      //   toast.error("Network error — backend unreachable");
      // } else {
      //   toast.error(msg);
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
