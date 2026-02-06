import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-hot-toast";
import InviteAdminModal from "../components/admins/InviteAdminModal";

type Admin = {
  id: number;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export default function AdminsList() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.getAdmins());
      setAdmins(res.data.items || []);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header (UNCHANGED) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Admins</h1>
          <p className="text-sm text-gray-500">
            Manage system administrators and access privileges
          </p>
        </div>

        <button
          onClick={() => setInviteOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          Invite New Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading admins…</div>
        ) : admins.length === 0 ? (
          <div className="p-6 text-gray-500">No admins found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {admin.email}
                  </td>

                  <td className="px-6 py-4">
                    {admin.role === "SUPER_ADMIN" ? (
                      <span className="text-blue-600 font-semibold">
                        Super Admin
                      </span>
                    ) : (
                      "Admin"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal (UNCHANGED) */}
      {inviteOpen && (
        <InviteAdminModal
          onClose={() => {
            setInviteOpen(false);
            fetchAdmins(); // refresh list after invite
          }}
        />
      )}
    </div>
  );
}
