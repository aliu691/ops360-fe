import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from "react-router-dom";
import { ListOrdered, LayoutGrid, Settings, Users, } from "lucide-react";
export default function Sidebar() {
    const location = useLocation();
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
            name: "Users",
            icon: Users,
            path: "/users", // 👈 User List page
        },
        {
            name: "Settings",
            icon: Settings,
            path: "/settings",
        },
    ];
    return (_jsxs("div", { className: "w-64 bg-[#0F172A] text-gray-300 min-h-screen flex flex-col py-8 px-4 shadow-lg", children: [_jsx("h1", { className: "text-2xl font-bold px-2 mb-8 text-white", children: "Ops360" }), _jsx("nav", { className: "flex flex-col gap-2", children: menu.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (_jsxs(NavLink, { to: item.path, className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all 
                ${isActive
                            ? "bg-[#263043] border border-[#3C4657] text-white shadow-sm"
                            : "text-gray-400 hover:bg-[#1E293B] hover:text-white"}
              `, children: [_jsx(Icon, { size: 20, className: isActive
                                    ? "text-blue-400"
                                    : "text-gray-500 group-hover:text-white" }), _jsx("span", { className: "text-sm font-medium", children: item.name })] }, item.name));
                }) }), _jsx("div", { className: "mt-auto px-2 pt-8 pb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold", children: "JD" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold text-white", children: "John Doe" }), _jsx("div", { className: "text-xs text-gray-400", children: "View Profile" })] })] }) })] }));
}
