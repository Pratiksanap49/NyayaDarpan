import axios from "axios";
import { AUTH_STORAGE_KEYS } from "../constants/app.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const getStoredAuth = () => {
  for (const storage of [localStorage, sessionStorage]) {
    const token = storage.getItem(AUTH_STORAGE_KEYS.TOKEN);

    if (token) {
      return { storage, token };
    }
  }

  return null;
};

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

api.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth();

  if (storedAuth) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.endsWith("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      clearStoredAuth();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
