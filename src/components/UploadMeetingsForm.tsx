import { useEffect, useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  formatMonthLabel,
  getCurrentMonth,
  getCurrentWeek,
} from "../utils/dateUtils";
import { useUsers } from "../hooks/useUsers";

interface WeekOption {
  week: number;
  label: string;
  startDate: string;
  endDate: string;
  hasData: boolean; // ✅ NEW
}

export default function UploadMeetingsForm({ onSuccess }: any) {
  const [rep, setRep] = useState("");
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

  const [selectedRep, setSelectedRep] = useState<string | undefined>();

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

    if (!selectedMonth || !selectedRep) return;

    const user = users.find((u) => u.name === selectedRep);
    if (!user) return;

    apiClient
      .get(API_ENDPOINTS.getCalendarWeeks(selectedMonth, user.id))
      .then((res) => {
        const allWeeks: WeekOption[] = res.data?.items ?? [];

        // ✅ Only block weeks THIS USER already uploaded
        const availableWeeks = allWeeks.filter((w) => !w.hasData);

        setWeeks(availableWeeks);

        const currentWeek = getCurrentWeek();

        // ✅ Auto-select current week if available
        const match = availableWeeks.find((w) => w.week === currentWeek);
        if (match) {
          setSelectedWeek(match.week);
        }
      })
      .catch(() => setWeeks([]));
  }, [selectedMonth, selectedRep, users]);

  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!rep || !file || !selectedMonth || !selectedWeek) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = API_ENDPOINTS.uploadMeetings(
        rep,
        selectedMonth,
        Number(selectedWeek)
      );

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
    } catch (err: any) {
      const message = err?.response?.data?.message || "Upload failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Representative */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Representative
        </label>
        <select
          value={rep}
          onChange={(e) => setRep(e.target.value)}
          disabled={usersLoading}
          className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">Select a representative...</option>
          {users.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

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
          <UploadCloud size={40} className="text-blue-500 mb-3" />
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

      {/* Info Bar */}
      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600">
        <Info size={18} className="text-gray-500" />
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
          disabled={loading || !file || !rep || !selectedMonth || !selectedWeek}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg text-white flex items-center gap-2
            ${
              loading || !file || !rep || !selectedMonth || !selectedWeek
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
