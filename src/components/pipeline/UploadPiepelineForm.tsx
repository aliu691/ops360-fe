import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../../config/api";
import { apiClient } from "../../config/apiClient";
import { Input } from "../Input";
import { Info } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function UploadPipelineModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (ok: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { actor } = useAuth();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------
     SAFETY: USERS ONLY
  -------------------------------- */
  if (!actor || actor.type !== "USER") {
    return null;
  }

  /* --------------------------------
     Upload handler
  -------------------------------- */
  const upload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Explicitly pass salesOwnerId (required by backend)
      await apiClient.post(
        API_ENDPOINTS.uploadPipeline({
          year,
          salesOwnerId: actor.id,
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
          <div className="font-semibold">Upload Pipeline</div>
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

          {/* FILE */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
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
              or drag and drop your Excel file
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Supported formats: .xlsx, .xls
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

          {/* INFO */}
          <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-3 text-sm text-gray-600">
            <Info size={18} />
            Need the correct format?{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1TKZvrPCkbY4I1qjJDgTAYyJgP49QzH_HyEMwy5URYf0/edit"
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
            {uploading ? "Uploading…" : "Upload & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
