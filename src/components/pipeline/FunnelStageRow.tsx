import { StageTotalsItem } from "../../types/pipeline";
import { formatMoney } from "../../utils/numbersFormatters";

interface Props {
  index: number;
  stage: StageTotalsItem;
  maxAmount: number;
  onClick?: (stageKey: string) => void;
}

export default function FunnelStageRow({
  index,
  stage,
  maxAmount,
  onClick,
}: Props) {
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

  /** -----------------------------
   * Color logic
   ------------------------------*/

  const bgMap = [
    "linear-gradient(90deg, #9333EA, #7e22ce)", // stage 1 – purple
    "linear-gradient(90deg, #2563EB, #1d4ed8)", // stage 2 – blue
    "linear-gradient(90deg, #0D9488, #0f766e)", // stage 3 – teal
    "linear-gradient(90deg, #D97706, #b45309)", // stage 4 – orange
    "linear-gradient(90deg, #059669, #047857)", // stage 5 – green (Closed Won)
  ];

  return (
    <div className="w-full flex justify-center">
      <div
        onClick={() => onClick?.(stage.key)}
        className={`
    relative flex items-center justify-between
    px-6 py-4 rounded-xl
    transition-all duration-200
    cursor-pointer
    hover:scale-[1.015]
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
