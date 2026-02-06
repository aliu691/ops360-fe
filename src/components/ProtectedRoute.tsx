import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  /** Only applies to ADMIN actors */
  allowedRoles?: Array<"ADMIN" | "SUPER_ADMIN">;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { actor, isAuthenticated } = useAuth();

  // 🔐 Not logged in
  if (!isAuthenticated || !actor) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role-based access (ADMIN only)
  if (allowedRoles) {
    // USER trying to access ADMIN/SUPER_ADMIN route
    if (actor.type !== "ADMIN") {
      return <Navigate to="/" replace />;
    }

    // ADMIN but wrong role
    if (!allowedRoles.includes(actor.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
