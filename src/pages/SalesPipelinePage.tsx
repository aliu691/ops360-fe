import { useEffect, useMemo, useState } from "react";
import PipelineFunnel from "../components/pipeline/PipelineFunnel";
import PipelineSummaryBar from "../components/pipeline/PipelineSummaryBar";
import QuarterlyTargetCard from "../components/pipeline/QuarterlyTargetCard";
import StageDealsModal from "../components/pipeline/StageDealsModal";
import { Select } from "../components/select";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../config/apiClient";
import { PipelineResponse, PipelineSummary } from "../types/pipeline";

export default function SalesPipelinePage() {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  /* =========================
   * FILTER VISIBILITY
   * ========================= */
  const [showFilters, setShowFilters] = useState(false);

  /* =========================
   * DRAFT FILTERS (UI ONLY)
   * ========================= */
  const [draftYear, setDraftYear] = useState("2025");
  const [draftQuarter, setDraftQuarter] = useState<string | undefined>();
  const [draftSalesRepId, setDraftSalesRepId] = useState<string | undefined>();
  const [draftPreSalesRepId, setDraftPreSalesRepId] = useState<
    string | undefined
  >();

  /* =========================
   * APPLIED FILTERS (API)
   * ========================= */
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2025",
    quarter: undefined as string | undefined,
    salesRepId: undefined as string | undefined,
    preSalesRepId: undefined as string | undefined,
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

  const salesReps = users.filter((u) => u.department === "SALES");
  const preSalesReps = users.filter((u) => u.department === "PRE_SALES");

  /* =========================
   * LOAD PIPELINE (APPLIED ONLY)
   * ========================= */
  const loadPipeline = async () => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS.getPipelineDeals({
        page,
        limit,
        year: Number(appliedFilters.year),
        quarter: appliedFilters.quarter
          ? Number(appliedFilters.quarter)
          : undefined,
        salesOwnerId: appliedFilters.salesRepId
          ? Number(appliedFilters.salesRepId)
          : undefined,
        preSalesOwnerIds: appliedFilters.preSalesRepId
          ? [Number(appliedFilters.preSalesRepId)]
          : undefined,
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

  /* =========================
   * APPLY / RESET FILTERS
   * ========================= */
  const applyFilters = () => {
    setAppliedFilters({
      year: draftYear,
      quarter: draftQuarter,
      salesRepId: draftSalesRepId,
      preSalesRepId: draftPreSalesRepId,
    });
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftYear("2025");
    setDraftQuarter(undefined);
    setDraftSalesRepId(undefined);
    setDraftPreSalesRepId(undefined);

    setAppliedFilters({
      year: "2025",
      quarter: undefined,
      salesRepId: undefined,
      preSalesRepId: undefined,
    });
  };

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

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-gray-50">
          <Select
            value={draftYear}
            onChange={(v) => v && setDraftYear(v)}
            options={["2025"]}
            placeholder="Year"
          />

          <Select
            value={draftQuarter}
            onChange={setDraftQuarter}
            options={["1", "2", "3", "4"]}
            placeholder="All Quarters"
            format={(q) => `Q${q}`}
          />

          <Select
            value={draftSalesRepId}
            onChange={setDraftSalesRepId}
            options={salesReps.map((u) => String(u.id))}
            placeholder="All Sales Reps"
            format={(id) => {
              const u = salesReps.find((x) => String(x.id) === id);
              return u ? `${u.firstName} ${u.lastName}` : id;
            }}
          />

          <Select
            value={draftPreSalesRepId}
            onChange={setDraftPreSalesRepId}
            options={preSalesReps.map((u) => String(u.id))}
            placeholder="All Presales Reps"
            format={(id) => {
              const u = preSalesReps.find((x) => String(x.id) === id);
              return u ? `${u.firstName} ${u.lastName}` : id;
            }}
          />

          <div className="flex gap-2 ml-auto">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              onClick={applyFilters}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4">
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
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <PipelineFunnel
              stageTotals={data.stageTotals}
              onStageClick={(stage) => setSelectedStage(stage)}
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
