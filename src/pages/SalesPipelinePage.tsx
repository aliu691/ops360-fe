import { useEffect, useMemo, useState } from "react";
import PipelineFilter from "../components/pipeline/PipelineFilter";
import PipelineFunnel from "../components/pipeline/PipelineFunnel";
import PipelineSummaryBar from "../components/pipeline/PipelineSummaryBar";
import QuarterlyTargetCard from "../components/pipeline/QuarterlyTargetCard";
import StageDealsModal from "../components/pipeline/StageDealsModal";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../config/apiClient";
import { useAuth } from "../hooks/useAuth";
import { PipelineResponse, PipelineSummary } from "../types/pipeline";

export default function SalesPipelinePage() {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [hideClosedWon, setHideClosedWon] = useState(false);

  /* =========================
   * FILTER VISIBILITY
   * ========================= */
  const [showFilters, setShowFilters] = useState(false);

  const currentYear = String(new Date().getFullYear());

  /* =========================
   * APPLIED FILTERS (API)
   * ========================= */
  type PipelineFilters = {
    year: string;
    quarter?: string;
    salesRepId?: string;
    preSalesRepIds: string[];
    stageId?: string;
  };

  const [appliedFilters, setAppliedFilters] = useState<PipelineFilters>({
    year: currentYear,
    preSalesRepIds: [],
  });

  const [selectedStage, setSelectedStage] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const page = 1;
  const limit = 100;

  /* =========================
   * LOAD USERS
   * ========================= */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.getUsers());
        setUsers(res.data?.items ?? []);
      } catch (err) {
        console.error("Failed to load users", err);
        setUsers([]);
      }
    };

    loadUsers();
  }, []);

  const { actor, isAdmin, isUser } = useAuth();

  const effectiveFilters = {
    year: Number(appliedFilters.year),
    quarter: appliedFilters.quarter
      ? Number(appliedFilters.quarter)
      : undefined,

    // 🔒 Sales rep filter: ADMIN ONLY
    salesOwnerId:
      actor?.type === "ADMIN" && appliedFilters.salesRepId
        ? Number(appliedFilters.salesRepId)
        : undefined,

    // ✅ Presales filter: USER + ADMIN
    preSalesOwnerIds:
      appliedFilters.preSalesRepIds.length > 0
        ? appliedFilters.preSalesRepIds.map(Number)
        : undefined,
  };

  /* =========================
   * LOAD PIPELINE (APPLIED ONLY)
   * ========================= */
  const loadPipeline = async () => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS.getPipelineDeals({
        page,
        limit,
        ...effectiveFilters,
      });

      const res = await apiClient.get(url);
      const apiData = res.data;

      const normalizedSummary: PipelineSummary = {
        year: apiData.summary.year,
        totalDeals: apiData.summary.totalDeals ?? 0,
        totalPipeline: apiData.summary.totalPipelineAmount ?? 0,
        closedWonAmount: apiData.summary.closedWon?.amount ?? 0,
        yearlyTarget: apiData.summary.yearlyTarget ?? 0,
        quarterlyTarget: apiData.summary.quarterlyTarget ?? null,
        achievementPercent: apiData.summary.percentToTarget ?? null,
        avgDealSize: apiData.summary.avgDealSize ?? 0,
        weightedForecast: apiData.summary.weightedForecast ?? 0,
      };

      setData({ ...apiData, summary: normalizedSummary });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [appliedFilters]);

  const yearOptions = Array.from(new Set([currentYear, "2025"])).sort(
    (a, b) => Number(b) - Number(a)
  );

  /* =========================
   * MODAL DEALS
   * ========================= */
  const modalDeals = useMemo(() => {
    if (!data || !selectedStage) return [];
    return data.items.filter(
      (deal) => deal.displayStage?.id === selectedStage.id
    );
  }, [data, selectedStage]);

  if (loading || !data) {
    return <div className="p-6">Loading pipeline…</div>;
  }

  /* =========================
   * UI
   * ========================= */
  return (
    <div className="space-y-8 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stage-by-stage volume analysis
          </p>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-3 md:ml-auto">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 transition"
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>

          <button
            onClick={() => setHideClosedWon((v) => !v)}
            className={`px-4 py-2 text-sm rounded-lg border transition
        ${
          hideClosedWon
            ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
            : "bg-white hover:bg-gray-50"
        }`}
          >
            {hideClosedWon ? "Show Closed Won" : "Hide Closed Won"}
          </button>
        </div>
      </div>

      {showFilters && (
        <PipelineFilter
          isAdmin={isAdmin}
          users={users}
          dealStages={[]}
          value={{
            year: appliedFilters.year,
            quarter: appliedFilters.quarter,
            salesRepId: appliedFilters.salesRepId,
            preSalesRepIds: appliedFilters.preSalesRepIds ?? [],
          }}
          onApply={(filters) => {
            setAppliedFilters(filters);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-6 min-w-0">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
            <QuarterlyTargetCard
              summary={data.summary}
              quarter={
                appliedFilters.quarter
                  ? Number(appliedFilters.quarter)
                  : undefined
              }
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8 space-y-6 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <PipelineFunnel
              stageTotals={data.stageTotals}
              onStageClick={(stage) => setSelectedStage(stage)}
              hideClosedWon={hideClosedWon}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <PipelineSummaryBar summary={data.summary} />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedStage && (
        <StageDealsModal
          stageName={selectedStage.name}
          deals={modalDeals}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </div>
  );
}
