import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";
import { Search, ChevronRight, UploadCloud } from "lucide-react";
import MeetingDetailsPanel from "../components/MeetingDetailsPanel";
import Modal from "../components/Modal";
import UploadMeetingsForm from "../components/UploadMeetingsForm";
import { API_ENDPOINTS } from "../config/api";
import {
  formatMonthLabel,
  getCurrentMonth,
  getCurrentWeek,
} from "../utils/dateUtils";
import { useUsers } from "../hooks/useUsers";
import { Select } from "../components/select";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";

export default function Meetings() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [repFilter, setRepFilter] = useState("");

  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [months, setMonths] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<any[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>();

  const currentMonth = getCurrentMonth();
  const currentWeek = getCurrentWeek();

  const { users, loading: usersLoading } = useUsers();
  const salesUsers = users.filter((u) => u.department === "SALES");

  const { actor, isUser, isAdmin } = useAuth();

  // 🔐 USERS NEVER SEND repName — backend infers from JWT
  const effectiveRepFilter = isAdmin && repFilter ? repFilter : undefined;

  /* =========================
     LOAD MONTHS
  ========================= */
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

  /* =========================
     LOAD WEEKS
  ========================= */
  useEffect(() => {
    setWeeks([]);
    setSelectedWeek(undefined);

    if (!selectedMonth) return;

    apiClient
      .get(API_ENDPOINTS.getAvailableWeeks(selectedMonth))
      .then((res) => {
        const items = res.data?.items ?? [];
        setWeeks(items);

        const match = items.find((w: any) => w.week === currentWeek);
        if (match) {
          setSelectedWeek(match.week);
        }
      })
      .catch(() => setWeeks([]));
  }, [selectedMonth]);

  /* =========================
     FETCH MEETINGS
  ========================= */
  const loadMeetings = async () => {
    setLoading(true);

    try {
      const url = API_ENDPOINTS.getMeetings(effectiveRepFilter, page, limit, {
        month: selectedMonth,
        week: selectedWeek,
      });

      const res = await apiClient.get(url);
      const data = res.data;

      setMeetings(data.items ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data?.total ?? 0);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [page, repFilter, selectedMonth, selectedWeek]);

  /* =========================
     LOCAL SEARCH
  ========================= */
  const filtered = meetings.filter((m) => {
    const q = query.toLowerCase();
    return (
      m.repName?.toLowerCase().includes(q) ||
      m.customerName?.toLowerCase().includes(q) ||
      m.primaryContact?.toLowerCase().includes(q)
    );
  });

  const openDetails = (m: any) => {
    setSelected(m);
    setOpenPanel(true);
  };

  const userFirstName = actor?.type === "USER" ? actor.firstName : undefined;

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-10 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Meetings List</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all recorded meeting outcomes and next steps.
        </p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white w-full md:w-96 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search by client, rep, or contact…"
            className="w-full outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* ADMIN ONLY: Rep filter */}
          {isAdmin && (
            <Select
              value={repFilter || undefined}
              onChange={(v) => {
                setPage(1);
                setRepFilter(v ?? "");
              }}
              options={salesUsers.map((u) => u.firstName)}
              placeholder={usersLoading ? "Loading reps..." : "All Reps"}
            />
          )}

          {/* Month */}
          <Select
            value={selectedMonth}
            onChange={(v) => {
              setPage(1);
              setSelectedMonth(v);
            }}
            options={months}
            placeholder="All Months"
            format={formatMonthLabel}
          />

          {/* Week */}
          <Select
            disabled={!selectedMonth}
            value={selectedWeek ? String(selectedWeek) : undefined}
            onChange={(v) => {
              setPage(1);
              setSelectedWeek(v ? Number(v) : undefined);
            }}
            options={weeks.map((w: any) => String(w.week))}
            placeholder="All Weeks"
            format={(v) => {
              const match = weeks.find((w: any) => String(w.week) === v);
              return match ? match.label : v;
            }}
          />

          {/* USER ONLY: Upload */}
          {isUser && actor && (
            <button
              onClick={() => setUploadOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <UploadCloud size={16} />
              Upload Weekly Report
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left">Rep</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Primary Contact</th>
                <th className="py-3 px-4 text-left">Purpose</th>
                <th className="py-3 px-4 text-left">Outcome</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetails(m)}
                >
                  <td className="px-4 py-3">{m.repName}</td>
                  <td className="px-4 py-3 font-medium">{m.customerName}</td>
                  <td className="px-4 py-3">{m.primaryContact}</td>
                  <td className="px-4 py-3">{m.meetingPurpose}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.meetingOutcome?.slice(0, 80)}…
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight size={18} />
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No meetings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        label="deals"
      />

      {/* DETAILS */}
      <MeetingDetailsPanel
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        meeting={selected}
      />

      {/* UPLOAD (USER ONLY) */}
      {isUser && actor && (
        <Modal open={uploadOpen} onClose={() => setUploadOpen(false)}>
          <UploadMeetingsForm
            repName={userFirstName}
            onSuccess={() => {
              setUploadOpen(false);
              loadMeetings();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
