import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CreateCustomerPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contacts, setContacts] = useState([
    { name: "", email: "", mobile: "" },
  ]);
  const [loading, setLoading] = useState(false);

  /* ================= CONTACT HANDLERS ================= */

  const addContact = () => {
    setContacts([...contacts, { name: "", email: "", mobile: "" }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (
    index: number,
    field: "name" | "email" | "mobile",
    value: string
  ) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.createCustomer(), {
        name: name.trim(),
        contacts: contacts.filter((c) => c.name || c.email || c.mobile),
      });

      toast.success("Customer created successfully");
      navigate("/customers");
    } catch (error: any) {
      console.error("Failed to create customer", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to create customer";

        toast.error(message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Create Customer</h1>
        <p className="text-sm text-gray-500">
          Add a new organisation and its contact persons.
        </p>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="font-semibold text-lg">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. Acme Corporation"
          />
        </div>
      </div>

      {/* ================= CONTACTS ================= */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Contact Persons</h2>

          <button
            onClick={addContact}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus size={16} />
            Add Contact
          </button>
        </div>

        {contacts.map((contact, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 relative"
          >
            {/* Remove */}
            {contacts.length > 1 && (
              <button
                onClick={() => removeContact(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                value={contact.name}
                onChange={(e) => updateContact(index, "name", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={contact.email}
                onChange={(e) => updateContact(index, "email", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                value={contact.mobile}
                onChange={(e) => updateContact(index, "mobile", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="+234 801 234 5678"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/customers")}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving…" : "Create Customer"}
        </button>
      </div>
    </div>
  );
}
