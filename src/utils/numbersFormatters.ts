export const formatMoney = (value?: number | null) =>
  typeof value === "number" ? `₦${value.toLocaleString("en-NG")}` : "₦0";

export function formatCompactMoney(value?: number | null) {
  if (!value) return "₦0";

  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;

  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;

  if (value >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;

  return `₦${value.toLocaleString("en-NG")}`;
}
