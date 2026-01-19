import { normalizePipelineStages } from "../../utils/normalizePipelineStages";
import FunnelStageRow from "./FunnelStageRow";

export default function PipelineFunnel({
  stageTotals,
}: {
  stageTotals: Record<string, any>;
}) {
  const stages = normalizePipelineStages(stageTotals);

  const maxAmount = Math.max(
    ...stages.map((s) => s.amount ?? 0),
    1 // prevent division by zero
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Pipeline Funnel</h2>
          <p className="text-sm text-gray-500">
            Stage-by-stage volume analysis
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
            This Quarter
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm flex items-center gap-1">
            All Users <span>▼</span>
          </button>
        </div>
      </div>

      {/* FUNNEL BODY */}
      <div className="flex flex-col items-center space-y-4">
        {stages.map((stage) => (
          <FunnelStageRow
            key={stage.key}
            index={stage.order}
            stage={stage}
            maxAmount={maxAmount}
          />
        ))}
      </div>
    </div>
  );
}
