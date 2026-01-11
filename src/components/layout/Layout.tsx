import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        <aside className="hidden lg:block w-64 bg-gradient-to-b from-[#0f1724] to-[#0a1220] text-white min-h-screen">
          <Sidebar />
        </aside>

        <div className="flex-1 min-h-screen flex flex-col">
          <header>
            <Topbar />
          </header>

          <main className="flex-1 overflow-auto px-8 py-6">
            {/* ✅ THIS is where pages render */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
