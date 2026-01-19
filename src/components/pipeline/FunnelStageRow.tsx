import { StageTotalsItem } from "../../types/pipeline";

interface Props {
  index: number;
  stage: StageTotalsItem;
  maxAmount: number;
}

export default function FunnelStageRow({ index, stage, maxAmount }: Props) {
  const amount = typeof stage.amount === "number" ? stage.amount : 0;
  const count = typeof stage.count === "number" ? stage.count : 0;
  const isEmpty = amount === 0 && count === 0;
  const isClosedWon = index === 5;

  /** -----------------------------
   * Perceptual width scaling (√)
   ------------------------------*/
  const MIN_WIDTH = 26; // %
  const MAX_WIDTH = 100;

  const widthPercent =
    amount > 0 && maxAmount > 0
      ? Math.max(
          (Math.sqrt(amount) / Math.sqrt(maxAmount)) * MAX_WIDTH,
          MIN_WIDTH
        )
      : MIN_WIDTH;

  const formatMoney = (value?: number | null) =>
    typeof value === "number" ? `₦${value.toLocaleString("en-NG")}` : "₦0";

  /** -----------------------------
   * Color logic
   ------------------------------*/
  const bgMap = [
    "linear-gradient(90deg, #dbeafe, #bfdbfe)", // stage 1
    "linear-gradient(90deg, #bfdbfe, #93c5fd)", // stage 2
    "linear-gradient(90deg, #93c5fd, #60a5fa)", // stage 3
    "linear-gradient(90deg, #60a5fa, #3b82f6)", // stage 4
    "linear-gradient(90deg, #1e3a8a, #2563eb)", // closed won
  ];

  return (
    <div className="w-full flex justify-center">
      <div
        className={`
          relative flex items-center justify-between
          px-6 py-4 rounded-xl
          transition-all duration-300
          ${isEmpty ? "bg-gray-200 text-gray-500" : "text-white"}
        `}
        style={{
          width: `${widthPercent}%`,
          maxWidth: "920px",
          minWidth: "360px",
          background: isEmpty ? undefined : bgMap[index - 1],
        }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          <span
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-bold flex-shrink-0
              ${
                isEmpty ? "bg-gray-300 text-gray-600" : "bg-white text-blue-600"
              }
            `}
          >
            {index}
          </span>

          <span className="font-semibold uppercase text-sm tracking-wide truncate">
            {stage.stageName || "Unknown Stage"}
          </span>
        </div>

        {/* RIGHT */}
        <div className="text-right text-sm whitespace-nowrap">
          <div className="font-bold text-lg">
            {isEmpty ? "₦ 0.0M" : formatMoney(amount)}
          </div>
          <div className="opacity-80">{count} Deals</div>
        </div>

        {/* TROPHY */}
        {isClosedWon && !isEmpty && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow">
            🏆
          </div>
        )}
      </div>
    </div>
  );
}
