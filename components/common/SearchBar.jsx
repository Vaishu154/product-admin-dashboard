"use client";

export default function SearchBar({ value, onChange, disabled = false }) {
  return (
    <div className="min-w-[220px] flex-1">
      <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-slate-700">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search by product name"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
      />
    </div>
  );
}
