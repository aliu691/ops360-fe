import { useEffect, useState } from "react";
import PipelineFunnel from "../components/pipeline/PipelineFunnel";
import PipelineSummaryBar from "../components/pipeline/PipelineSummaryBar";
import QuarterlyTargetCard from "../components/pipeline/QuarterlyTargetCard";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../config/apiClient";
import { PipelineResponse, PipelineSummary } from "../types/pipeline";

export default function SalesPipelinePage() {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const year = 2025;
  const quarter = undefined; // 👈 important (yearly view)
  const page = 1;
  const limit = 50;

  const loadPipeline = async () => {
    setLoading(true);

    try {
      const url = API_ENDPOINTS.getPipelineDeals({
        page,
        limit,
        year,
        // quarter intentionally omitted
      });

      const res = await apiClient.get(url);
      const apiData = res.data;

      const normalizedSummary: PipelineSummary = {
        year: apiData.summary.year,

        totalDeals: apiData.summary.totalDeals ?? 0,

        totalPipeline: apiData.summary.totalPipelineAmount ?? 0,

        closedWonAmount: apiData.summary.closedWon?.amount ?? 0,

        quarterlyTarget: apiData.summary.quarterlyTarget ?? null,

        achievementPercent: apiData.summary.percentToTarget ?? null,

        avgDealSize: apiData.summary.avgDealSize ?? 0,

        weightedForecast: apiData.summary.weightedForecast ?? 0,
      };

      setData({
        ...apiData,
        summary: normalizedSummary,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [year, quarter]);

  if (loading || !data) {
    return <div className="p-6">Loading pipeline…</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL */}
          <div className="col-span-4">
            <QuarterlyTargetCard summary={data.summary} quarter={quarter} />
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-8 space-y-6">
            <PipelineFunnel stageTotals={data.stageTotals} />
            <PipelineSummaryBar summary={data.summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
