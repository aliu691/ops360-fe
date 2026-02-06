import { useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import axios from "axios";

type Actor =
  | {
      type: "USER";
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      department: string;
    }
  | {
      type: "ADMIN";
      id: number;
      email: string;
      role: "ADMIN" | "SUPER_ADMIN";
    };

export function useAuth() {
  const [actor, setActor] = useState<Actor | null>(() => {
    const raw = localStorage.getItem("actor");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email: string, password: string) => {
    console.log("🔐 LOGIN START", { email });

    try {
      const res = await apiClient.post(API_ENDPOINTS.login(), {
        email,
        password,
      });

      const { accessToken, actor } = res.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("actor", JSON.stringify(actor));

      setActor(actor);

      console.log("🎉 Logged in as", actor.type);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("LOGIN ERROR:", err.response?.data);
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("actor");
    setActor(null);
    window.location.href = "/login";
  };

  return {
    actor,
    role: actor?.type === "ADMIN" ? actor.role : "USER",
    isAdmin: actor?.type === "ADMIN",
    isSuperAdmin: actor?.type === "ADMIN" && actor.role === "SUPER_ADMIN",
    isUser: actor?.type === "USER",
    isAuthenticated: !!actor,
    login,
    logout,
  };
}
