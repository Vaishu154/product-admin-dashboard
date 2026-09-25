"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/products/ProductForm";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { ArrowLeftIcon } from "@/components/common/Icons";
import { getCategories, addProduct, getProductsByCategory } from "@/services/productApi";
import { useProductSession } from "@/context/ProductSessionContext";
import { useToast } from "@/context/ToastContext";

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const { overlay, addSessionProduct } = useProductSession();
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

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

    const targetTitle = values.title.trim().toLowerCase();
    const targetCategory = values.category.trim().toLowerCase();

    // 1. Check duplicate within session-added products
    const duplicateInSession = overlay.added?.some(
      (item) =>
        item.title?.trim().toLowerCase() === targetTitle &&
        item.category?.trim().toLowerCase() === targetCategory
    );

    if (duplicateInSession) {
      const msg = "Product with this title already exists in this category.";
      toast.error(msg);
      setServerError(msg);
      setIsSubmitting(false);
      return;
    }

    // 2. Check duplicate within existing DummyJSON products for this category
    try {
      const categoryData = await getProductsByCategory({
        category: values.category.trim(),
        limit: 100,
      });

      const duplicateInApi = categoryData.products?.some((item) => {
        const isDeleted = overlay.deletedIds?.some((dId) => String(dId) === String(item.id));
        if (isDeleted) {
          return false;
        }
        return item.title?.trim().toLowerCase() === targetTitle;
      });

      if (duplicateInApi) {
        const msg = "Product with this title already exists in this category.";
        toast.error(msg);
        setServerError(msg);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      // If category fetch fails, proceed with server-side creation
    }

    try {
      const created = await addProduct(values);
      addSessionProduct(created);
      toast.success("Product created successfully.");
      router.push("/products");
    } catch (error) {
      const msg = error.appMessage || "Unable to create product.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Product</h1>
      </div>

      {isLoadingCategories ? (
        <LoadingState message="Loading categories..." />
      ) : categoriesError ? (
        <ErrorState
          title="Unable to load categories."
          message={categoriesError}
          onRetry={loadCategories}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <ProductForm
            categories={categories}
            submitLabel="Create Product"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverError={serverError}
          />
        </div>
      )}
    </div>
  );
}
