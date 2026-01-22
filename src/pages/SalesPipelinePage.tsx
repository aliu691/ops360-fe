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

  const [year, setYear] = useState<string>("2025");
  const [quarter, setQuarter] = useState<string | undefined>();
  const [salesRepId, setSalesRepId] = useState<string | undefined>();
  const [preSalesRepId, setPreSalesRepId] = useState<string | undefined>();

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
   * LOAD PIPELINE
   * ========================= */
  const loadPipeline = async () => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS.getPipelineDeals({
        page,
        limit,
        year: Number(year),
        quarter: quarter ? Number(quarter) : undefined,
        salesOwnerId: salesRepId ? Number(salesRepId) : undefined,
        preSalesOwnerIds: preSalesRepId ? [Number(preSalesRepId)] : undefined,
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
  }, [year, quarter, salesRepId, preSalesRepId]);

  /* =========================
   * MODAL DEALS (displayStage ONLY)
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

  const resetFilters = () => {
    setYear("2025");
    setQuarter(undefined);
    setSalesRepId(undefined);
    setPreSalesRepId(undefined);
  };

  /* =========================
   * UI
   * ========================= */
  return (
    <div className="space-y-8 pb-20 px-6 md:px-10 lg:px-14">
      {/* HEADER + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stage-by-stage volume analysis
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={year}
            onChange={(v) => v && setYear(v)}
            options={[year]}
            placeholder="Year"
          />

          <Select
            value={quarter}
            onChange={setQuarter}
            options={["1", "2", "3", "4"]}
            placeholder="All Quarters"
            format={(q) => `Q${q}`}
          />

          <Select
            value={salesRepId}
            onChange={setSalesRepId}
            options={salesReps.map((u) => String(u.id))}
            placeholder="All Sales Reps"
            format={(id) => {
              const u = salesReps.find((x) => String(x.id) === id);
              return u ? `${u.firstName} ${u.lastName}` : id;
            }}
          />

          <Select
            value={preSalesRepId}
            onChange={setPreSalesRepId}
            options={preSalesReps.map((u) => String(u.id))}
            placeholder="All Presales Reps"
            format={(id) => {
              const u = preSalesReps.find((x) => String(x.id) === id);
              return u ? `${u.firstName} ${u.lastName}` : id;
            }}
          />

          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 text-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
            <QuarterlyTargetCard
              summary={data.summary}
              quarter={quarter ? Number(quarter) : undefined}
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

      {/* ===== MODAL ===== */}
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
