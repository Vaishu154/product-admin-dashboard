import axios from "axios";
import { getAccessToken, clearStoredAuth } from "@/utils/authStorage";
import { getErrorMessage } from "@/utils/errors";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.appMessage = getErrorMessage(error);

    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    if (
      status === 401 &&
      !isLoginRequest &&
      typeof window !== "undefined"
    ) {
      clearStoredAuth();
      window.dispatchEvent(new Event("auth:unauthorized"));

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
