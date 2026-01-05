import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
export default function Breadcrumbs() {
    const location = useLocation();
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    /* ---------------------------------------------
       Extract user ID from pathname
    ---------------------------------------------- */
    useEffect(() => {
        const segments = location.pathname.split("/").filter(Boolean);
        const usersIndex = segments.indexOf("users");
        // If we have /users/:id pattern
        if (usersIndex !== -1 && segments[usersIndex + 1]) {
            const id = segments[usersIndex + 1];
            setUserId(id);
            // Fetch user name
            setUserName(null);
            apiClient
                .get(API_ENDPOINTS.getUserById(id))
                .then((res) => {
                const name = res.data?.item?.name;
                setUserName(name ?? null);
            })
                .catch((err) => {
                console.error("Error fetching user:", err);
                setUserName(null);
            });
        }
        else {
            setUserId(null);
            setUserName(null);
        }
    }, [location.pathname]);
    /* ---------------------------------------------
       Build breadcrumb segments
    ---------------------------------------------- */
    const segments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        // USERS LIST
        if (segment === "users") {
            return {
                label: "Users",
                path: "/users",
            };
        }
        // USER DETAILS - Check if this is the user ID segment
        if (userId && segment === userId) {
            return {
                label: userName || "Loading...",
                path: `/users/${userId}`,
            };
        }
        // DEFAULT
        return {
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            path: "/" + segments.slice(0, index + 1).join("/"),
        };
    });
    /* ---------------------------------------------
       Render
    ---------------------------------------------- */
    return (_jsx("nav", { className: "text-sm text-gray-500 mb-6", children: _jsxs("ol", { className: "flex items-center gap-2", children: [_jsx("li", { children: _jsx(Link, { to: "/", className: "hover:text-gray-900 font-medium", children: "Ops360" }) }), breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { children: "/" }), isLast ? (_jsx("span", { className: "text-gray-900 font-semibold", children: crumb.label })) : (_jsx(Link, { to: crumb.path, className: "hover:text-gray-900 font-medium", children: crumb.label }))] }, crumb.path));
                })] }) }));
}
