"use client";

import ProductActions from "./ProductActions";
import ProductImage from "@/components/common/ProductImage";
import { getProductImage } from "@/utils/productHelpers";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
      <table className="min-w-full table-fixed divide-y divide-slate-200">
        <caption className="sr-only">Product list</caption>
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="w-20 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Image
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Title
            </th>
            <th scope="col" className="w-36 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Category
            </th>
            <th scope="col" className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Price
            </th>
            <th scope="col" className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Rating
            </th>
            <th scope="col" className="w-20 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Stock
            </th>
            <th scope="col" className="w-44 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <ProductImage
                  src={getProductImage(product)}
                  alt={product.title}
                  className="h-12 w-12 rounded-md"
                />
              </td>
              <td className="px-4 py-3">
                <p className="truncate font-medium text-slate-900" title={product.title}>
                  {product.title}
                </p>
              </td>
              <td className="px-4 py-3 capitalize text-slate-600">{product.category}</td>
              <td className="px-4 py-3 text-slate-700">${product.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-slate-700">{product.rating.toFixed(2)}</td>
              <td className="px-4 py-3 text-slate-700">{product.stock}</td>
              <td className="px-4 py-3">
                <ProductActions productId={product.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
