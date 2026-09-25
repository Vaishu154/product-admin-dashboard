"use client";

import ProductActions from "./ProductActions";
import ProductImage from "@/components/common/ProductImage";
import { ChevronUpIcon, ChevronDownIcon } from "@/components/common/Icons";
import { getProductImage } from "@/utils/productHelpers";

export default function ProductTable({ products, onDelete, sort = "", onSort }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs md:block">
      <table className="min-w-full table-fixed divide-y divide-slate-100">
        <caption className="sr-only">Product list</caption>
        <thead className="bg-slate-50/75">
          <tr>
            <th
              scope="col"
              className="w-20 px-5 py-3.5 text-left text-xs font-semibold text-slate-700"
            >
              Image
            </th>
            <SortableColumnHeader
              label="Title"
              field="title"
              currentSort={sort}
              onSort={onSort}
            />
            <th
              scope="col"
              className="w-36 px-5 py-3.5 text-left text-xs font-semibold text-slate-700"
            >
              Category
            </th>
            <SortableColumnHeader
              label="Price"
              field="price"
              currentSort={sort}
              onSort={onSort}
              className="w-28"
            />
            <SortableColumnHeader
              label="Rating"
              field="rating"
              currentSort={sort}
              onSort={onSort}
              className="w-28"
            />
            <th
              scope="col"
              className="w-20 px-5 py-3.5 text-left text-xs font-semibold text-slate-700"
            >
              Stock
            </th>
            <th
              scope="col"
              className="w-36 px-5 py-3.5 text-left text-xs font-semibold text-slate-700"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-5 py-3.5">
                <ProductImage
                  src={getProductImage(product)}
                  alt={product.title}
                  className="h-12 w-12 rounded-lg object-contain bg-slate-50 border border-slate-100 p-1"
                />
              </td>
              <td className="px-5 py-3.5">
                <p className="line-clamp-2 text-sm font-medium text-slate-800" title={product.title}>
                  {product.title}
                </p>
              </td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-0.5 text-xs font-medium text-purple-700 capitalize">
                  {product.category}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                ${Number(product.price).toFixed(2)}
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600">
                {Number(product.rating || 0).toFixed(2)}
              </td>
              <td className="px-5 py-3.5 text-sm text-slate-600">
                {product.stock}
              </td>
              <td className="px-5 py-3.5">
                <ProductActions productId={product.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortableColumnHeader({ label, field, currentSort, onSort, className = "" }) {
  const isAsc = currentSort === `${field}-asc`;
  const isDesc = currentSort === `${field}-desc`;

  const handleToggle = () => {
    if (!onSort) return;
    if (isAsc) {
      onSort(`${field}-desc`);
    } else if (isDesc) {
      onSort("");
    } else {
      onSort(`${field}-asc`);
    }
  };

  const handleAscClick = (e) => {
    e.stopPropagation();
    if (!onSort) return;
    onSort(isAsc ? "" : `${field}-asc`);
  };

  const handleDescClick = (e) => {
    e.stopPropagation();
    if (!onSort) return;
    onSort(isDesc ? "" : `${field}-desc`);
  };

  return (
    <th scope="col" className={`px-5 py-3.5 text-left text-xs font-semibold ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className="group inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 hover:text-blue-600 transition"
        title={`Sort by ${label}`}
      >
        <span>{label}</span>
        <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100/90 px-1 py-0.5 transition group-hover:bg-slate-200/80">
          <button
            type="button"
            onClick={handleAscClick}
            className={`p-0.5 rounded transition cursor-pointer ${
              isAsc
                ? "bg-blue-600 text-white font-bold shadow-2xs"
                : "text-slate-500 hover:text-blue-600"
            }`}
            aria-label={`Sort ${label} ascending`}
            title={`Sort ${label} ascending`}
          >
            <ChevronUpIcon className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleDescClick}
            className={`p-0.5 rounded transition cursor-pointer ${
              isDesc
                ? "bg-blue-600 text-white font-bold shadow-2xs"
                : "text-slate-500 hover:text-blue-600"
            }`}
            aria-label={`Sort ${label} descending`}
            title={`Sort ${label} descending`}
          >
            <ChevronDownIcon className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </span>
      </div>
    </th>
  );
}
