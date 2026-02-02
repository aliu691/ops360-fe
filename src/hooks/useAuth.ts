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

    /* ============================
       1️⃣ TRY ADMIN LOGIN
    ============================ */
    try {
      console.log("➡️ Trying ADMIN login");

      const adminRes = await apiClient.post(API_ENDPOINTS.login(), {
        email,
        password,
      });

      console.log("✅ ADMIN LOGIN SUCCESS", adminRes.data);

      localStorage.setItem("access_token", adminRes.data.accessToken);
      localStorage.setItem(
        "actor",
        JSON.stringify({
          type: "ADMIN",
          ...adminRes.data.admin,
        })
      );

      setActor({
        type: "ADMIN",
        ...adminRes.data.admin,
      });

      console.log("🎉 Logged in as ADMIN");
      return;
    } catch (err: any) {
      console.error("❌ ADMIN LOGIN FAILED");

      if (axios.isAxiosError(err)) {
        console.error("ADMIN ERROR STATUS:", err.response?.status);
        console.error("ADMIN ERROR DATA:", err.response?.data);
      }

      // swallow ONLY 401
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status !== 401
      ) {
        throw err;
      }
    }

    /* ============================
       2️⃣ TRY USER LOGIN
    ============================ */
    try {
      console.log("➡️ Trying USER login");

      const userRes = await apiClient.post(API_ENDPOINTS.loginUser(), {
        email,
        password,
      });

      console.log("✅ USER LOGIN SUCCESS", userRes.data);

      localStorage.setItem("access_token", userRes.data.accessToken);
      localStorage.setItem(
        "actor",
        JSON.stringify({
          type: "USER",
          ...userRes.data.user,
        })
      );

      setActor({
        type: "USER",
        ...userRes.data.user,
      });

      console.log("🎉 Logged in as USER");
      return;
    } catch (err: any) {
      console.error("❌ USER LOGIN FAILED");

      if (axios.isAxiosError(err)) {
        console.error("USER ERROR STATUS:", err.response?.status);
        console.error("USER ERROR DATA:", err.response?.data);
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
