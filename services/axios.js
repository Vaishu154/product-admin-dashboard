/**
 * Shared Axios Instance Setup
 *
 * Configures the base HTTP client for all API interactions with DummyJSON.
 * Features:
 * - Base URL: https://dummyjson.com
 * - Request Interceptor: Automatically attaches the stored Bearer token to headers.
 * - Response Interceptor: Formats API error messages and handles 401 unauthorized responses.
 */

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

// Inject bearer token into outgoing API requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle error responses and redirect to /login on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.appMessage = getErrorMessage(error);

    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginRequest && typeof window !== "undefined") {
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
