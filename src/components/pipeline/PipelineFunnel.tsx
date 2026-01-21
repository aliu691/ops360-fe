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
