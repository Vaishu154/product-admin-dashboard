"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { ArrowLeftIcon } from "@/components/common/Icons";
import { useToast } from "@/context/ToastContext";
import { getCategories, getProductById, updateProduct } from "@/services/productApi";
import { useProductSession } from "@/context/ProductSessionContext";
import { normalizeProduct } from "@/utils/productHelpers";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id;
  const { getSessionProduct, updateSessionProduct } = useProductSession();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function loadData() {
    const session = getSessionProduct(id);
    if (session.deleted) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setNotFound(false);

    if (!id || Number.isNaN(Number(id))) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    try {
      if (session.isAdded && session.product) {
        const categoryData = await getCategories().catch(() => []);
        setProduct(normalizeProduct(session.product));
        setCategories(categoryData);
        setIsLoading(false);
        return;
      }

      const [productData, categoryData] = await Promise.all([
        getProductById(id).catch((err) => {
          if (err.response?.status === 404 && session.product) {
            return normalizeProduct(session.product);
          }
          throw err;
        }),
        getCategories().catch(() => []),
      ]);

      if (!productData) {
        setNotFound(true);
      } else {
        setProduct(session.product ? { ...productData, ...session.product } : productData);
        setCategories(categoryData);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err.appMessage || "Unable to load this product.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(values) {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setServerError("");
    try {
      const session = getSessionProduct(id);
      if (session.isAdded) {
        const updated = normalizeProduct({ ...product, ...values, id: product.id });
        updateSessionProduct(updated);
        toast.success("Product updated successfully.");
        router.push(`/products/${id}`);
        return;
      }

      const updated = await updateProduct(id, values);
      updateSessionProduct({ ...product, ...updated, ...values, id: product.id });
      toast.success("Product updated successfully.");
      router.push(`/products/${id}`);
    } catch (err) {
      const msg = err.appMessage || "Unable to update product.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <ErrorState title="Product not found." message="This product cannot be edited because it does not exist." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <ErrorState title="Unable to load product." message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/products/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to product</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <ProductForm
          initialValues={{
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
          }}
          categories={categories}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
        />
      </div>
    </div>
  );
}
