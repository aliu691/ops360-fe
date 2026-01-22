import { User } from "./user";

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
  yearlyTarget: number | null;
}

export interface PipelineResponse {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  stageTotals: StageTotalsMap;
  summary: PipelineSummary;
  items: Opportunity[];
}

export interface Opportunity {
  /* =====================
   * CORE IDENTIFIERS
   * ===================== */
  id: number;
  externalDealId: string;

  /* =====================
   * DEAL INFO
   * ===================== */
  organizationName: string;
  dealName: string;

  dealValueExcel: string | null;
  dealValueManual: string | null;

  year: number;
  quarter: number;

  expectedCloseDate: string;

  nextAction?: string | null;
  redFlag?: string | null;

  source: "UI" | "IMPORT" | string;
  status: "ACTIVE" | "INACTIVE" | string;

  createdAt: string;
  updatedAt: string;

  /* =====================
   * STAGES
   * ===================== */
  stageExcelId?: number | null;
  stageManualId?: number | null;

  displayValue: string | null;
  displayStage?: {
    id: number;
    key: string;
    name: string;
    probability: number;
    sortOrder: number;
  } | null;

  stageExcel?: {
    id: number;
    key: string;
    name: string;
    probability: number;
    sortOrder: number;
  } | null;

  stageManual?: {
    id: number;
    key: string;
    name: string;
    probability: number;
    sortOrder: number;
  } | null;

  /* =====================
   * SALES OWNER
   * ===================== */
  salesOwnerId?: number | null;

  salesOwner?: User | null;

  /* =====================
   * PRE-SALES OWNERS
   * ===================== */
  preSalesOwners?: User[] | null;
}
