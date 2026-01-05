import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { formatMonthLabel, getCurrentMonth, getCurrentWeek, } from "../utils/dateUtils";
import { useUsers } from "../hooks/useUsers";
export default function UploadMeetingsForm({ onSuccess }) {
    const [rep, setRep] = useState("");
    const [file, setFile] = useState(null);
    const [months, setMonths] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentMonth = getCurrentMonth();
    const currentWeek = getCurrentWeek();
    const { users, loading: usersLoading } = useUsers();
    const [selectedRep, setSelectedRep] = useState();
    useEffect(() => {
        if (!selectedRep && users.length > 0) {
            setSelectedRep(users[0].name);
        }
    }, [users, selectedRep]);
    /* --------------------------------
       LOAD CALENDAR MONTHS
       Auto-select current month
    -------------------------------- */
    useEffect(() => {
        apiClient
            .get(API_ENDPOINTS.getCalendarMonths())
            .then((res) => {
            const items = res.data?.items ?? [];
            setMonths(items);
            if (items.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            }
        })
            .catch(() => setMonths([]));
    }, []);
    /* --------------------------------
       LOAD CALENDAR WEEKS
       ❌ Filter out weeks that already have data
    -------------------------------- */
    useEffect(() => {
        setWeeks([]);
        setSelectedWeek("");
        if (!selectedMonth)
            return;
        apiClient
            .get(API_ENDPOINTS.getCalendarWeeks(selectedMonth))
            .then((res) => {
            const allWeeks = res.data?.items ?? [];
            // ✅ REMOVE weeks that already have data
            const availableWeeks = allWeeks.filter((w) => !w.hasData);
            setWeeks(availableWeeks);
            // ✅ Auto-select current week ONLY if it has no data
            const match = availableWeeks.find((w) => w.week === currentWeek);
            if (match) {
                setSelectedWeek(match.week);
            }
        })
            .catch(() => setWeeks([]));
    }, [selectedMonth]);
    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async () => {
        if (!rep || !file || !selectedMonth || !selectedWeek)
            return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const url = API_ENDPOINTS.uploadMeetings(rep, selectedMonth, Number(selectedWeek));
            await apiClient.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // ✅ FIRE TOAST HERE (source of truth)
            toast.success("Meetings uploaded successfully");
            // ✅ close modal / notify parent ONCE
            onSuccess?.(true);
            // ✅ allow toast to render before navigation
            setTimeout(() => {
                navigate("/meetings");
            }, 400);
        }
        catch (err) {
            console.error("Upload error:", err);
            toast.error("Upload failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Representative" }), _jsxs("select", { value: rep, onChange: (e) => setRep(e.target.value), disabled: usersLoading, className: "mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm", children: [_jsx("option", { value: "", children: "Select a representative..." }), users.map((u) => (_jsx("option", { value: u.name, children: u.name }, u.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Reporting Month" }), _jsxs("select", { value: selectedMonth, onChange: (e) => setSelectedMonth(e.target.value), className: "mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm", children: [_jsx("option", { value: "", children: "Select month..." }), months.map((m) => (_jsx("option", { value: m, children: formatMonthLabel(m) }, m)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Reporting Week" }), _jsxs("select", { value: selectedWeek, onChange: (e) => setSelectedWeek(e.target.value ? Number(e.target.value) : ""), disabled: !selectedMonth, className: "mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm", children: [_jsx("option", { value: "", children: "Select week..." }), weeks.map((w) => {
                                const isFuture = selectedMonth === currentMonth && w.week > currentWeek;
                                return (_jsxs("option", { value: w.week, disabled: isFuture, children: [w.label, " ", isFuture ? "(Upcoming)" : ""] }, w.week));
                            })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Report File" }), _jsxs("label", { htmlFor: "file-upload", className: "mt-2 flex flex-col items-center border-2 border-dashed rounded-xl py-10 cursor-pointer bg-gray-50 hover:bg-gray-100", children: [_jsx(UploadCloud, { size: 40, className: "text-blue-500 mb-3" }), _jsx("p", { className: "text-blue-600 font-medium text-sm", children: "Click to upload" }), _jsx("p", { className: "text-gray-400 text-xs mt-2", children: "Excel (.xlsx)" }), _jsx("input", { id: "file-upload", type: "file", className: "hidden", onChange: handleFile })] }), file && (_jsxs("p", { className: "text-sm text-gray-600 mt-2", children: ["Selected: ", _jsx("span", { className: "font-semibold", children: file.name })] }))] }), _jsxs("div", { className: "flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600", children: [_jsx(Info, { size: 18, className: "text-gray-500" }), "Need the correct format?", " ", _jsx("a", { href: "https://docs.google.com/spreadsheets/d/1hJVXp9ZA8zoUuz9BXFvtR4PS70pdectd0uj3bZmbGao/edit?usp=sharing", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 ml-1 underline", children: "Download Template" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx("button", { className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg", onClick: onSuccess, children: "Cancel" }), _jsxs("button", { disabled: loading || !file || !rep || !selectedMonth || !selectedWeek, onClick: handleSubmit, className: `px-4 py-2 rounded-lg text-white flex items-center gap-2
            ${loading || !file || !rep || !selectedMonth || !selectedWeek
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"}`, children: [_jsx(UploadCloud, { size: 16 }), loading ? "Processing..." : "Upload & Process"] })] })] }));
}
