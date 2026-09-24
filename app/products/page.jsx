import { Suspense } from "react";
import ProductsDashboard from "@/components/products/ProductsDashboard";
import LoadingState from "@/components/common/LoadingState";

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading products..." />}>
      <ProductsDashboard />
    </Suspense>
  );
}
