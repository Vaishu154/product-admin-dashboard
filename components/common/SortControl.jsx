"use client";

import { SORT_OPTIONS } from "@/utils/urlParams";

export default function SortControl({ value, onChange, disabled = false }) {
  return (
    <div className="min-w-[200px]">
      <label htmlFor="sort-control" className="mb-1 block text-sm font-medium text-slate-700">
        Sort
      </label>
      <select
        id="sort-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
      >
        <option value="">Default</option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
