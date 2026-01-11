import { NavLink, useLocation } from "react-router-dom";
import {
  UploadCloud,
  ListOrdered,
  LayoutGrid,
  Settings,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();
  const { admin } = useAuth();

  const menu = [
    {
      name: "KPI Dashboard",
      icon: LayoutGrid,
      path: "/kpi",
    },
    {
      name: "Meetings List",
      icon: ListOrdered,
      path: "/meetings",
    },
    {
      name: "Sales Reps",
      icon: Users,
      path: "/users",
    },

    // 🔐 SUPER ADMIN ONLY
    ...(role === "SUPER_ADMIN"
      ? [
          {
            name: "Manage Admins",
            icon: Shield,
            path: "/admins",
          },
        ]
      : []),

    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="w-64 bg-[#0F172A] text-gray-300 min-h-screen flex flex-col py-8 px-4 shadow-lg">
      <h1 className="text-2xl font-bold px-2 mb-8 text-white">Ops360</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all 
                ${
                  isActive
                    ? "bg-[#263043] border border-[#3C4657] text-white shadow-sm"
                    : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
                }
              `}
            >
              <Icon
                size={20}
                className={isActive ? "text-blue-400" : "text-gray-500"}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* PROFILE SECTION */}
      <div className="mt-auto px-2 pt-8 pb-4">
        {admin && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold uppercase">
              {admin.email?.slice(0, 2)}
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                {admin.email}
              </div>
              <div className="text-xs text-gray-400">
                {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
