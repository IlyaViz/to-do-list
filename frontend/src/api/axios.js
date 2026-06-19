import axios from "axios";
import { refresh } from "../features/auth/authApi";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("token")) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;

      try {
        await refresh();

        return api(originalRequest);
      } catch (err) {
        console.warn("refresh failed", err);

        try {
          setAccessToken(null);
          localStorage.removeItem("accessToken");
        } catch (e) {
          console.warn("failed to clear access token", e);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
