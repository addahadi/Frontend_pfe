import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor — log + auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data or throw clean error
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message
                 || error.response?.data?.error
                 || error.message
                 || 'Une erreur est survenue';
    return Promise.reject(new Error(message));
  }
);

export default api;
