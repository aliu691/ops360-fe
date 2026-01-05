import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useUsers } from "../hooks/useUsers";
import { ChevronRight, ChevronDown, AlertTriangle, CheckCircle2, XCircle, } from "lucide-react";
import { formatMonthLabel, getCurrentMonth, getCurrentWeek, } from "../utils/dateUtils";
/* ---------------------------------------------
   HELPERS
----------------------------------------------*/
function normalizeStatus(s) {
    if (!s)
        return "FAIR";
    const up = s.toUpperCase();
    if (["FAIL", "POOR"].includes(up))
        return "FAIL";
    if (["GOOD"].includes(up))
        return "GOOD";
    if (["FAIR"].includes(up))
        return "FAIR";
    return up;
}
function statusClasses(status) {
    const s = normalizeStatus(status);
    if (s === "GOOD")
        return {
            text: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
        };
    if (s === "FAIL")
        return {
            text: "text-rose-700",
            bg: "bg-rose-50",
            border: "border-rose-200",
        };
    return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
    };
}
function statusIcon(status) {
    const s = normalizeStatus(status);
    if (s === "GOOD")
        return _jsx(CheckCircle2, { size: 18, className: "text-emerald-600" });
    if (s === "FAIL")
        return _jsx(XCircle, { size: 18, className: "text-rose-600" });
    return _jsx(AlertTriangle, { size: 18, className: "text-amber-600" });
}
/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/
export default function Dashboard() {
    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openMeetingId, setOpenMeetingId] = useState(null);
    const [months, setMonths] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedWeek, setSelectedWeek] = useState();
    const { users, loading: usersLoading } = useUsers();
    const [selectedRep, setSelectedRep] = useState();
    useEffect(() => {
        if (!selectedRep && users.length > 0) {
            setSelectedRep(users[0].name);
        }
    }, [users, selectedRep]);
    useEffect(() => {
        apiClient
            .get(API_ENDPOINTS.getAvailableMonths())
            .then((res) => {
            const items = res.data?.items ?? [];
            setMonths(items);
            const currentMonth = getCurrentMonth();
            // ✅ auto-select current month if present
            if (!selectedMonth && items.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            }
        })
            .catch(() => setMonths([]));
    }, []);
    useEffect(() => {
        setWeeks([]);
        setSelectedWeek(undefined);
        if (!selectedMonth)
            return;
        apiClient
            .get(API_ENDPOINTS.getAvailableWeeks(selectedMonth))
            .then((res) => {
            const items = res.data?.items ?? [];
            setWeeks(items);
            const currentWeek = getCurrentWeek();
            // ✅ auto-select current week if it exists in this month
            const match = items.find((w) => w.week === currentWeek);
            if (match) {
                setSelectedWeek(match.week);
            }
        })
            .catch(() => setWeeks([]));
    }, [selectedMonth]);
    /* ---------------------------------------------------
     FETCH KPI DATA
  ---------------------------------------------------*/
    useEffect(() => {
        if (!selectedRep)
            return;
        setLoading(true);
        const params = {};
        if (selectedMonth)
            params.month = selectedMonth;
        if (selectedWeek !== undefined)
            params.week = selectedWeek;
        apiClient
            .get(API_ENDPOINTS.getKpi(selectedRep, params))
            .then((res) => {
            const data = res.data ?? {};
            setKpi({
                totalMeetings: data.totalMeetings ?? 0,
                score: data.score ?? 0,
                status: data.status ?? "FAIR",
                weeklyFindings: data.weeklyFindings ?? [],
                counts: data.counts ?? {},
                meetingFindings: data.meetingFindings ?? [],
            });
        })
            .catch((err) => {
            console.error("Dashboard KPI fetch error:", err);
            setKpi(null);
        })
            .finally(() => setLoading(false));
    }, [selectedRep, selectedMonth, selectedWeek]);
    const scoreCardBorder = normalizeStatus(kpi?.status) === "GOOD"
        ? "border-emerald-200"
        : normalizeStatus(kpi?.status) === "FAIL"
            ? "border-rose-200"
            : "border-amber-200";
    /* ---------------------------------------------------
       RENDER
    ---------------------------------------------------*/
    return (_jsxs("div", { className: "min-h-screen pb-24 overflow-y-auto px-6 md:px-10 lg:px-12", children: [_jsxs("div", { className: "flex items-center justify-between mt-6 mb-10", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-extrabold", children: "KPI Dashboard" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Weekly snapshot \u2014 shows findings and quality metrics for the selected rep." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("select", { value: selectedRep, onChange: (e) => setSelectedRep(e.target.value), disabled: usersLoading, className: "appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm", children: users.map((u) => (_jsx("option", { value: u.name, children: u.name }, u.id))) }), _jsx(ChevronDown, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })] }), _jsx(Select, { value: selectedMonth, onChange: setSelectedMonth, options: months, placeholder: "All Months", formatLabel: formatMonthLabel }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: selectedWeek ?? "", onChange: (e) => setSelectedWeek(e.target.value ? Number(e.target.value) : undefined), className: "appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm", children: [_jsx("option", { value: "", children: "All Weeks" }), weeks.map((w) => (_jsx("option", { value: w.week, children: w.label }, w.week)))] }), _jsx(ChevronDown, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "TOTAL MEETINGS" }), _jsxs("div", { className: "flex items-center justify-between mt-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-4xl font-bold", children: kpi?.totalMeetings ?? 0 }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "This week" })] }), _jsxs("div", { className: "inline-block rounded-full bg-emerald-50 px-4 py-2 border border-emerald-100 text-center", children: [_jsx("div", { className: "text-xs text-emerald-700 font-semibold", children: "Score" }), _jsx("div", { className: "text-xl font-bold", children: kpi?.score ?? 0 })] })] })] }), _jsxs("div", { className: `bg-white rounded-xl shadow p-6 border ${scoreCardBorder}`, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "WEEKLY SCORE CARD" }), _jsxs("div", { className: "mt-2 flex items-end gap-4", children: [_jsx("p", { className: "text-4xl font-extrabold", children: kpi?.score ?? 0 }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "/ 100" })] })] }), _jsx("div", { className: `inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${statusClasses(kpi?.status).text} ${statusClasses(kpi?.status).bg}`, children: kpi?.status })] }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "w-full bg-gray-100 rounded-full h-3 overflow-hidden", children: _jsx("div", { className: `h-3 rounded-full transition-all duration-700 ${(kpi?.score ?? 0) >= 70
                                                ? "bg-emerald-500"
                                                : (kpi?.score ?? 0) >= 45
                                                    ? "bg-amber-500"
                                                    : "bg-rose-500"}`, style: { width: `${kpi?.score ?? 0}%` } }) }), _jsx("p", { className: "mt-3 text-xs text-gray-500", children: "Target is > 70." })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow p-6", children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "WEEKLY FINDINGS" }), _jsxs("div", { className: "flex items-start gap-3 mt-4", children: [_jsx("div", { className: `p-2 rounded-md border ${statusClasses(kpi?.status).border} ${statusClasses(kpi?.status).bg}`, children: statusIcon(kpi?.status) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: normalizeStatus(kpi?.status) === "GOOD"
                                                    ? "Good Activity"
                                                    : normalizeStatus(kpi?.status) === "FAIL"
                                                        ? "Poor Activity"
                                                        : "Fair Activity" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: kpi?.weeklyFindings?.[0]?.message ??
                                                    "No issues detected this week." })] })] })] })] }), _jsxs("div", { className: "space-y-6 mb-20", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", children: _jsx("path", { d: "M3 7h18M3 12h18M3 17h18", stroke: "#0ea5e9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }), _jsx("h2", { className: "text-xl font-semibold", children: "Meetings Breakdown" })] }), loading && _jsx("div", { className: "text-gray-500", children: "Loading\u2026" }), !loading && (kpi?.meetingFindings?.length ?? 0) === 0 && (_jsx("div", { className: "bg-white rounded-xl p-6 shadow text-center text-gray-500", children: "No meeting findings for this week." })), _jsx("div", { className: "space-y-4", children: !loading &&
                            (kpi?.meetingFindings ?? []).map((mf) => {
                                const isOpen = openMeetingId === mf.meetingId;
                                const sc = statusClasses(mf.status);
                                return (_jsxs("div", { className: "bg-white rounded-xl shadow overflow-hidden border", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center border ${sc.border} ${sc.bg}`, children: _jsx("div", { className: `text-sm font-semibold ${sc.text}`, children: normalizeStatus(mf.status) === "GOOD"
                                                                    ? "✓"
                                                                    : normalizeStatus(mf.status) === "FAIL"
                                                                        ? "✕"
                                                                        : "!" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-lg font-semibold", children: ["Meeting at", " ", _jsx("span", { className: "font-bold", children: mf.customerName })] }), _jsx("p", { className: "text-xs text-gray-400", children: mf.status })] })] }), _jsx("button", { onClick: () => setOpenMeetingId(isOpen ? null : mf.meetingId), className: "text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition", children: isOpen ? (_jsxs(_Fragment, { children: ["Close ", _jsx(ChevronDown, { size: 16 })] })) : (_jsxs(_Fragment, { children: ["View ", _jsx(ChevronRight, { size: 16 })] })) })] }), isOpen && (_jsxs("div", { className: "px-6 py-6 space-y-6 bg-gray-50", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "PRIMARY CONTACT" }), _jsx("p", { className: "mt-2 text-sm text-gray-800", children: mf.primaryContact ?? "—" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "MEETING PURPOSE" }), _jsx("p", { className: "mt-2 text-sm text-gray-800", children: mf.meetingPurpose ?? "—" })] })] }), _jsxs("div", { className: "bg-white border rounded-lg p-4", children: [_jsx("p", { className: "text-xs font-semibold text-gray-500", children: "MEETING OUTCOME" }), _jsx("p", { className: "text-sm mt-2 text-gray-800", children: mf.meetingOutcome })] }), _jsxs("div", { className: `border rounded-lg p-4 ${normalizeStatus(mf.status) === "GOOD"
                                                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                        : normalizeStatus(mf.status) === "FAIL"
                                                            ? "bg-rose-50 border-rose-100 text-rose-700"
                                                            : "bg-amber-50 border-amber-100 text-amber-700"}`, children: [_jsx("p", { className: "text-xs font-semibold", children: normalizeStatus(mf.status) === "GOOD"
                                                                ? "QUALITY CHECK"
                                                                : "FINDING" }), _jsx("p", { className: "mt-2 text-sm", children: mf.message })] })] }))] }, mf.meetingId));
                            }) })] })] }));
}
function Select({ value, onChange, options, placeholder, formatLabel, }) {
    return (_jsxs("div", { className: "relative", children: [_jsxs("select", { value: value ?? "", onChange: (e) => onChange(e.target.value || undefined), className: "appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm", children: [_jsx("option", { value: "", children: placeholder }), options.map((o) => (_jsx("option", { value: o, children: formatLabel ? formatLabel(o) : o }, o)))] }), _jsx(ChevronDown, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })] }));
}
