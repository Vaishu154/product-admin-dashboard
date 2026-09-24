"use client";

import { useState } from "react";
import ProductImage from "@/components/common/ProductImage";

export default function ProductDetails({ product }) {
  const images = product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ProductImage
            src={activeImage}
            alt={product.title}
            className="h-80 w-full rounded-lg"
          />
          {images.length > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-md border ${
                    activeImage === image ? "border-indigo-600" : "border-slate-200"
                  }`}
                  aria-label="Show product image"
                >
                  <ProductImage src={image} alt="" className="h-16 w-16" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-sm capitalize text-indigo-700">{product.category}</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{product.title}</h1>
          {product.brand ? <p className="mt-1 text-slate-500">{product.brand}</p> : null}
          <p className="mt-4 text-slate-700">{product.description || "No description available."}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs uppercase text-slate-500">Price</dt>
              <dd className="text-lg font-semibold">${product.price.toFixed(2)}</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs uppercase text-slate-500">Rating</dt>
              <dd className="text-lg font-semibold">{product.rating.toFixed(2)}</dd>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <dt className="text-xs uppercase text-slate-500">Stock</dt>
              <dd className="text-lg font-semibold">{product.stock}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-slate-600">No reviews yet for this product.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((review, index) => (
              <li key={`${review.reviewerEmail || review.reviewerName || "review"}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{review.reviewerName || "Anonymous"}</p>
                  <p className="text-sm text-slate-500">
                    Rating: {Number.isFinite(Number(review.rating)) ? review.rating : "N/A"}
                  </p>
                </div>
                <p className="mt-2 text-slate-700">{review.comment || "No comment provided."}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
