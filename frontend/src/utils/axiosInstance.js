import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
});


// REQUEST INTERCEPTOR
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


// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        // refresh token API call
        const response = await axios.post(
          `${BASE_URL}/api/v1/users/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        // save new access token and refresh token
        const { accessToken: newAccessToken, newRefreshToken } = response.data.data;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        if (newRefreshToken) {
          localStorage.setItem(
            "refreshToken",
            newRefreshToken
          );
        }

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {

        // refresh token also expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };