import { useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";

type Admin = {
  id: number;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await apiClient.post(API_ENDPOINTS.login(), {
      email,
      password,
    });

    localStorage.setItem("admin_token", res.data.accessToken);
    localStorage.setItem("admin", JSON.stringify(res.data.admin));

    setAdmin(res.data.admin);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    setAdmin(null);
    window.location.href = "/login";
  };

  return {
    admin,
    role: admin?.role,
    isAuthenticated: !!admin,
    login,
    logout,
  };
}
