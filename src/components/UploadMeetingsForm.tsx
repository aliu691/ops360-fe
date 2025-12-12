import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../config/apiClient";

export default function UploadMeetingsForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [repName, setRepName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!repName.trim()) {
      toast.error("Rep name is required.");
      return;
    }

    if (!file) {
      toast.error("Please select an Excel file (.xlsx).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await apiClient.post("/upload/meetings", formData, {
        params: { repName },
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;

      toast.success(`Upload successful! ${data.totalRows} rows processed.`);

      // Optional reset
      setFile(null);
      setRepName("");

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Upload error:", err);

      const message =
        err.response?.data?.message || "Upload failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Upload Weekly Report</h2>

      {/* Rep Name */}
      <div>
        <label className="block font-medium mb-1">Rep Name</label>
        <input
          type="text"
          value={repName}
          onChange={(e) => setRepName(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter rep name"
        />
      </div>

      {/* File Input */}
      <div>
        <label className="block font-medium mb-1">Excel File (.xlsx)</label>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
