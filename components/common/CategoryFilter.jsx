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
    <div className="min-w-[200px]">
      <label htmlFor="category-filter" className="mb-1 block text-sm font-medium text-slate-700">
        Category
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || loading}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      {loading ? <p className="mt-1 text-xs text-slate-500">Loading categories...</p> : null}
      {disabled && !loading ? (
        <p className="mt-1 text-xs text-slate-500">
          Category filter is disabled while search is active because DummyJSON cannot search and filter by category at the same time.
        </p>
      ) : null}
      {error ? (
        <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
          <span>{error}</span>
          {onRetry ? (
            <button type="button" onClick={onRetry} className="underline">
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
