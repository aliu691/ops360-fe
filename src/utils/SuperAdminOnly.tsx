import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function SuperAdminOnly({ children }: { children: JSX.Element }) {
  const { role } = useAuth();

  if (role !== "SUPER_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
