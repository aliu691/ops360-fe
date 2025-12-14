import { useEffect, useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";

const reps = ["Ben", "Faith", "John", "Sarah"];

interface WeekOption {
  week: number;
  label: string;
  startDate: string;
  endDate: string;
}

export default function UploadMeetingsForm({ onSuccess }: any) {
  const [rep, setRep] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [months, setMonths] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<WeekOption[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* --------------------------------
     LOAD AVAILABLE MONTHS
  -------------------------------- */
  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getAvailableMonths())
      .then((res) => setMonths(res.data?.items ?? []))
      .catch(() => setMonths([]));
  }, []);

  /* --------------------------------
     LOAD WEEKS WHEN MONTH CHANGES
  -------------------------------- */
  useEffect(() => {
    setWeeks([]);
    setSelectedWeek("");

    if (!selectedMonth) return;

    apiClient
      .get(API_ENDPOINTS.getAvailableWeeks(selectedMonth))
      .then((res) => setWeeks(res.data?.items ?? []))
      .catch(() => setWeeks([]));
  }, [selectedMonth]);

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

      onSuccess(true);
      setTimeout(() => navigate("/meetings"), 400);
    } catch (err) {
      console.error("Upload error:", err);
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
          className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm text-sm"
        >
          <option value="">Select a representative...</option>
          {reps.map((r) => (
            <option key={r} value={r}>
              {r}
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
              {m}
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
          {weeks.map((w) => (
            <option key={w.week} value={w.week}>
              {w.label}
            </option>
          ))}
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

      {/* Info */}
      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600">
        <Info size={18} />
        Uploads are evaluated based on the selected reporting week.
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
