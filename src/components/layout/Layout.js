import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
export default function Layout({ children }) {
    return (_jsx("div", { className: "min-h-screen bg-gray-100 text-gray-900", children: _jsxs("div", { className: "flex", children: [_jsx("aside", { className: "hidden lg:block w-64 bg-gradient-to-b from-[#0f1724] to-[#0a1220] text-white min-h-screen", children: _jsx(Sidebar, {}) }), _jsxs("div", { className: "flex-1 min-h-screen flex flex-col", children: [_jsx("header", { className: "bg-transparent", children: _jsx(Topbar, {}) }), _jsx("main", { className: "flex-1 overflow-auto px-8 py-6", children: _jsx("div", { className: "mx-auto", children: children }) })] })] }) }));
}
