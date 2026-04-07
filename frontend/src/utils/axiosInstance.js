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

// ✅ Response interceptor (handle 401 by clearing token and redirecting)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      console.error("API ERROR:", {
        status,
        data: error.response.data,
      });

      if (status === 401) {
        // Token expired / not logged in - clear storage and redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject({
          type: "AUTH_ERROR",
          message: "Unauthorized - Session expired",
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