import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { Plus, MoreVertical, Mail, Phone } from "lucide-react";
import { Customer, CustomerContact } from "../types/customer-responses";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import AddEditContactModal from "../components/customer/AddEditContactModal";

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.getCustomerById(id!));
      setCustomer(res.data?.item);
    } catch (err) {
      console.error("Failed to load customer", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading customer…</div>;
  }

  if (!customer) {
    return <div className="p-8 text-gray-500">Customer not found</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {customer.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-sm text-gray-500">
              Customer since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenEdit(true)}
          className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        >
          Edit Customer
        </button>
      </div>

      {/* ================= CONTACTS ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Contact Persons{" "}
          <span className="text-gray-400 text-sm">
            ({customer.contacts?.length ?? 0})
          </span>
        </h2>
      </div>

      {/* ================= CONTACT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {customer.contacts?.map((contact: CustomerContact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl shadow p-5 relative"
          >
            {/* Actions */}
            <button
              onClick={() => {
                setEditingContact(contact);
                setOpenContactModal(true);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical size={16} />
            </button>

            <div className="space-y-4">
              <div className="font-semibold text-lg">
                {contact.name ?? "Unnamed contact"}
              </div>

              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  {contact.email}
                </div>
              )}

              {contact.mobile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  {contact.mobile}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Contact Card */}
        <button
          onClick={() => {
            setEditingContact(null);
            setOpenContactModal(true);
          }}
          className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-gray-50"
        >
          <Plus size={20} />
          <span className="text-sm">Add New Contact</span>
        </button>
      </div>
      {openEdit && (
        <EditCustomerModal
          customerId={customer.id}
          currentName={customer.name}
          onClose={() => setOpenEdit(false)}
          onSuccess={fetchCustomer}
        />
      )}
      {openContactModal && (
        <AddEditContactModal
          customerId={customer.id}
          contact={editingContact ?? undefined}
          onClose={() => setOpenContactModal(false)}
          onSuccess={fetchCustomer}
        />
      )}
    </div>
  );
}
