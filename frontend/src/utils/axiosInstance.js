import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // slightly increased
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor (attach token)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (NO redirect here)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      console.error("API ERROR:", {
        status,
        data: error.response.data,
      });

      // ❌ DO NOT redirect automatically
      // Let frontend handle it

      if (status === 401) {
        // Token expired / not logged in
        return Promise.reject({
          type: "AUTH_ERROR",
          message: "Unauthorized",
          original: error,
        });
      }

      if (status === 500) {
        return Promise.reject({
          type: "SERVER_ERROR",
          message: "Server error",
          original: error,
        });
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };