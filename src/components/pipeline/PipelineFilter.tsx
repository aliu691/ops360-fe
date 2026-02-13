import { useEffect, useState } from "react";
import { MultiSelect } from "../../MultiSelect";
import { Select } from "../select";

type PipelineFilterProps = {
  isAdmin: boolean;
  users: any[];
  dealStages: any[];
  value: {
    year: string;
    quarter?: string;
    salesRepId?: string;
    preSalesRepIds: string[];
    stageId?: string;
  };
  onApply: (filters: {
    year: string;
    quarter?: string;
    salesRepId?: string;
    preSalesRepIds: string[];
    stageId?: string;
  }) => void;
  onClose?: () => void;
};

export default function PipelineFilter({
  isAdmin,
  users,
  dealStages,
  value,
  onApply,
  onClose,
}: PipelineFilterProps) {
  /* =========================
   * DERIVED DATA
   * ========================= */
  const currentYear = String(new Date().getFullYear());
  const yearOptions = Array.from(new Set([currentYear, "2025"])).sort(
    (a, b) => Number(b) - Number(a)
  );

  const salesReps = users.filter((u) => u.department === "SALES");
  const preSalesReps = users.filter((u) => u.department === "PRE_SALES");

  /* =========================
   * LOCAL STATE (SYNCED)
   * ========================= */
  const [year, setYear] = useState(value.year);
  const [quarter, setQuarter] = useState<string | undefined>(value.quarter);
  const [salesRepId, setSalesRepId] = useState<string | undefined>(
    value.salesRepId
  );
  const [preSalesRepIds, setPreSalesRepIds] = useState<string[]>(
    value.preSalesRepIds || []
  );
  const [stageId, setStageId] = useState<string | undefined>(value.stageId);

  /* =========================
   * SYNC WHEN VALUE CHANGES
   * ========================= */
  useEffect(() => {
    setYear(value.year);
    setQuarter(value.quarter);
    setSalesRepId(value.salesRepId);
    setPreSalesRepIds(value.preSalesRepIds || []);
    setStageId(value.stageId);
  }, [value]);

  /* =========================
   * APPLY
   * ========================= */
  const apply = () => {
    onApply({
      year,
      quarter,
      salesRepId,
      preSalesRepIds,
      stageId,
    });

    onClose?.();
  };

  /* =========================
   * RESET
   * ========================= */
  const reset = () => {
    const resetValues = {
      year: currentYear,
      quarter: undefined,
      salesRepId: undefined,
      preSalesRepIds: [],
      stageId: undefined,
    };

    setYear(resetValues.year);
    setQuarter(undefined);
    setSalesRepId(undefined);
    setPreSalesRepIds([]);
    setStageId(undefined);

    onApply(resetValues);
    onClose?.();
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-gray-50">
      {/* Year */}
      <Select
        value={year}
        onChange={(v) => v && setYear(v)}
        options={yearOptions}
        placeholder="Year"
      />

      {/* Quarter */}
      <Select
        value={quarter}
        onChange={setQuarter}
        options={["1", "2", "3", "4"]}
        placeholder="All Quarters"
        format={(q) => `Q${q}`}
      />

      {/* Sales Rep (Admin Only) */}
      {isAdmin && (
        <Select
          value={salesRepId}
          onChange={setSalesRepId}
          options={salesReps.map((u) => String(u.id))}
          placeholder="All Sales Reps"
          format={(id) => {
            const u = salesReps.find((x) => String(x.id) === id);
            return u ? `${u.firstName} ${u.lastName}` : id;
          }}
        />
      )}

      {/* Presales Multi */}
      <MultiSelect
        values={preSalesRepIds}
        onChange={setPreSalesRepIds}
        options={preSalesReps.map((u) => String(u.id))}
        placeholder="All Presales Reps"
        format={(id) => {
          const u = preSalesReps.find((x) => String(x.id) === id);
          return u ? `${u.firstName} ${u.lastName}` : id;
        }}
      />

      {/* Stage */}
      {dealStages.length > 0 && (
        <Select
          value={stageId}
          onChange={setStageId}
          options={dealStages.map((s) => String(s.id))}
          placeholder="All Deal Stages"
          format={(id) => {
            const s = dealStages.find((x) => String(x.id) === id);
            return s ? s.name : id;
          }}
        />
      )}

      {/* Actions */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50"
        >
          Reset
        </button>

        <button
          onClick={apply}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
