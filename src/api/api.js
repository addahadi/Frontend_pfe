import { getAccessToken,setTokens,clearTokens } from "@/utils/token";
import axios from "axios";


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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (err) {
        clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

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