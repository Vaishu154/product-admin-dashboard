"use client";

import { PAGE_SIZES } from "@/utils/pagination";

export default function PageSizeSelector({ value, onChange, disabled = false }) {
  return (
    <div>
      <label htmlFor="page-size" className="mb-1 block text-sm font-medium text-slate-700">
        Page size
      </label>
      <select
        id="page-size"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
