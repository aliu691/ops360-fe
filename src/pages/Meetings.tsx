import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { Search, ChevronDown, ChevronRight, UploadCloud } from "lucide-react";
import MeetingDetailsPanel from "../components/MeetingDetailsPanel";
import Modal from "../components/Modal";
import UploadMeetingsForm from "../components/UploadMeetingsForm";
import { API_ENDPOINTS } from "../config/api";

const reps = ["Ben", "Faith", "John", "Sarah"];

export default function Meetings() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [repFilter, setRepFilter] = useState(""); // ⭐ NEW: Selected Rep Filter

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     FETCH PAGINATED MEETINGS WITH REP FILTER
  -------------------------------------------------------*/
  const loadMeetings = async () => {
    setLoading(true);

    try {
      const url = API_ENDPOINTS.getMeetings(
        repFilter || undefined, // only pass rep if selected
        page,
        limit
      );

      const res = await apiClient.get(url);
      const data = res.data;

      setMeetings(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMeetings();
  }, [page, repFilter]); // ⭐ if rep changes → refetch

  /* -------------------------------------------------------
     LOCAL SEARCH (client-side)
  -------------------------------------------------------*/
  const filtered = meetings.filter((m) => {
    const q = query.toLowerCase();
    return (
      m.repName?.toLowerCase().includes(q) ||
      m.customerName?.toLowerCase().includes(q) ||
      m.primaryContact?.toLowerCase().includes(q)
    );
  });

  const openDetails = (m: any) => {
    setSelected(m);
    setOpenPanel(true);
  };

  /* -------------------------------------------------------
     RENDER
  -------------------------------------------------------*/
  return (
    <div className="space-y-10 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Meetings List</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all recorded meeting outcomes and next steps.
        </p>
      </div>

      {/* SEARCH + FILTERS + ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        {/* Search Box */}
        <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white w-full md:w-96 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search by client, rep, or contact…"
            className="w-full outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter & Upload */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={repFilter}
              onChange={(e) => {
                setPage(1);
                setRepFilter(e.target.value);
              }}
              className="
                  appearance-none 
                  px-4 py-2 
                  pr-10                       
                  bg-white border rounded-lg 
                  text-sm shadow-sm 
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-blue-100
                "
            >
              <option value="">All Reps</option>
              {reps.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Custom Chevron so spacing is perfect */}
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              className="
                  appearance-none 
                  px-4 py-2 
                  pr-10                       
                  bg-white border rounded-lg 
                  text-sm shadow-sm 
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-blue-100
                "
            >
              <option value="">All Months</option>
            </select>

            {/* Custom Chevron so spacing is perfect */}
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              className="
                  appearance-none 
                  px-4 py-2 
                  pr-10                       
                  bg-white border rounded-lg 
                  text-sm shadow-sm 
                  cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-blue-100
                "
            >
              <option value="">All Weeks</option>
            </select>

            {/* Custom Chevron so spacing is perfect */}
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <UploadCloud size={16} />
            Upload Weekly Report
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Rep</th>
                <th className="py-3 px-4 text-left font-medium">Client</th>
                <th className="py-3 px-4 text-left font-medium">
                  Primary Contact
                </th>
                <th className="py-3 px-4 text-left font-medium">Purpose</th>
                <th className="py-3 px-4 text-left font-medium">Outcome</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-t hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => openDetails(m)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {m.repName?.charAt(0)}
                      </div>
                      {m.repName}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {m.customerName}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {m.primaryContact}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {m.meetingPurpose}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {m.meetingOutcome?.slice(0, 80)}…
                  </td>

                  <td className="px-4 py-3 text-right">
                    <ChevronRight size={18} className="text-gray-400" />
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No meetings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-2 rounded-lg text-sm ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-2 rounded-lg text-sm ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* DETAILS PANEL */}
      <MeetingDetailsPanel
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        meeting={selected}
      />

      {/* UPLOAD MODAL */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadMeetingsForm
          onSuccess={() => {
            setUploadOpen(false);
            loadMeetings();
          }}
        />
      </Modal>
    </div>
  );
}
