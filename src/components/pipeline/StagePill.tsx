export function StagePill({
  probability,
  label,
}: {
  probability?: number;
  label?: string;
}) {
  if (probability === undefined || probability === null) return null;

  let classes = "bg-gray-100 text-gray-600";

  if (probability === 0) {
    // ❌ Closed Lost
    classes = "bg-red-100 text-red-700";
  } else if (probability <= 10) {
    classes = "bg-purple-100 text-purple-700"; // 10%
  } else if (probability <= 20) {
    classes = "bg-blue-100 text-blue-700"; // 20%
  } else if (probability <= 50) {
    classes = "bg-teal-100 text-teal-700"; // 50%
  } else if (probability <= 80) {
    classes = "bg-orange-100 text-orange-700"; // 80%
  } else {
    classes = "bg-green-100 text-green-700"; // 100% (Closed Won)
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes}`}
    >
      {label ?? `${probability}%`}
    </span>
  );
}
