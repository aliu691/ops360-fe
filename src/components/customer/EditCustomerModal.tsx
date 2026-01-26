import { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";

interface Props {
  customerId: number;
  currentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCustomerModal({
  customerId,
  currentName,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await apiClient.patch(API_ENDPOINTS.updateCustomer(customerId), { name });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update customer", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Organisation Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter organisation name"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
