import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
export default function Modal({ open, onClose, children }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b bg-gray-50", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Upload Weekly Report" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "px-6 py-6", children: children })] }) }));
}
