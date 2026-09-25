"use client";

import ProductActions from "./ProductActions";
import ProductImage from "@/components/common/ProductImage";
import { getProductImage } from "@/utils/productHelpers";

export default function ProductCard({ product, onDelete }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex gap-3.5">
        <ProductImage
          src={getProductImage(product)}
          alt={product.title}
          className="h-20 w-20 shrink-0 rounded-xl bg-slate-50 border border-slate-100 object-contain p-1"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 leading-snug" title={product.title}>
            {product.title}
          </h3>
          <div className="mt-1.5">
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 capitalize">
              {product.category}
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div>
              <dt className="text-slate-500 font-medium">Price</dt>
              <dd className="font-semibold text-slate-900">${Number(product.price).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Rating</dt>
              <dd className="font-semibold text-slate-900">{Number(product.rating || 0).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Stock</dt>
              <dd className="font-semibold text-slate-900">{product.stock}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex justify-end">
        <ProductActions productId={product.id} onDelete={onDelete} />
      </div>
    </article>
  );
}
