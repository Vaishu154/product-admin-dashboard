"use client";

import { SearchIcon } from "@/components/common/Icons";

export default function SearchBar({ value, onChange, disabled = false }) {
  return (
    <div className="relative w-full sm:w-64 md:w-72 shrink-0">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <SearchIcon className="h-4 w-4" />
      </div>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search by product name..."
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
