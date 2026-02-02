import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Select({
  value,
  onChange,
  options,
  placeholder,
  format,
  disabled,
}: {
  value?: string;
  onChange: (v?: string) => void;
  options: string[];
  placeholder?: string;
  format?: (v: string) => string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={ref} className="relative w-fit">
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
                     bg-white border border-gray-300 rounded-lg shadow-lg
                     max-h-64 overflow-auto"
        >
          {/* Placeholder option */}
          {placeholder && (
            <div
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              {placeholder}
            </div>
          )}

          {options.map((o) => {
            const isActive = o === value;
            return (
              <div
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer
                  ${
                    isActive
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "hover:bg-gray-50"
                  }`}
              >
                {format ? format(o) : o}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
