"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/products/ProductForm";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { getCategories, addProduct } from "@/services/productApi";
import { useProductSession } from "@/context/ProductSessionContext";

export default function NewProductPage() {
  const router = useRouter();
  const { addSessionProduct } = useProductSession();
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadCategories() {
    setIsLoadingCategories(true);
    setCategoriesError("");
    try {
      setCategories(await getCategories());
    } catch (error) {
      setCategoriesError(error.appMessage || "Unable to load categories.");
    } finally {
      setIsLoadingCategories(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(values) {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setServerError("");
    try {
      const created = await addProduct(values);
      addSessionProduct(created);
      setSuccessMessage("Product created for this session.");
      router.push("/products");
    } catch (error) {
      setServerError(error.appMessage || "Unable to create product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/products" className="text-sm text-indigo-700 hover:underline">
          Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Add product</h1>
        <p className="mt-1 text-sm text-slate-600">
          DummyJSON will simulate creation. The new product is kept in this session only.
        </p>
      </div>

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {successMessage}
        </p>
      ) : null}

      {isLoadingCategories ? (
        <LoadingState message="Loading categories..." />
      ) : categoriesError ? (
        <ErrorState
          title="Unable to load categories."
          message={categoriesError}
          onRetry={loadCategories}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <ProductForm
            categories={categories}
            submitLabel="Save product"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverError={serverError}
          />
        </div>
      )}
    </div>
  );
}
