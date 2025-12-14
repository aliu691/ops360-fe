// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";

import {
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { formatMonthLabel } from "../utils/dateUtils";

/* ---------------------------------------------
   TYPES
----------------------------------------------*/

type FindingStatus = "GOOD" | "FAIR" | "FAIL" | string;

interface WeeklyFinding {
  status: FindingStatus;
  message: string;
}

interface MeetingFinding {
  meetingId: number;
  customerName: string;
  primaryContact: string;
  meetingPurpose: string;
  meetingOutcome: string;
  status: FindingStatus;
  message: string;
}

interface KPIWeeklySnapshot {
  totalMeetings: number;
  score: number;
  status: FindingStatus;
  weeklyFindings?: WeeklyFinding[];
  counts?: {
    missingOutcomeCount?: number;
    missingContactCount?: number;
    roleOnlyCount?: number;
  };
  meetingFindings?: MeetingFinding[];
}

interface WeekOption {
  week: number;
  label: string;
  startDate: string;
  endDate: string;
}

/* ---------------------------------------------
   CONFIG
----------------------------------------------*/

const reps = ["Ben", "Faith", "John", "Sarah"];

/* ---------------------------------------------
   HELPERS
----------------------------------------------*/

function normalizeStatus(s?: string) {
  if (!s) return "FAIR";
  const up = s.toUpperCase();
  if (["FAIL", "POOR"].includes(up)) return "FAIL";
  if (["GOOD"].includes(up)) return "GOOD";
  if (["FAIR"].includes(up)) return "FAIR";
  return up;
}

function statusClasses(status?: FindingStatus) {
  const s = normalizeStatus(status);
  if (s === "GOOD")
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    };
  if (s === "FAIL")
    return {
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
    };
  return {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  };
}

function statusIcon(status?: FindingStatus) {
  const s = normalizeStatus(status);
  if (s === "GOOD")
    return <CheckCircle2 size={18} className="text-emerald-600" />;
  if (s === "FAIL") return <XCircle size={18} className="text-rose-600" />;
  return <AlertTriangle size={18} className="text-amber-600" />;
}

/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/

export default function Dashboard() {
  const [selectedRep, setSelectedRep] = useState<string>("Ben");

  const [kpi, setKpi] = useState<KPIWeeklySnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const [openMeetingId, setOpenMeetingId] = useState<number | null>(null);

  const [months, setMonths] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<WeekOption[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>();

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.getAvailableMonths())
      .then((res) => setMonths(res.data?.items ?? []))
      .catch(() => setMonths([]));
  }, []);

  useEffect(() => {
    setWeeks([]);
    setSelectedWeek(undefined);

    if (!selectedMonth) return;

    apiClient
      .get(API_ENDPOINTS.getAvailableWeeks(selectedMonth))
      .then((res) => setWeeks(res.data?.items ?? []))
      .catch(() => setWeeks([]));
  }, [selectedMonth]);

  /* ---------------------------------------------------
   FETCH KPI DATA
---------------------------------------------------*/
  useEffect(() => {
    if (!selectedRep) return;

    setLoading(true);

    const params: Record<string, string | number> = {};

    if (selectedMonth) params.month = selectedMonth;
    if (selectedWeek !== undefined) params.week = selectedWeek;

    apiClient
      .get(API_ENDPOINTS.getKpi(selectedRep, params))
      .then((res) => {
        const data = res.data ?? {};
        setKpi({
          totalMeetings: data.totalMeetings ?? 0,
          score: data.score ?? 0,
          status: data.status ?? "FAIR",
          weeklyFindings: data.weeklyFindings ?? [],
          counts: data.counts ?? {},
          meetingFindings: data.meetingFindings ?? [],
        });
      })
      .catch((err) => {
        console.error("Dashboard KPI fetch error:", err);
        setKpi(null);
      })
      .finally(() => setLoading(false));
  }, [selectedRep, selectedMonth, selectedWeek]);

  /* ---------------------------------------------------
     WEEKLY FINDINGS MESSAGE
  ---------------------------------------------------*/
  function weeklyFindingsMessage() {
    const status = normalizeStatus(kpi?.status);
    const total = kpi?.totalMeetings ?? 0;

    if (status === "GOOD")
      return `Weekly Activity meets required minimum (5). Logged ${total} meetings.`;
    if (status === "FAIL")
      return `Weekly Activity critical. Logged ${total} meetings.`;

    return `Weekly Activity below required minimum (5). Logged ${total} meetings.`;
  }

  const scoreCardBorder =
    normalizeStatus(kpi?.status) === "GOOD"
      ? "border-emerald-200"
      : normalizeStatus(kpi?.status) === "FAIL"
      ? "border-rose-200"
      : "border-amber-200";

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
          <h1 className="text-3xl font-extrabold">KPI Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Weekly snapshot — shows findings and quality metrics for the
            selected rep.
          </p>
        </div>

        {/* Right Filters */}
        <div className="flex items-center gap-4">
          {/* Rep Select */}
          <div className="relative">
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="
                appearance-none px-4 py-2 pr-10
                bg-white border rounded-lg 
                text-sm shadow-sm cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-100
              "
            >
              {reps.map((r) => (
                <option key={r} value={r}>
                  {r}
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

          <div className="relative">
            <select
              value={selectedWeek ?? ""}
              onChange={(e) =>
                setSelectedWeek(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="appearance-none px-4 py-2 pr-10 bg-white border rounded-lg text-sm shadow-sm"
            >
              <option value="">All Weeks</option>
              {weeks.map((w) => (
                <option key={w.week} value={w.week}>
                  {w.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total meetings */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 font-medium">TOTAL MEETINGS</p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-4xl font-bold">{kpi?.totalMeetings ?? 0}</p>
              <p className="text-xs text-gray-400 mt-1">This week</p>
            </div>

            <div className="inline-block rounded-full bg-emerald-50 px-4 py-2 border border-emerald-100 text-center">
              <div className="text-xs text-emerald-700 font-semibold">
                Score
              </div>
              <div className="text-xl font-bold">{kpi?.score ?? 0}</div>
            </div>
          </div>
        </div>

        {/* WEEKLY SCORE */}
        <div
          className={`bg-white rounded-xl shadow p-6 border ${scoreCardBorder}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                WEEKLY SCORE CARD
              </p>
              <div className="mt-2 flex items-end gap-4">
                <p className="text-4xl font-extrabold">{kpi?.score ?? 0}</p>
                <p className="text-sm text-gray-500 mt-1">/ 100</p>
              </div>
            </div>

            <div
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${
                statusClasses(kpi?.status).text
              } ${statusClasses(kpi?.status).bg}`}
            >
              {kpi?.status}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  (kpi?.score ?? 0) >= 70
                    ? "bg-emerald-500"
                    : (kpi?.score ?? 0) >= 45
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${kpi?.score ?? 0}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-gray-500">Target is &gt; 70.</p>
          </div>
        </div>

        {/* WEEKLY FINDINGS */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 font-medium">WEEKLY FINDINGS</p>

          <div className="flex items-start gap-3 mt-4">
            <div
              className={`p-2 rounded-md border ${
                statusClasses(kpi?.status).border
              } ${statusClasses(kpi?.status).bg}`}
            >
              {statusIcon(kpi?.status)}
            </div>

            <div>
              <p className="font-semibold text-sm">
                {normalizeStatus(kpi?.status) === "GOOD"
                  ? "Good Activity"
                  : normalizeStatus(kpi?.status) === "FAIL"
                  ? "Poor Activity"
                  : "Fair Activity"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {weeklyFindingsMessage()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MEETING BREAKDOWN */}
      <div className="space-y-6 mb-20">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7h18M3 12h18M3 17h18"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-xl font-semibold">Meetings Breakdown</h2>
        </div>

        {loading && <div className="text-gray-500">Loading…</div>}

        {!loading && (kpi?.meetingFindings?.length ?? 0) === 0 && (
          <div className="bg-white rounded-xl p-6 shadow text-center text-gray-500">
            No meeting findings for this week.
          </div>
        )}

        <div className="space-y-4">
          {!loading &&
            (kpi?.meetingFindings ?? []).map((mf) => {
              const isOpen = openMeetingId === mf.meetingId;
              const sc = statusClasses(mf.status);

              return (
                <div
                  key={mf.meetingId}
                  className="bg-white rounded-xl shadow overflow-hidden border"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${sc.border} ${sc.bg}`}
                      >
                        <div className={`text-sm font-semibold ${sc.text}`}>
                          {normalizeStatus(mf.status) === "GOOD"
                            ? "✓"
                            : normalizeStatus(mf.status) === "FAIL"
                            ? "✕"
                            : "!"}
                        </div>
                      </div>

                      <div>
                        <p className="text-lg font-semibold">
                          Meeting at{" "}
                          <span className="font-bold">{mf.customerName}</span>
                        </p>
                        <p className="text-xs text-gray-400">{mf.status}</p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setOpenMeetingId(isOpen ? null : mf.meetingId)
                      }
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition"
                    >
                      {isOpen ? (
                        <>
                          Close <ChevronDown size={16} />
                        </>
                      ) : (
                        <>
                          View <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  {isOpen && (
                    <div className="px-6 py-6 space-y-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-semibold text-gray-500">
                            PRIMARY CONTACT
                          </p>
                          <p className="mt-2 text-sm text-gray-800">
                            {mf.primaryContact ?? "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500">
                            MEETING PURPOSE
                          </p>
                          <p className="mt-2 text-sm text-gray-800">
                            {mf.meetingPurpose ?? "—"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-500">
                          MEETING OUTCOME
                        </p>
                        <p className="text-sm mt-2 text-gray-800">
                          {mf.meetingOutcome}
                        </p>
                      </div>

                      <div
                        className={`border rounded-lg p-4 ${
                          normalizeStatus(mf.status) === "GOOD"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : normalizeStatus(mf.status) === "FAIL"
                            ? "bg-rose-50 border-rose-100 text-rose-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {normalizeStatus(mf.status) === "GOOD"
                            ? "QUALITY CHECK"
                            : "FINDING"}
                        </p>
                        <p className="mt-2 text-sm">{mf.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
