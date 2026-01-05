import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
export default function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!id)
            return;
        apiClient
            .get(API_ENDPOINTS.getUserById(Number(id)))
            .then((res) => setUser(res.data.item))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [id]);
    if (loading) {
        return _jsx("div", { className: "p-8 text-gray-500", children: "Loading user\u2026" });
    }
    if (!user || !user.name) {
        return _jsx("div", { className: "p-8 text-red-500", children: "User not found" });
    }
    const initials = user.name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return (_jsxs("div", { className: "p-8 max-w-5xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "User Details" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage profile information and permissions" })] }), _jsx("button", { className: "border border-red-300 text-red-600 px-4 py-2 rounded-lg", children: "Deactivate User" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4", children: initials }), _jsx("p", { className: "font-semibold text-lg", children: user.name }), _jsx("p", { className: "text-sm text-gray-500", children: user.role }), _jsx("span", { className: `inline-block mt-3 px-3 py-1 text-xs rounded-full ${user.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"}`, children: user.status }), _jsx("div", { className: "mt-6 text-sm space-y-2 text-gray-600", children: _jsxs("div", { children: ["Email: ", user.email] }) })] }), _jsxs("div", { className: "md:col-span-2 bg-white rounded-xl shadow p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold", children: "Name" }), _jsx("input", { value: user.name, readOnly: true, className: "mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold", children: "Email" }), _jsx("input", { value: user.email, readOnly: true, className: "mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold", children: "Role" }), _jsx("input", { value: user.role, readOnly: true, className: "mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50" })] })] })] })] }));
}
