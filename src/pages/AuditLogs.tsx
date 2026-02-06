import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import Pagination from "../components/Pagination";
import { AuditLog } from "../types/audit";
import { useNavigate } from "react-router-dom";

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(
        API_ENDPOINTS.getAuditLogs({ page, limit })
      );

      setLogs(res.data?.items ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotal(res.data?.total ?? 0);
    } catch (err) {
      console.error("Failed to load audit logs", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getActorDisplay = (log: AuditLog) => {
    const actor = log.actor;

    if (!actor) {
      return {
        initials: log.actorType[0],
        name: log.actorType,
        sub: `ID: ${log.actorId}`,
      };
    }

    if (actor.type === "USER") {
      return {
        initials: actor.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join(""),
        name: actor.name,
        sub: actor.department,
      };
    }

    return {
      initials: actor.email[0].toUpperCase(),
      name: actor.email,
      sub: actor.role,
    };
  };

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-gray-500 text-sm">
          Comprehensive records of all system activities
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading audit logs…</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left px-6 py-4">Timestamp</th>
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Action</th>
                <th className="text-left px-6 py-4">Entity</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => {
                const actor = getActorDisplay(log);

                return (
                  <tr
                    key={log.id}
                    onClick={() => navigate(`/audit-logs/${log.id}`)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {actor.initials}
                        </div>

                        <div>
                          <div className="font-medium">{actor.name}</div>
                          <div className="text-xs text-gray-500">
                            {actor.sub}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {log.description}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.entity ?? "—"}
                    </td>
                  </tr>
                );
              })}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        label="logs"
      />
    </div>
  );
}
