import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

export default function Topbar() {
  const location = useLocation();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-gray-500">
            <Breadcrumbs />
          </div>
        </div>
      </div>
    </div>
  );
}
