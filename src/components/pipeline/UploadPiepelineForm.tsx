import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../../config/api";
import { apiClient } from "../../config/apiClient";
import { Input } from "../Input";
import { Info } from "lucide-react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  department: "SALES" | "PRE_SALES";
};

export function UploadPipelineModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (ok: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [year, setYear] = useState(2025);
  const [salesOwnerId, setSalesOwnerId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------
   * Load users
   ------------------------------*/
  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getUsers())
      .then((res) => setUsers(res.data?.items ?? []))
      .catch(() => setUsers([]));
  }, []);

  const salesReps = users.filter((u) => u.department === "SALES");

  /* -----------------------------
   * Upload handler
   ------------------------------*/
  const upload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiClient.post(
        API_ENDPOINTS.uploadPipeline({
          year,
          salesOwnerId: salesOwnerId || undefined,
        }),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Pipeline uploaded successfully");

      onSuccess?.(true);

      setTimeout(() => {
        onClose();
        navigate("/opportunities", {
          state: { refresh: Date.now(), resetPage: true },
        });
      }, 400);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ??
          "Failed to upload pipeline. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold flex items-center gap-2">
            Upload Pipeline
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* YEAR */}
          <Input
            label="Year"
            type="number"
            value={year}
            onChange={(v) => setYear(Number(v))}
          />

          {/* SALES OWNER */}
          <div>
            <label className="text-sm text-gray-500">Deal Owner</label>
            <select
              value={salesOwnerId}
              onChange={(e) =>
                setSalesOwnerId(e.target.value ? Number(e.target.value) : "")
              }
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select deal owner</option>
              {salesReps.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* FILE UPLOAD */}
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div className="text-sm">
              <span className="text-blue-600 font-medium">Click to browse</span>{" "}
              or drag and drop your Excel file here
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Supported formats: .xlsx, .xls (Max 10MB)
            </div>

            {file && (
              <div className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Info Bar */}
          <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600">
            <Info size={18} className="text-gray-500" />
            Need the correct format?{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1TKZvrPCkbY4I1qjJDgTAYyJgP49QzH_HyEMwy5URYf0/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 ml-1 underline"
            >
              Download Template
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={!file || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload and Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
