import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { Pencil, Trash2 } from "lucide-react";
export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        apiClient
            .get(API_ENDPOINTS.getUsers())
            .then((res) => setUsers(res.data?.items ?? []))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "User List" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Manage system access, roles, and user details." })] }), _jsx("button", { onClick: () => navigate("/users/new"), className: "bg-blue-600 text-white px-4 py-2 rounded-lg", children: "Add New User" })] }), _jsx("div", { className: "bg-white rounded-xl shadow overflow-hidden", children: loading ? (_jsx("div", { className: "p-6 text-gray-500", children: "Loading users\u2026" })) : (_jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-6 py-4", children: "Name" }), _jsx("th", { className: "text-left px-6 py-4", children: "Email" }), _jsx("th", { className: "text-left px-6 py-4", children: "Role" }), _jsx("th", { className: "text-left px-6 py-4", children: "Status" }), _jsx("th", { className: "px-6 py-4" })] }) }), _jsxs("tbody", { children: [users.map((u) => (_jsxs("tr", { className: "border-t hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "font-semibold", children: u.name }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: _jsx("div", { className: "text-xs text-gray-500", children: u.email }) }), _jsx("td", { className: "px-6 py-4", children: u.role ?? "SALES REP" }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${u.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"}`, children: u.status }) }), _jsxs("td", { className: "px-6 py-4 flex gap-3 justify-end", children: [_jsx("button", { onClick: () => navigate(`/users/${u.id}`), className: "text-blue-600 hover:text-blue-800", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { className: "text-gray-400 hover:text-red-600", children: _jsx(Trash2, { size: 16 }) })] })] }, u.id))), users.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-8 text-gray-500", children: "No users found." }) }))] })] })) })] }));
}
