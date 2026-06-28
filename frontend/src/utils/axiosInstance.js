import axios from "axios";
import { API_BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
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

// ---------------- REFRESH QUEUE ----------------
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (token) => {
  pendingQueue.forEach(({ resolve }) => resolve(token));
  pendingQueue = [];
};

const rejectQueue = (error) => {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
};

const REFRESH_URL = "/api/v1/users/refresh-token";

// ---------------- RESPONSE INTERCEPTOR ----------------
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Network error
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isRefreshCall = originalRequest?.url?.includes(REFRESH_URL);

    // Don't retry refresh request or already retried request
    const isAuthEndpoint =
    originalRequest?.url?.includes("/login") ||
    originalRequest?.url?.includes("/register");

    if (status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
   }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If refresh request already running, wait for it
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}${REFRESH_URL}`,
        { refreshToken },
        {
          withCredentials: true,
        }
      );

      const newAccessToken = data?.data?.accessToken;
      const newRefreshToken = data?.data?.newRefreshToken;

      if (!newAccessToken) {
        throw new Error("Refresh response did not include an access token");
      }

      localStorage.setItem("accessToken", newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      resolveQueue(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      rejectQueue(refreshError);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const extractErrorMessage = (error) => {
  if (!error) return "Something went wrong. Please try again.";

  if (!error.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  const data = error.response.data;

  if (typeof data === "string") return data;

  return (
    data?.message ||
    data?.error ||
    data?.errors?.[0]?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

export { axiosInstance };