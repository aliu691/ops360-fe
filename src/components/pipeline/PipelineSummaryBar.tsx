import { PipelineSummary } from "../../types/pipeline";
import { formatMoney } from "../../utils/numbersFormatters";

export default function PipelineSummaryBar({
  summary,
}: {
  summary: PipelineSummary;
}) {
  const activePipeline =
    (summary.totalPipeline ?? 0) - (summary.closedWonAmount ?? 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Total Pipeline</p>
          <p className="text-xl sm:text-2xl font-bold break-words">
            {formatMoney(summary.totalPipeline)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">
            Active Pipeline
          </p>
          <p className="text-xl sm:text-2xl font-bold break-words">
            {formatMoney(activePipeline)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">
            Weighted Forecast
          </p>
          <p className="text-xl sm:text-2xl font-bold break-words text-blue-600">
            {formatMoney(summary.weightedForecast)}
          </p>
        </div>
      </div>
    </div>
  );
}
