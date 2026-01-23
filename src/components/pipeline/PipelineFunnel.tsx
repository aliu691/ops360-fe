import { normalizePipelineStages } from "../../utils/normalizePipelineStages";
import FunnelStageRow from "./FunnelStageRow";

export default function PipelineFunnel({
  stageTotals,
  onStageClick,
}: {
  stageTotals: Record<string, any>;
  onStageClick?: (stage: { id: number; name: string }) => void;
}) {
  const stages = normalizePipelineStages(stageTotals);

  const maxAmount = Math.max(...stages.map((s) => s.amount ?? 0), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        {stages.map((stage) => (
          <FunnelStageRow
            key={stage.key}
            index={stage.order}
            stage={stage}
            maxAmount={maxAmount}
            onClick={() => {
              if (!stage.stageId) return;

              onStageClick?.({
                id: stage.stageId, // ✅ displayStage.id
                name: stage.stageName, // ✅ human label
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
