import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("token") ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const baseURL = import.meta.env.VITE_API_URL;

      const resp = await axios.post(
        `${baseURL}/auth/token/refresh/`,
        {},
        { withCredentials: true },
      );

      const newAccessToken = resp.data?.access;

      if (newAccessToken) {
        setAccessToken(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      }
    } catch (refreshError) {
      console.error("token refresh failed", refreshError);

      setAccessToken(null);
      localStorage.removeItem("accessToken");

      return Promise.reject(error);
    }
  },
);

export default api;
