"use client";

import Link from "next/link";
import { EyeIcon, PencilIcon, TrashIcon } from "@/components/common/Icons";

export default function ProductActions({ productId, onDelete }) {
  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={`/products/${productId}`}
        className="inline-flex items-center justify-center rounded-lg bg-blue-50 p-1.5 text-blue-600 transition hover:bg-blue-100 active:scale-95"
        aria-label={`View product ${productId}`}
        title="View details"
      >
        <EyeIcon className="h-4 w-4" />
      </Link>
      <Link
        href={`/products/${productId}/edit`}
        className="inline-flex items-center justify-center rounded-lg bg-blue-50 p-1.5 text-blue-600 transition hover:bg-blue-100 active:scale-95"
        aria-label={`Edit product ${productId}`}
        title="Edit product"
      >
        <PencilIcon className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(productId)}
        className="inline-flex items-center justify-center rounded-lg bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100 active:scale-95"
        aria-label={`Delete product ${productId}`}
        title="Delete product"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
