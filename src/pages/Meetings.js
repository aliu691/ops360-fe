import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { Search, ChevronDown, ChevronRight, UploadCloud } from "lucide-react";
import MeetingDetailsPanel from "../components/MeetingDetailsPanel";
import Modal from "../components/Modal";
import UploadMeetingsForm from "../components/UploadMeetingsForm";
import { API_ENDPOINTS } from "../config/api";
import { formatMonthLabel, getCurrentMonth, getCurrentWeek, } from "../utils/dateUtils";
import { useUsers } from "../hooks/useUsers";
export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openPanel, setOpenPanel] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [repFilter, setRepFilter] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedWeek, setSelectedWeek] = useState();
    const currentMonth = getCurrentMonth();
    const currentWeek = getCurrentWeek();
    const { users, loading: usersLoading } = useUsers();
    const [selectedRep, setSelectedRep] = useState();
    useEffect(() => {
        if (!selectedRep && users.length > 0) {
            setSelectedRep(users[0].name);
        }
    }, [users, selectedRep]);
    /* ----------------------------------------
       LOAD MONTHS (auto-select current)
    ---------------------------------------- */
    useEffect(() => {
        apiClient
            .get(API_ENDPOINTS.getAvailableMonths())
            .then((res) => {
            const items = res.data?.items ?? [];
            setMonths(items);
            if (items.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            }
        })
            .catch(() => setMonths([]));
    }, []);
    /* ----------------------------------------
       LOAD WEEKS WHEN MONTH CHANGES
       (auto-select current week)
    ---------------------------------------- */
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
            const match = items.find((w) => w.week === currentWeek);
            if (match) {
                setSelectedWeek(match.week);
            }
        })
            .catch(() => setWeeks([]));
    }, [selectedMonth]);
    /* ----------------------------------------
       FETCH MEETINGS (SERVER FILTERED)
    ---------------------------------------- */
    const loadMeetings = async () => {
        setLoading(true);
        try {
            const url = API_ENDPOINTS.getMeetings(repFilter || undefined, page, limit, {
                month: selectedMonth,
                week: selectedWeek,
            });
            const res = await apiClient.get(url);
            const data = res.data;
            setMeetings(data.items || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        }
        catch (err) {
            console.error("Error fetching meetings:", err);
        }
        setLoading(false);
    };
    useEffect(() => {
        loadMeetings();
    }, [page, repFilter, selectedMonth, selectedWeek]);
    /* ----------------------------------------
       LOCAL SEARCH (client-side)
    ---------------------------------------- */
    const filtered = meetings.filter((m) => {
        const q = query.toLowerCase();
        return (m.repName?.toLowerCase().includes(q) ||
            m.customerName?.toLowerCase().includes(q) ||
            m.primaryContact?.toLowerCase().includes(q));
    });
    const openDetails = (m) => {
        setSelected(m);
        setOpenPanel(true);
    };
    /* ----------------------------------------
       RENDER
    ---------------------------------------- */
    return (_jsxs("div", { className: "space-y-10 pb-20 px-6 md:px-10 lg:px-14", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Meetings List" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "View and manage all recorded meeting outcomes and next steps." })] }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between gap-4 items-center", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border rounded-lg bg-white w-full md:w-96 shadow-sm", children: [_jsx(Search, { size: 18, className: "text-gray-400" }), _jsx("input", { placeholder: "Search by client, rep, or contact\u2026", className: "w-full outline-none text-sm", value: query, onChange: (e) => setQuery(e.target.value) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Select, { value: repFilter || undefined, onChange: (v) => {
                                    setPage(1);
                                    setRepFilter(v ?? "");
                                }, options: users.map((u) => u.name), placeholder: usersLoading ? "Loading reps..." : "All Reps" }), _jsx(Select, { value: selectedMonth, onChange: (v) => {
                                    setPage(1);
                                    setSelectedMonth(v);
                                }, options: months, placeholder: "All Months", format: formatMonthLabel }), _jsxs("div", { className: "relative", children: [_jsxs("select", { disabled: !selectedMonth, value: selectedWeek ?? "", onChange: (e) => {
                                            setPage(1);
                                            setSelectedWeek(e.target.value ? Number(e.target.value) : undefined);
                                        }, className: "appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm disabled:bg-gray-100", children: [_jsx("option", { value: "", children: "All Weeks" }), weeks.map((w) => (_jsx("option", { value: w.week, children: w.label }, w.week)))] }), _jsx(ChevronDown, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })] }), _jsxs("button", { onClick: () => setUploadOpen(true), className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2", children: [_jsx(UploadCloud, { size: 16 }), "Upload Weekly Report"] })] })] }), _jsxs("div", { className: "bg-white rounded-xl border shadow-sm overflow-hidden", children: [loading ? (_jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading\u2026" })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-600", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4 text-left", children: "Rep" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Client" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Primary Contact" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Purpose" }), _jsx("th", { className: "py-3 px-4 text-left", children: "Outcome" }), _jsx("th", { className: "py-3 px-4" })] }) }), _jsxs("tbody", { children: [filtered.map((m) => (_jsxs("tr", { className: "border-t hover:bg-gray-50 cursor-pointer", onClick: () => openDetails(m), children: [_jsx("td", { className: "px-4 py-3", children: m.repName }), _jsx("td", { className: "px-4 py-3 font-medium", children: m.customerName }), _jsx("td", { className: "px-4 py-3", children: m.primaryContact }), _jsx("td", { className: "px-4 py-3", children: m.meetingPurpose }), _jsxs("td", { className: "px-4 py-3 text-gray-600", children: [m.meetingOutcome?.slice(0, 80), "\u2026"] }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsx(ChevronRight, { size: 18 }) })] }, m.id))), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-12 text-center text-gray-500", children: "No meetings found." }) }))] })] })), !loading && totalPages > 1 && (_jsxs("div", { className: "flex justify-between px-4 py-4 border-t bg-gray-50", children: [_jsx("button", { disabled: page === 1, onClick: () => setPage(page - 1), className: "px-3 py-2 rounded-lg text-sm bg-white border disabled:opacity-40", children: "Previous" }), _jsxs("div", { className: "text-sm", children: ["Page ", _jsx("b", { children: page }), " of ", _jsx("b", { children: totalPages })] }), _jsx("button", { disabled: page === totalPages, onClick: () => setPage(page + 1), className: "px-3 py-2 rounded-lg text-sm bg-white border disabled:opacity-40", children: "Next" })] }))] }), _jsx(MeetingDetailsPanel, { open: openPanel, onClose: () => setOpenPanel(false), meeting: selected }), _jsx(Modal, { open: uploadOpen, onClose: () => setUploadOpen(false), children: _jsx(UploadMeetingsForm, { onSuccess: () => {
                        setUploadOpen(false);
                        loadMeetings();
                    } }) })] }));
}
/* ----------------------------------------
   Reusable Select
---------------------------------------- */
function Select({ value, onChange, options, placeholder, format, }) {
    return (_jsxs("div", { className: "relative", children: [_jsxs("select", { value: value ?? "", onChange: (e) => onChange(e.target.value || undefined), className: "appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm", children: [_jsx("option", { value: "", children: placeholder }), options.map((o) => (_jsx("option", { value: o, children: format ? format(o) : o }, o)))] }), _jsx(ChevronDown, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })] }));
}
