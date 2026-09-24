"use client";

import Link from "next/link";

export default function ProductActions({ productId, onDelete }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/products/${productId}`}
        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        View
      </Link>
      <Link
        href={`/products/${productId}/edit`}
        className="rounded-md border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(productId)}
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
