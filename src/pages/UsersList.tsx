import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "../types/user";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getUsers())
      .then((res) => setUsers(res.data?.items ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User List</h1>
          <p className="text-gray-500 text-sm">
            Manage system access, roles, and user details.
          </p>
        </div>

        <button
          onClick={() => navigate("/users/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading users…</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{u.name}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>

                  <td className="px-6 py-4">{u.role ?? "SALES REP"}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-3 justify-end">
                    <button
                      onClick={() => navigate(`/users/${u.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>

                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
