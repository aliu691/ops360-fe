import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  format,
  disabled,
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  value?: string;
  onChange: (v?: string) => void;
  options: string[];
  placeholder?: string;
  format?: (v: string) => string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label =
    value === undefined || value === ""
      ? placeholder
      : format
      ? format(value)
      : value;

  const filteredOptions = useMemo(() => {
    if (!searchable || !query) return options;
    return options.filter((o) =>
      (format ? format(o) : o).toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query, searchable, format]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex items-center w-full px-4 py-2
          bg-white border rounded-lg text-sm shadow-sm
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
      >
        <span
          className={`flex-1 truncate text-left ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {label}
        </span>

        <ChevronDown
          size={16}
          className={`ml-3 shrink-0 text-gray-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full
          bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          {/* Search */}
          {searchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full text-sm outline-none"
              />
            </div>
          )}

          {/* Options */}
          <div className="max-h-64 overflow-auto">
            {placeholder && (
              <div
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                  setQuery("");
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                {placeholder}
              </div>
            )}

            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No results found
              </div>
            )}

            {filteredOptions.map((o) => {
              const isActive = o === value;
              return (
                <div
                  key={o}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {format ? format(o) : o}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
