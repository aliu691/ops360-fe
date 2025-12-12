import { X, User, Calendar, BadgeInfo } from "lucide-react";
import { useEffect } from "react";

interface MeetingDetailsPanelProps {
  open: boolean;
  onClose: () => void;
  meeting: any | null;
}

export default function MeetingDetailsPanel({
  open,
  onClose,
  meeting,
}: MeetingDetailsPanelProps) {
  // Close on ESC press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!open || !meeting) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* PANEL */}
      <div
        className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 
                      animate-slideIn border-l border-gray-200 flex flex-col"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">{meeting.customerName}</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto px-5 py-6 space-y-6">
          {/* Rep */}
          <div>
            <p className="text-xs font-semibold text-gray-500">REP</p>
            <p className="mt-1 text-sm font-medium">{meeting.repName}</p>
          </div>

          {/* Primary Contact */}
          <div>
            <p className="text-xs font-semibold text-gray-500">
              PRIMARY CONTACT
            </p>
            <p className="mt-1 text-sm">{meeting.primaryContact || "—"}</p>
          </div>

          {/* Purpose */}
          <div>
            <p className="text-xs font-semibold text-gray-500">PURPOSE</p>
            <p className="mt-1 text-sm">{meeting.meetingPurpose || "—"}</p>
          </div>

          {/* Outcome */}
          <div className="bg-gray-50 border rounded-md p-4">
            <p className="text-xs font-semibold text-gray-500">
              MEETING OUTCOME
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              {meeting.meetingOutcome || "No outcome provided."}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            {new Date(meeting.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  );
}
