import axios from "axios";
import { clearTokens , getAccessToken , setAccessToken } from "./token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const MAX_RETRIES = 3;
const BASE_DELAY = 500;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Initialize retry count
  if (!config.metadata) {
    config.metadata = { retryCount: 0 };
  }

  return config;
});


// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔐 1️⃣ Handle 401 (Token expired → refresh flow)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`);

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

    // 🔁 2️⃣ Retry Logic (network errors or 5xx)
    const shouldRetry =
      !error.response || // network error
      (error.response.status >= 500 &&
        error.response.status < 600);

    if (
      shouldRetry &&
      originalRequest?.metadata?.retryCount < MAX_RETRIES
    ) {
      originalRequest.metadata.retryCount += 1;

      const delay =
        BASE_DELAY *
        Math.pow(2, originalRequest.metadata.retryCount);

      console.warn(
        `Retrying request... Attempt ${originalRequest.metadata.retryCount}`
      );

      await sleep(delay);

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;