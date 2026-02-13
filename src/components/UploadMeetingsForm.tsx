import { useEffect, useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  formatMonthLabel,
  getCurrentMonth,
  getCurrentWeek,
} from "../utils/dateUtils";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

interface WeekOption {
  week: number;
  label: string;
  startDate: string;
  endDate: string;
  hasData: boolean;
}

export default function UploadMeetingsForm({ onSuccess }: any) {
  const { actor, isAdmin, isUser } = useAuth();

  const [rep, setRep] = useState<string>(""); // display only
  const [repId, setRepId] = useState<number | null>(null); // ✅ source of truth
  const [file, setFile] = useState<File | null>(null);

  const [months, setMonths] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<WeekOption[]>([]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentMonth = getCurrentMonth();
  const currentWeek = getCurrentWeek();

  const { users, loading: usersLoading } = useUsers();
  const salesUsers = users.filter((u) => u.department === "SALES");

  /* =====================================================
     🔐 SET REP + REP ID BASED ON ROLE
  ===================================================== */
  useEffect(() => {
    // USER → always self
    if (isUser && actor?.type === "USER") {
      setRep(actor.firstName);
      setRepId(actor.id);
      return;
    }

    // ADMIN → default to first sales rep
    if (isAdmin && salesUsers.length > 0) {
      const first = salesUsers[0];
      setRep(first.firstName);
      setRepId(first.id);
    }
  }, [actor, isAdmin, isUser, salesUsers]);

  /* =====================================================
     LOAD CALENDAR MONTHS
  ===================================================== */
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

  /* =====================================================
     LOAD CALENDAR WEEKS (PER USER)
  ===================================================== */
  useEffect(() => {
    if (!selectedMonth || !repId) return;

    setWeeks([]);
    setSelectedWeek("");

    apiClient
      .get(API_ENDPOINTS.getCalendarWeeks(selectedMonth, repId))
      .then((res) => {
        const allWeeks: WeekOption[] = res.data?.items ?? [];
        const availableWeeks = allWeeks.filter((w) => !w.hasData);

        setWeeks(availableWeeks);

        const match = availableWeeks.find((w) => w.week === currentWeek);
        if (match) setSelectedWeek(match.week);
      })
      .catch(() => {
        setWeeks([]);
        setSelectedWeek("");
      });
  }, [selectedMonth, repId]);

  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  /* =====================================================
     SUBMIT
  ===================================================== */
  const handleSubmit = async () => {
    if (!file || !selectedMonth || !selectedWeek || !repId) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = API_ENDPOINTS.uploadMeetings(
        repId!,
        selectedMonth,
        Number(selectedWeek)
      );

      await apiClient.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Meetings uploaded successfully");
      onSuccess?.(true);

      setTimeout(() => {
        navigate("/meetings");
      }, 400);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  console.log({
    rep,
    repId,
    selectedMonth,
    selectedWeek,
    weeksLength: weeks.length,
    file: !!file,
    isDisabled: loading || !file || !repId || !selectedMonth || !selectedWeek,
  });

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6">
      {/* ADMIN ONLY */}
      {isAdmin && (
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Representative
          </label>
          <select
            value={rep}
            disabled={usersLoading}
            onChange={(e) => {
              const user = salesUsers.find(
                (u) => u.firstName === e.target.value
              );
              if (!user) return;

              setRep(user.firstName);
              setRepId(user.id);
            }}
            className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
          >
            <option value="">Select a representative...</option>
            {salesUsers.map((u) => (
              <option key={u.id} value={u.firstName}>
                {u.firstName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Reporting Month */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Reporting Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">Select month...</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {/* Reporting Week */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Reporting Week
        </label>
        <select
          value={selectedWeek}
          onChange={(e) =>
            setSelectedWeek(e.target.value ? Number(e.target.value) : "")
          }
          disabled={!selectedMonth}
          className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">Select week...</option>
          {weeks.map((w) => {
            const isFuture =
              selectedMonth === currentMonth && w.week > currentWeek;

            return (
              <option key={w.week} value={w.week} disabled={isFuture}>
                {w.label} {isFuture ? "(Upcoming)" : ""}
              </option>
            );
          })}
        </select>
      </div>

      {/* Upload */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Report File
        </label>
        <label
          htmlFor="file-upload"
          className="mt-2 flex flex-col items-center border-2 border-dashed rounded-xl py-10 cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <UploadCloud size={30} className="text-blue-500 mb-3" />
          <p className="text-blue-600 font-medium text-sm">Click to upload</p>
          <p className="text-gray-400 text-xs mt-2">Excel (.xlsx)</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: <span className="font-semibold">{file.name}</span>
          </p>
        )}
      </div>

      {/* INFO */}
      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600">
        <Info size={18} />
        Need the correct format?{" "}
        <a
          href="https://docs.google.com/spreadsheets/d/1hJVXp9ZA8zoUuz9BXFvtR4PS70pdectd0uj3bZmbGao/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 ml-1 underline"
        >
          Download Template
        </a>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
          onClick={onSuccess}
        >
          Cancel
        </button>

        <button
          disabled={
            loading || !file || !repId || !selectedMonth || !selectedWeek
          }
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg text-white flex items-center gap-2
            ${
              loading || !file || !repId || !selectedMonth || !selectedWeek
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          <UploadCloud size={16} />
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>
    </div>
  );
}
