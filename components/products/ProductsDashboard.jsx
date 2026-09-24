"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/common/SearchBar";
import CategoryFilter from "@/components/common/CategoryFilter";
import SortControl from "@/components/common/SortControl";
import PageSizeSelector from "@/components/common/PageSizeSelector";
import Pagination from "@/components/common/Pagination";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ProductList from "@/components/products/ProductList";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductSession } from "@/context/ProductSessionContext";
import {
  deleteProduct,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/productApi";
import { applySessionOverlay } from "@/utils/productHelpers";
import { getSkip, getTotalPages, getVisibleRange } from "@/utils/pagination";
import { buildProductQuery, parseProductQuery } from "@/utils/urlParams";
import { isCanceledError } from "@/utils/errors";

export default function ProductsDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseProductQuery(searchParams);
  const {
    overlay,
    hasSessionChanges,
    deleteSessionProduct,
    isSessionAdded,
    getSessionProduct,
  } = useProductSession();

  const [searchInput, setSearchInput] = useState(query.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const validCategory =
    query.category && categories.some((item) => item.slug === query.category)
      ? query.category
      : "";

  const updateUrl = useCallback(
  (next) => {
    const queryString = buildProductQuery({
      page: next.page ?? query.page,
      pageSize: next.pageSize ?? query.pageSize,
      search: next.search ?? query.search,
      category: next.category ?? query.category,
      sort: next.sort ?? query.sort,
      delay: query.delay,
    });

    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  },
  [
    pathname,
    router,
    query.page,
    query.pageSize,
    query.search,
    query.category,
    query.sort,
    query.delay,
  ]
);

  useEffect(() => {
    setSearchInput(query.search);
  }, [query.search]);

  useEffect(() => {
    if (debouncedSearch === query.search) {
      return;
    }
    updateUrl({ search: debouncedSearch, page: 1, category: debouncedSearch ? "" : query.category });
  }, [debouncedSearch, query.search, query.category, updateUrl]);

  useEffect(() => {
    if (!categories.length || !query.category) {
      return;
    }
    if (!categories.some((item) => item.slug === query.category) && !query.search) {
      updateUrl({ category: "", page: 1 });
    }
  }, [categories, query.category, query.search, updateUrl]);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError("");
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length === 0) {
        setCategoriesError("No categories were returned.");
      }
    } catch (err) {
      setCategories([]);
      setCategoriesError(err.appMessage || "Unable to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadProducts = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError("");

    const skip = getSkip(query.page, query.pageSize);
    const requestOptions = {
      limit: query.pageSize,
      skip,
      sort: query.sort,
      delay: query.delay,
      signal: controller.signal,
    };

    try {
      let response;
      if (query.search) {
        response = await searchProducts({ q: query.search, ...requestOptions });
      } else if (validCategory) {
        response = await getProductsByCategory({
          category: validCategory,
          ...requestOptions,
        });
      } else {
        response = await getProducts(requestOptions);
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      const merged = applySessionOverlay(response.products, response.total, overlay, {
        page: query.page,
        search: query.search,
        category: validCategory,
      });

      const totalPages = getTotalPages(merged.total, query.pageSize);
      if (merged.total > 0 && query.page > totalPages) {
        updateUrl({ page: totalPages });
        return;
      }

      setProducts(merged.products);
      setTotal(merged.total);
    } catch (err) {
      if (isCanceledError(err) || requestId !== requestIdRef.current) {
        return;
      }
      setProducts([]);
      setTotal(0);
      setError(err.appMessage || "Unable to load products.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [overlay, query.delay, query.page, query.pageSize, query.search, query.sort, updateUrl, validCategory]);

  useEffect(() => {
    if (query.category && categoriesLoading) {
      return undefined;
    }
    loadProducts();
    return () => abortControllerRef.current?.abort();
  }, [categoriesLoading, loadProducts, query.category]);

  async function handleConfirmDelete() {
    if (!deleteTarget || isDeleting) {
      return;
    }
    setIsDeleting(true);
    setDeleteError("");
    try {
      const isAdded = isSessionAdded(deleteTarget);
      if (!isAdded) {
        await deleteProduct(deleteTarget);
      }
      const targetProduct =
        products.find((p) => String(p.id) === String(deleteTarget)) ||
        getSessionProduct(deleteTarget)?.product;
      deleteSessionProduct(deleteTarget, targetProduct);
      setSuccessMessage("Product deleted for this session. DummyJSON does not persist deletions.");
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.appMessage || "Unable to delete this product.");
    } finally {
      setIsDeleting(false);
    }
  }

  const range = getVisibleRange(query.page, query.pageSize, total);
  const totalPages = getTotalPages(total, query.pageSize);
  const emptyMessage = query.search
    ? `No products match “${query.search}”.`
    : validCategory
      ? "No products found in this category."
      : "No products found.";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, sort, and manage DummyJSON products.
          </p>
        </div>
        <Link
          href="/products/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add product
        </Link>
      </div>

      {hasSessionChanges ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Add, edit, and delete changes are kept only for this browser session. Refreshing the page restores original DummyJSON data.
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {successMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <CategoryFilter
          categories={categories}
          value={validCategory}
          onChange={(category) => updateUrl({ category, page: 1 })}
          disabled={Boolean(searchInput || query.search)}
          loading={categoriesLoading}
          error={categoriesError}
          onRetry={loadCategories}
        />
        <SortControl
          value={query.sort}
          onChange={(sort) => updateUrl({ sort, page: 1 })}
        />
        <PageSizeSelector
          value={query.pageSize}
          onChange={(pageSize) => updateUrl({ pageSize, page: 1 })}
        />
      </div>

      {error ? (
        <ErrorState
          title="Unable to load products."
          message={error}
          onRetry={loadProducts}
          isRetrying={isLoading}
        />
      ) : isLoading ? (
        <LoadingState message="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products found." message={emptyMessage} />
      ) : (
        <ProductList products={products} onDelete={setDeleteTarget} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {total === 0
            ? "Showing 0 of 0"
            : `Showing ${range.start}–${range.end} of ${total}`}
        </p>
        <Pagination
          page={query.page}
          totalPages={totalPages}
          onPageChange={(page) => updateUrl({ page })}
          disabled={isLoading || total === 0}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        message="Are you sure you want to delete this product?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleConfirmDelete}
      />
      {deleteError ? (
        <p className="text-sm text-red-600" role="alert">
          {deleteError}
        </p>
      ) : null}
    </div>
  );
}
