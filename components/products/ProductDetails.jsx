"use client";

import { useState } from "react";
import ProductImage from "@/components/common/ProductImage";

export default function ProductDetails({ product }) {
  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
    ? [product.thumbnail]
    : [];
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ProductImage
            src={activeImage}
            alt={product.title}
            className="h-80 w-full rounded-2xl object-contain bg-slate-50 border border-slate-100 p-2"
          />
          {images.length > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-xl border transition p-1 bg-slate-50 ${
                    activeImage === image
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  aria-label="Show product image"
                >
                  <ProductImage src={image} alt="" className="h-14 w-14 rounded-lg object-contain" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 capitalize">
              {product.category}
            </span>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {product.title}
            </h1>
            {product.brand ? (
              <p className="mt-1 text-sm font-medium text-slate-500">Brand: {product.brand}</p>
            ) : null}
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price</dt>
              <dd className="mt-1 text-xl font-bold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</dt>
              <dd className="mt-1 text-xl font-bold text-slate-900">
                {Number(product.rating || 0).toFixed(2)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</dt>
              <dd className="mt-1 text-xl font-bold text-slate-900">{product.stock}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No reviews yet for this product.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {reviews.map((review, index) => (
              <li
                key={`${review.reviewerEmail || review.reviewerName || "review"}-${index}`}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {review.reviewerName || "Anonymous"}
                  </p>
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    ★ {Number.isFinite(Number(review.rating)) ? review.rating : "N/A"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {review.comment || "No comment provided."}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
