import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      {/* TOP BAR */}
      <header className="h-14 bg-white border-b flex items-center px-6">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="h-8 w-8 rounded bg-[#0f172a] text-white flex items-center justify-center">
            O
          </div>
          Ops360
        </div>
      </header>

      {/* CENTER CONTENT */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="h-14 bg-white border-t flex items-center justify-between px-6 text-sm text-gray-500">
        <span>
          © {new Date().getFullYear()} Ops360 Inc. All rights reserved.
        </span>

        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-700">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
