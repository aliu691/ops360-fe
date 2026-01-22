import { PipelineSummary } from "../../types/pipeline";

export default function PipelineSummaryBar({
  summary,
}: {
  summary: PipelineSummary;
}) {
  const formatMoney = (value?: number | null) =>
    typeof value === "number" ? `₦${value.toLocaleString("en-NG")}` : "₦0";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Total Pipeline</p>
          <p className="text-2xl font-bold">
            {formatMoney(summary.totalPipeline)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Avg Deal Size</p>
          <p className="text-2xl font-bold">
            {formatMoney(summary.avgDealSize)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">
            Weighted Forecast
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {formatMoney(summary.weightedForecast)}
          </p>
        </div>
      </div>
    </div>
  );
}
