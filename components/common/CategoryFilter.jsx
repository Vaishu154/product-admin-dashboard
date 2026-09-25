"use client";

export default function CategoryFilter({
  categories,
  value,
  onChange,
  disabled = false,
  loading = false,
  error = "",
  onRetry,
}) {
  return (
    <div className="relative">
      <label htmlFor="category-filter" className="sr-only">
        Filter by Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || loading}
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none transition hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      {error ? (
        <div className="absolute left-0 top-full mt-1 flex items-center gap-1.5 text-xs text-red-600 whitespace-nowrap z-10">
          <span>{error}</span>
          {onRetry ? (
            <button type="button" onClick={onRetry} className="underline font-medium">
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
