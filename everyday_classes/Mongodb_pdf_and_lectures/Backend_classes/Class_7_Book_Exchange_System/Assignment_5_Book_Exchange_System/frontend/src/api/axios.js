import axios from "axios";

// Base URL for the Book Exchange backend (Express + MongoDB).
// The backend mounts everything under /api (see server.js: app.use("/api/books", ...)).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "chapter-verse-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: BASE_URL,
  // No default Content-Type here on purpose: axios sets "application/json"
  // automatically for plain object bodies, and needs to set its own
  // "multipart/form-data; boundary=..." header for FormData bodies (image
  // uploads). Hardcoding "application/json" here would break uploads.
  timeout: 15000,
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so components can rely on a consistent shape,
// and clear a stale/expired token on 401 so the UI drops back to "logged out".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    if (error.response?.status === 401) {
      clearToken();
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;
