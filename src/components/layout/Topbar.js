import { jsx as _jsx } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";
export default function Topbar() {
    const location = useLocation();
    return (_jsx("div", { className: "bg-white/80 backdrop-blur-md border-b border-gray-200", children: _jsx("div", { className: "mx-auto px-6 py-5 flex items-center justify-between gap-4", children: _jsx("div", { children: _jsx("div", { className: "text-xs text-gray-500", children: _jsx(Breadcrumbs, {}) }) }) }) }));
}
