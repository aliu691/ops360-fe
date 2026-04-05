import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useUsers } from "../hooks/useUsers";

import { ChevronDown } from "lucide-react";

import { formatMonthLabel, getCurrentMonth } from "../utils/dateUtils";
import { useAuth } from "../hooks/useAuth";
import React from "react";

import { useRef } from "react";

/* ---------------------------------------------
   TYPES
----------------------------------------------*/

interface MonthlyReport {
  period: "MONTHLY";

  totals: {
    meetings: number;
    meetingsWithPresales: number;
  };

  targets: {
    meetings: number;
    presales: number;
    weeks: number;
  };

  performance: {
    meetingAchievementRate: number;
    presalesAchievementRate: number;
  };

  deltas: {
    meetingDelta: number;
    presalesDelta: number;
  };

  analytics: {
    mostVisitedClient: string | null;
    mostVisits: number;
    uniqueClients: number;
    clientBreakdown: {
      client: string;
      meetings: number;
    }[];
  };

  meetings: {
    id: number;
    customerName: string;
    primaryContact?: string | null;
    meetingPurpose?: string | null;
    meetingOutcome?: string | null;

    reportingWeek: number; // ✅ number now
    weekLabel: string; // ✅ NEW

    preSalesOwners: {
      id: number;
      firstName: string;
      lastName: string;
    }[];
  }[];
}

/* ---------------------------------------------
   HELPERS
----------------------------------------------*/
function formatDelta(value: number) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return {
    text: `${Math.abs(value)} ${isPositive ? "Over Target" : "Below Target"}`,
    className: isPositive ? "text-emerald-600" : "text-rose-600",
  };
}
/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const [months, setMonths] = useState<string[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();

  const { users, loading: usersLoading } = useUsers();

  const [selectedRepId, setSelectedRepId] = useState<string | undefined>();

  const salesUsers = users.filter((u) => u.department === "SALES");

  const { actor } = useAuth();

  const [report, setReport] = useState<MonthlyReport | null>(null);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (actor?.type === "USER") {
      setSelectedRepId(String(actor.id));
    }
  }, [actor]);

  useEffect(() => {
    if (actor?.type === "ADMIN" && !selectedRepId && salesUsers.length > 0) {
      setSelectedRepId(String(salesUsers[0].id));
    }
  }, [actor, salesUsers, selectedRepId]);

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getAvailableMonths())
      .then((res) => {
        const items = res.data?.items ?? [];
        setMonths(items);

        const currentMonth = getCurrentMonth();

        if (items.includes(currentMonth)) {
          setSelectedMonth(currentMonth);
        } else if (items.length > 0) {
          setSelectedMonth(items[0]); // fallback
        }
      })
      .catch(() => setMonths([]));
  }, []);

  const selectedRepUser = salesUsers.find(
    (user) => String(user.id) === selectedRepId,
  );
  const effectiveRepName =
    actor?.type === "USER" ? actor.firstName : selectedRepUser?.firstName;

  function getReportFileName(name?: string, month?: string) {
    if (!name || !month) return "Meeting_Report.pdf";

    const [year, m] = month.split("-");
    const date = new Date(Number(year), Number(m) - 1);

    const monthName = date.toLocaleString("en-US", { month: "long" });

    return `Meeting_Report_${name}_${monthName}_${year}.pdf`;
  }

  const handleExport = async () => {
    if (!effectiveRepName || !selectedMonth || exporting) return;

    try {
      setExporting(true); // ✅ START LOADING

      const res = await apiClient.get(
        API_ENDPOINTS.exportMonthlyMeetingsReport(
          effectiveRepName,
          selectedMonth,
        ),
        {
          responseType: "blob",
        },
      );

      const [year, m] = selectedMonth.split("-");
      const date = new Date(Number(year), Number(m) - 1);

      const monthName = date.toLocaleString("en-US", {
        month: "long",
      });

      const fileName = `Meeting_Report_${effectiveRepName}_${monthName}_${year}.pdf`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url); // ✅ cleanup
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExporting(false); // ✅ STOP LOADING
    }
  };

  /* ---------------------------------------------------
   FETCH Report DATA
---------------------------------------------------*/

  useEffect(() => {
    if (!effectiveRepName || !selectedMonth) return;

    setLoading(true);

    apiClient
      .get(
        API_ENDPOINTS.getMonthlyMeetingsReport(effectiveRepName, selectedMonth),
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [effectiveRepName, selectedMonth]);

  /* ---------------------------------------------------
     RENDER
  ---------------------------------------------------*/

  return (
    <div className="min-h-screen pb-24 overflow-y-auto px-6 md:px-10 lg:px-12">
      {/* ---------------------------------------------
          HEADER — Title Left, Filters Right
      ----------------------------------------------*/}
      <div className="flex items-center justify-between mt-6 mb-10">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-extrabold">Monthly Meetings Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance overvie and client engagement logs.
          </p>
        </div>

        {/* Right Filters */}
        <div className="flex items-center gap-4">
          {/* Rep Select */}
          <div className="relative">
            <select
              value={selectedRepId ?? ""}
              onChange={(e) => setSelectedRepId(e.target.value)}
              disabled={usersLoading}
              className="appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm"
            >
              {salesUsers.map((u) => (
                <option key={u.id} value={String(u.id)}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={months}
            placeholder="All Months"
            formatLabel={formatMonthLabel}
          />

          {/* ✅ EXPORT BUTTON */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition
    ${
      exporting
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }
  `}
          >
            {exporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* TOTAL MEETINGS */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">TOTAL MEETINGS</p>

            {report && formatDelta(report.deltas.meetingDelta) && (
              <span
                className={`text-xs font-semibold ${
                  formatDelta(report.deltas.meetingDelta)?.className
                }`}
              >
                {formatDelta(report.deltas.meetingDelta)?.text}
              </span>
            )}
          </div>

          <p className="text-4xl font-bold mt-3">
            {report?.totals.meetings ?? 0}
            <span className="text-lg text-gray-400 ml-2">
              / {report?.targets.meetings ?? 0} Target
            </span>
          </p>

          <p className="text-xs text-gray-500 mt-4">ACHIEVEMENT PROGRESS</p>

          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${report?.performance.meetingAchievementRate ?? 0}%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {report?.performance.meetingAchievementRate ?? 0}%
          </p>
        </div>

        {/* PRE-SALES */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 font-medium">
              PRE-SALES ENGAGEMENT
            </p>

            {report && formatDelta(report.deltas.presalesDelta) && (
              <span
                className={`text-xs font-semibold ${
                  formatDelta(report.deltas.presalesDelta)?.className
                }`}
              >
                {formatDelta(report.deltas.presalesDelta)?.text}
              </span>
            )}
          </div>

          <p className="text-4xl font-bold mt-3">
            {report?.totals.meetingsWithPresales ?? 0}
            <span className="text-lg text-gray-400 ml-2">
              / {report?.targets.presales ?? 0} Target
            </span>
          </p>

          <p className="text-xs text-gray-500 mt-4">ACHIEVEMENT PROGRESS</p>

          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{
                width: `${report?.performance.presalesAchievementRate ?? 0}%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {report?.performance.presalesAchievementRate ?? 0}%
          </p>
        </div>

        {/* MOST VISITED */}
        <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
          <p className="text-sm text-gray-500 font-medium">
            MOST VISITED CLIENT
          </p>

          <div className="flex justify-between items-center mt-auto">
            <p className="font-semibold">
              {report?.analytics.mostVisitedClient ?? "—"}
            </p>

            {report?.analytics.mostVisits ? (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                {report.analytics.mostVisits} Meetings
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <p className="font-semibold text-lg">Meeting Records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="px-6 py-3 text-left">CLIENT</th>
                <th className="px-6 py-3 text-left">PRIMARY CONTACT</th>
                <th className="px-6 py-3 text-left">PURPOSE</th>
                <th className="px-6 py-3 text-left">OUTCOME</th>
                <th className="px-6 py-3 text-left">PRE-SALES</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(
                (report?.meetings ?? []).reduce((acc: any, m: any) => {
                  const key = m.weekLabel || "Unknown Week";
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(m);
                  return acc;
                }, {}),
              ).map(([week, meetings]: any, i) => (
                <React.Fragment key={i}>
                  {/* 🔹 WEEK HEADER */}
                  <tr className="bg-violet-50">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex items-center justify-between">
                        {/* Week Label */}
                        <span className="text-xs font-semibold text-violet-700">
                          {week}
                        </span>

                        {/* Count Badge */}
                        <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                          {meetings.length} meeting
                          {meetings.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* 🔹 MEETINGS */}
                  {meetings.map((m: any) => (
                    <tr
                      key={m.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* CLIENT */}
                      <td className="px-6 py-4 font-medium">
                        {m.customerName}
                      </td>

                      {/* PRIMARY CONTACT */}
                      <td className="px-6 py-4">{m.primaryContact || "—"}</td>

                      {/* PURPOSE */}
                      <td className="px-6 py-4">{m.meetingPurpose || "—"}</td>

                      {/* OUTCOME */}
                      <td className="px-6 py-4">{m.meetingOutcome || "—"}</td>

                      {/* PRE-SALES */}
                      <td className="px-6 py-4">
                        {m.preSalesOwners?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {m.preSalesOwners.map((p: any) => (
                              <span
                                key={p.id}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {p.firstName} {p.lastName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function Select({
  value,
  onChange,
  options,
  placeholder,
  formatLabel,
}: {
  value?: string;
  onChange: (v?: string) => void;
  options: string[];
  placeholder?: string;
  formatLabel?: (v: string) => string;
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {formatLabel ? formatLabel(o) : o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}
