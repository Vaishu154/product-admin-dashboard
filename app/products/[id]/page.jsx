"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@/components/common/Icons";
import { deleteProduct, getProductById } from "@/services/productApi";
import { useProductSession } from "@/context/ProductSessionContext";
import { useToast } from "@/context/ToastContext";
import { normalizeProduct } from "@/utils/productHelpers";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params?.id;
  const { overlay, getSessionProduct, deleteSessionProduct } = useProductSession();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadProduct() {
    const session = getSessionProduct(id);
    if (session.deleted) {
      setNotFound(true);
      setProduct(null);
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

    if (session.isAdded && session.product) {
      setProduct(normalizeProduct(session.product));
      setIsLoading(false);
      return;
    }

    try {
      const data = await getProductById(id);
      if (!data) {
        if (session.product) {
          setProduct(normalizeProduct(session.product));
        } else {
          setNotFound(true);
        }
      } else {
        setProduct(session.product ? { ...data, ...session.product } : data);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        if (session.product) {
          setProduct(normalizeProduct(session.product));
        } else {
          setNotFound(true);
        }
      } else {
        setError(err.appMessage || "Unable to load this product.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, overlay]);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    setDeleteError("");
    try {
      const session = getSessionProduct(id);
      if (!session.isAdded) {
        await deleteProduct(id);
      }
      deleteSessionProduct(Number.isFinite(Number(id)) ? Number(id) : id, product);
      toast.success("Product deleted successfully.");
      router.push("/products");
    } catch (err) {
      const msg = err.appMessage || "Unable to delete this product.";
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <ErrorState title="Product not found." message="This product ID does not exist." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <ErrorState title="Unable to load product." message={error} onRetry={loadProduct} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${id}/edit`}
            className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Edit product"
            title="Edit product"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center justify-center rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100 cursor-pointer active:scale-95 shadow-2xs"
            aria-label="Delete product"
            title="Delete product"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <ProductDetails product={product} />
      </div>

      {deleteError ? <p className="text-sm text-red-600">{deleteError}</p> : null}

      <ConfirmDialog
        open={showDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        isConfirming={isDeleting}
        onCancel={() => !isDeleting && setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
