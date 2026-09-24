"use client";

import ProductActions from "./ProductActions";
import ProductImage from "@/components/common/ProductImage";
import { getProductImage } from "@/utils/productHelpers";

export default function ProductCard({ product, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <ProductImage
          src={getProductImage(product)}
          alt={product.title}
          className="h-20 w-20 shrink-0 rounded-md"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900" title={product.title}>
            {product.title}
          </h3>
          <p className="mt-1 capitalize text-sm text-slate-500">{product.category}</p>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-slate-500">Price</dt>
              <dd className="font-medium text-slate-900">${product.price.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Rating</dt>
              <dd className="font-medium text-slate-900">{product.rating.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Stock</dt>
              <dd className="font-medium text-slate-900">{product.stock}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <ProductActions productId={product.id} onDelete={onDelete} />
      </div>
    </article>
  );
}
