"use client";

import { PAGE_SIZES } from "@/utils/pagination";

export default function PageSizeSelector({ value, onChange, disabled = false }) {
  return (
    <div className="relative">
      <label htmlFor="page-size" className="sr-only">
        Page size
      </label>
      <select
        id="page-size"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            Page size: {size}
          </option>
        ))}
      </select>
    </div>
  );
}
