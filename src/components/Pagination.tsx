interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string; // optional: "customers", "users", etc.
}

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  label = "items",
}: PaginationProps) {
  if (total === 0 || totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 bg-white border-t">
      {/* Left: range info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{total}</span> {label}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;

          // compact display
          if (
            pageNumber !== 1 &&
            pageNumber !== totalPages &&
            Math.abs(pageNumber - page) > 1
          ) {
            return null;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-2 rounded-md text-sm border ${
                page === pageNumber
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
