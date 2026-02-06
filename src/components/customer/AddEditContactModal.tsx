import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../config/apiClient";
import { API_ENDPOINTS } from "../../config/api";

interface Contact {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
}

interface Props {
  customerId: number;
  contact?: Contact; // if present → edit mode
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEditContactModal({
  customerId,
  contact,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = Boolean(contact?.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name ?? "");
      setEmail(contact.email ?? "");
      setMobile(contact.mobile ?? "");
    }
  }, [contact]);

  const handleSave = async () => {
    if (!name && !email && !mobile) return;

    try {
      setLoading(true);

      if (isEdit && contact?.id) {
        await apiClient.patch(API_ENDPOINTS.updateCustomerContact(contact.id), {
          name,
          email,
          mobile,
        });
      } else {
        await apiClient.post(API_ENDPOINTS.createCustomerContacts(customerId), {
          name,
          email,
          mobile,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save contact", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Contact" : "Add Contact"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contact name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Phone number"
            />
          </div>
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
            disabled={loading || (!name && !email && !mobile)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
