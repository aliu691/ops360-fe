import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { User } from "../types/user";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(API_ENDPOINTS.getUserById(Number(id)))
      .then((res) => setUser(res.data.item))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading user…</div>;
  }

  if (!user || !user.name) {
    return <div className="p-8 text-red-500">User not found</div>;
  }

  const initials = user.name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">User Details</h1>
          <p className="text-sm text-gray-500">
            Manage profile information and permissions
          </p>
        </div>

        <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg">
          Deactivate User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
            {initials}
          </div>

          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>

          <span
            className={`inline-block mt-3 px-3 py-1 text-xs rounded-full ${
              user.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {user.status}
          </span>

          <div className="mt-6 text-sm space-y-2 text-gray-600">
            <div>Email: {user.email}</div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              value={user.name}
              readOnly
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              value={user.email}
              readOnly
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Role</label>
            <input
              value={user.role}
              readOnly
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
