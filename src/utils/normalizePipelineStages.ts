import { StageTotalsItem } from "../types/pipeline";

const STAGE_ORDER = [
  { key: "PROSPECTING", name: "Prospecting", order: 1 },
  {
    key: "NEEDS_DEFINED",
    name: "Needs Defined / RFP / Demo Signed Off",
    order: 2,
  },
  { key: "PROPOSAL_SUBMITTED", name: "Proposal Submitted", order: 3 },
  { key: "NEGOTIATION_DONE", name: "Negotiation", order: 4 },
  { key: "CLOSE_WON", name: "Close Won", order: 5 },
];

export function normalizePipelineStages(
  stageTotals: Record<string, any>
): StageTotalsItem[] {
  return STAGE_ORDER.map((stage) => {
    const data = stageTotals[stage.key];

    return {
      stageId: data?.stageId ?? null, // ✅ FIX
      key: stage.key,
      stageName: data?.stageName ?? stage.name,
      count: data?.count ?? 0,
      amount: data?.amount ?? 0,
      probability: data?.probability ?? 0,
      weightedAmount: data?.weightedAmount ?? 0,
      order: stage.order,
      isEmpty: !data,
    };
  });
}
