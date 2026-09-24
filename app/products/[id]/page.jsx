"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { deleteProduct, getProductById } from "@/services/productApi";
import { useProductSession } from "@/context/ProductSessionContext";
import { normalizeProduct } from "@/utils/productHelpers";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { getSessionProduct, deleteSessionProduct } = useProductSession();
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
  }, [id]);

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
      router.push("/products");
    } catch (err) {
      setDeleteError(err.appMessage || "Unable to delete this product.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading product..." />;
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <Link href="/products" className="text-sm text-indigo-700 hover:underline">
          Back to products
        </Link>
        <ErrorState title="Product not found." message="This product ID does not exist." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/products" className="text-sm text-indigo-700 hover:underline">
          Back to products
        </Link>
        <ErrorState title="Unable to load product." message={error} onRetry={loadProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/products" className="text-sm text-indigo-700 hover:underline">
          Back to products
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/products/${id}/edit`}
            className="rounded-md border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <ProductDetails product={product} />
      {deleteError ? <p className="text-sm text-red-600">{deleteError}</p> : null}

      <ConfirmDialog
        open={showDelete}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        isConfirming={isDeleting}
        onCancel={() => !isDeleting && setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
