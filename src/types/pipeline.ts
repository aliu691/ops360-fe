export interface StageTotalsItem {
  stageId: number | null; // ✅ allow empty stages
  key: string;
  stageName: string;
  count: number;
  amount: number;
  probability: number;
  weightedAmount: number;
  order: number;
  isEmpty: boolean;
}

export type StageTotalsMap = Record<string, StageTotalsItem>;

export interface PipelineSummary {
  year: string;

  // counts
  totalDeals: number;

  // money
  totalPipeline: number;
  closedWonAmount: number;
  avgDealSize: number;
  weightedForecast: number;

  // targets (nullable by design)
  quarterlyTarget: number | null;
  achievementPercent: number | null;
}

export interface PipelineResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stageTotals: StageTotalsMap;
  summary: PipelineSummary;
}
