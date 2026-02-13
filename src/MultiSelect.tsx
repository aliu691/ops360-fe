import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MultiSelectProps = {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  placeholder?: string;
  format?: (v: string) => string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder,
  format,
  disabled,
  fullWidth = false,
}: MultiSelectProps) {
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

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const label =
    values.length === 0
      ? placeholder
      : values.map((v) => (format ? format(v) : v)).join(", ");

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : "w-fit"}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex items-center px-4 py-2
          ${fullWidth ? "w-full" : "min-w-[200px]"}
          bg-white border rounded-lg text-sm shadow-sm
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
      >
        <span
          className={`flex-1 truncate text-left ${
            values.length ? "text-gray-900" : "text-gray-400"
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
          className={`absolute z-50 mt-1
            ${fullWidth ? "w-full" : "min-w-full"}
            bg-white border border-gray-300 rounded-lg shadow-lg
            max-h-64 overflow-auto`}
        >
          {options.map((o) => {
            const checked = values.includes(o);

            return (
              <label
                key={o}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleValue(o)}
                />
                {format ? format(o) : o}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
