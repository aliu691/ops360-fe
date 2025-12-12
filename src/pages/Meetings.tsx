import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import UploadMeetingsForm from "../components/UploadMeetingsForm";
import apiClient from "../config/apiClient";

interface Meeting {
  id: number;
  repName: string;
  customerName: string;
  primaryContact: string;
  meetingPurpose: string;
  meetingOutcome: string;
  createdAt: string;
}

export default function Meetings() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch meetings
  const loadMeetings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error("Error loading meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Meetings</h1>

        <button
          onClick={() => setUploadOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Upload Weekly Report
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16 text-gray-500">
          Loading meetings...
        </div>
      )}

      {/* Empty state */}
      {!loading && meetings.length === 0 && (
        <div className="text-center py-20 text-gray-500 border rounded-lg bg-white shadow">
          <p className="text-lg font-medium">No meetings found</p>
          <p className="text-gray-400 mt-1">
            Upload a weekly report to populate meeting data.
          </p>
        </div>
      )}

      {/* Meetings table */}
      {!loading && meetings.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-medium">Rep</th>
                <th className="p-3 font-medium">Client</th>
                <th className="p-3 font-medium">Primary Contact</th>
                <th className="p-3 font-medium">Purpose</th>
                <th className="p-3 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{m.repName}</td>
                  <td className="p-3">{m.customerName}</td>
                  <td className="p-3">{m.primaryContact}</td>
                  <td className="p-3">{m.meetingPurpose}</td>
                  <td className="p-3">{m.meetingOutcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)}>
        <UploadMeetingsForm
          onSuccess={() => {
            setUploadOpen(false);
            loadMeetings(); // refresh table
          }}
        />
      </Modal>
    </div>
  );
}
