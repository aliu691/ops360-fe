import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/users/login");

    // 🔐 Only force logout on 401s outside auth
    if (status === 401 && !isAuthEndpoint) {
      console.warn("🔒 401 outside auth — logging out");

      localStorage.removeItem("access_token");
      localStorage.removeItem("actor");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);
