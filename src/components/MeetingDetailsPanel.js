import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X, Calendar } from "lucide-react";
import { useEffect } from "react";
export default function MeetingDetailsPanel({ open, onClose, meeting, }) {
    // Close on ESC press
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);
    if (!open || !meeting)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn", onClick: onClose }), _jsxs("div", { className: "fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 \n                      animate-slideIn border-l border-gray-200 flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", children: [_jsx("h2", { className: "text-lg font-semibold", children: meeting.customerName }), _jsx("button", { onClick: onClose, children: _jsx(X, { size: 22, className: "text-gray-500 hover:text-gray-800" }) })] }), _jsxs("div", { className: "overflow-y-auto px-5 py-6 space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "REP" }), _jsx("p", { className: "mt-1 text-sm font-medium", children: meeting.repName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "PRIMARY CONTACT" }), _jsx("p", { className: "mt-1 text-sm", children: meeting.primaryContact || "—" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "PURPOSE" }), _jsx("p", { className: "mt-1 text-sm", children: meeting.meetingPurpose || "—" })] }), _jsxs("div", { className: "bg-gray-50 border rounded-md p-4", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "MEETING OUTCOME" }), _jsx("p", { className: "mt-2 text-sm leading-relaxed", children: meeting.meetingOutcome || "No outcome provided." })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Calendar, { size: 16 }), new Date(meeting.createdAt).toLocaleDateString()] })] })] })] }));
}
