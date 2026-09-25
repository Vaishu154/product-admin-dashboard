/**
 * Product API Service
 *
 * Encapsulates all REST requests to DummyJSON product endpoints.
 */

import api from "./axios";
import { parseSort } from "@/utils/urlParams";
import { normalizeCategories, normalizeProduct, normalizeProductList } from "@/utils/productHelpers";

/**
 * Prepares standard query parameters (sortBy, order, delay) for API requests.
 */
function withCommonParams(params, { sort, delay } = {}) {
  const next = { ...params };
  const parsedSort = parseSort(sort);
  if (parsedSort) {
    next.sortBy = parsedSort.sortBy;
    next.order = parsedSort.order;
  }
  if (delay) {
    next.delay = delay;
  }
  return next;
}

/** Fetch paginated products list */
export async function getProducts({ limit, skip, sort, delay, signal } = {}) {
  const { data } = await api.get("/products", {
    params: withCommonParams({ limit, skip }, { sort, delay }),
    signal,
  });
  return normalizeProductList(data);
}

/** Search products by query string q */
export async function searchProducts({ q, limit, skip, sort, delay, signal } = {}) {
  const { data } = await api.get("/products/search", {
    params: withCommonParams({ q, limit, skip }, { sort, delay }),
    signal,
  });
  return normalizeProductList(data);
}

/** Fetch all product categories */
export async function getCategories({ signal } = {}) {
  const { data } = await api.get("/products/categories", { signal });
  return normalizeCategories(data);
}

/** Fetch products filtered by category slug */
export async function getProductsByCategory({
  category,
  limit,
  skip,
  sort,
  delay,
  signal,
} = {}) {
  const { data } = await api.get(`/products/category/${encodeURIComponent(category)}`, {
    params: withCommonParams({ limit, skip }, { sort, delay }),
    signal,
  });
  return normalizeProductList(data);
}

/** Fetch single product by ID */
export async function getProductById(id, { signal } = {}) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return normalizeProduct(data);
}

/** Simulate creating a new product */
export async function addProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return normalizeProduct(data);
}

/** Simulate updating an existing product */
export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return normalizeProduct(data);
}

/** Simulate deleting a product by ID */
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
