import { Opportunity } from "../../types/pipeline";

export function Stats({ deal }: { deal: Opportunity }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Deal Amount"
        value={`₦${Number(deal.displayValue).toLocaleString()}`}
      />

      <StatCard
        label="Probability"
        value={`${deal.displayStage?.probability ?? 0}%`}
        bar
        percent={deal.displayStage?.probability ?? 0}
      />

      <StatCard
        label="Expected Close"
        value={new Date(deal.expectedCloseDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  bar,
  percent,
}: {
  label: string;
  value: string;
  bar?: boolean;
  percent?: number;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="text-xl font-bold mt-1">{value}</div>

      {bar && (
        <div className="mt-3 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
