import { PipelineSummary } from "../../types/pipeline";

interface Props {
  summary: PipelineSummary;
  quarter?: number;
}

export default function QuarterlyTargetCard({ summary, quarter }: Props) {
  const formatMoney = (value?: number | null) =>
    typeof value === "number" ? `₦ ${(value / 1_000_000).toFixed(1)}M` : "—";

  const percentage = summary.achievementPercent ?? 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500 font-medium">
          {quarter ? `Q${quarter} PERFORMANCE` : "YEARLY PERFORMANCE"}
        </p>
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-8">
        {quarter ? "Quarterly Target" : "Yearly Overview"}
      </h2>

      {/* Circular progress only when quarter exists */}
      {quarter && (
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40">
            <svg className="-rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900">
                {percentage}%
              </div>
              <div className="text-xs text-gray-500 mt-1">TO TARGET</div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="space-y-4">
        {quarter && (
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-600">Quarterly Target</span>
            <div className="text-xl font-bold">
              {formatMoney(summary.quarterlyTarget)}
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-2" />
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-sm text-blue-700 font-medium">
              Closed Won
            </span>
            <span className="text-xl font-bold text-blue-600">
              {formatMoney(summary.closedWonAmount)}
            </span>
          </div>

          {quarter && (
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>

        <div className="pt-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Deals</span>
            <strong>{summary.totalDeals}</strong>
          </div>

          <div className="flex justify-between">
            <span>Avg Deal Size</span>
            <strong>{formatMoney(summary.avgDealSize)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
