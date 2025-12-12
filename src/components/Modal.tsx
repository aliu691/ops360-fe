import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Upload Weekly Report</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
