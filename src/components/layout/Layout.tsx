import React, { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-gradient-to-b from-[#0f1724] to-[#0a1220] text-white min-h-screen">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex-1 min-h-screen flex flex-col">
          {/* Topbar */}
          <header className="bg-transparent">
            <Topbar />
          </header>

          {/* Content area */}
          <main className="flex-1 overflow-auto p-8">
            <div className="mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
