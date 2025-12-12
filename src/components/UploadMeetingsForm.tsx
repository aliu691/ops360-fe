import { useState } from "react";
import { UploadCloud, Info } from "lucide-react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";

const reps = ["Ben", "Faith", "John", "Sarah"];

export default function UploadMeetingsForm({ onSuccess }: any) {
  const [rep, setRep] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!rep || !file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = API_ENDPOINTS.uploadMeetings(rep);

      await apiClient.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 👇 IMPORTANT: triggers toast + close modal
      onSuccess(true);

      // Wait briefly so toast renders before navigation
      setTimeout(() => navigate("/meetings"), 400);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Representative Select */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Representative
        </label>

        <select
          value={rep}
          onChange={(e) => setRep(e.target.value)}
          className="mt-2 w-full border rounded-lg px-3 py-2 bg-white shadow-sm outline-none text-sm"
        >
          <option value="">Select a representative...</option>
          {reps.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Report File
        </label>

        <label
          htmlFor="file-upload"
          className="mt-2 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl py-10 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <UploadCloud size={40} className="text-blue-500 mb-3" />

          <p className="text-blue-600 font-medium text-sm">Click to upload</p>
          <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
          <p className="text-gray-400 text-xs mt-2">
            Excel (.xlsx) or CSV files (MAX. 10MB)
          </p>

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

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={onSuccess}
        >
          Cancel
        </button>

        <button
          disabled={loading || !file || !rep}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg text-white flex items-center gap-2
            ${
              loading || !file || !rep
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
