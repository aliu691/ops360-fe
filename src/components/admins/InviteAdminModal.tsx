import { useState } from "react";
import { apiClient } from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";
import { toast } from "react-hot-toast";

export default function InviteAdminModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(API_ENDPOINTS.inviteAdmin(), { email });
      toast.success("Invitation sent successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Invite New Admin</h2>
        <p className="text-sm text-gray-500 mb-6">
          A secure invitation link will be sent to the admin’s email.
        </p>

        <label className="block text-sm font-medium mb-2">
          Admin Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@ops360.com"
          className="w-full border rounded-lg px-3 py-2 mb-6"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
