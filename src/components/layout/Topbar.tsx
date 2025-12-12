import React from "react";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  // small breadcrumb based on location
  const breadcrumb = (loc: string) => {
    if (loc.startsWith("/kpi")) return "Dashboard";
    if (loc.startsWith("/meetings")) return "Meetings";
    if (loc.startsWith("/upload")) return "Upload";
    return "";
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-gray-500">
            Welcome to Ops360 <span className="mx-2">/</span>{" "}
            {breadcrumb(location.pathname)}
          </div>
        </div>
      </div>
    </div>
  );
}
