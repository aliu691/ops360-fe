import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-8">Ops360</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/upload" className="hover:text-blue-400">
          Upload Meetings
        </Link>
        <Link to="/meetings" className="hover:text-blue-400">
          Meetings List
        </Link>
        <Link to="/dashboard" className="hover:text-blue-400">
          KPI Dashboard
        </Link>
      </nav>
    </div>
  );
}
