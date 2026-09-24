"use client";

import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";

export default function ProductList({ products, onDelete }) {
  return (
    <>
      <ProductTable products={products} onDelete={onDelete} />
      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}
