// src/lib/api/client.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from "@/lib/utils/token";
import { refreshAccessToken } from "./auth";
import { API_BASE_URL } from "@/lib/utils/constants";
import { getLoadingRef } from "@/components/global-loader-access";

console.log("🌍 API Base URL:dd", API_BASE_URL);

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const loader = getLoadingRef();
    loader?.showLoader();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("show-loader"));
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    const loader = getLoadingRef();
    loader?.hideLoader();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const loader = getLoadingRef();
    if (response.config.url?.includes("/login")) {
      setTimeout(() => {
        loader?.hideLoader();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("hide-loader"));
        }
      },800);
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("hide-loader"));
      }
      loader?.hideLoader();
    }

    return response;
  },
  async (error: AxiosError) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("hide-loader"));
    }
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest); // retry original request
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    const loader = getLoadingRef();
    loader?.hideLoader();

    // Other errors
    return Promise.reject(error);
  }
);

export default apiClient;
