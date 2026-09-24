import api from "./axios";
import { parseSort } from "@/utils/urlParams";
import { normalizeCategories, normalizeProduct, normalizeProductList } from "@/utils/productHelpers";

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

export async function getProducts({ limit, skip, sort, delay, signal } = {}) {
  const { data } = await api.get("/products", {
    params: withCommonParams({ limit, skip }, { sort, delay }),
    signal,
  });
  return normalizeProductList(data);
}

export async function searchProducts({ q, limit, skip, sort, delay, signal } = {}) {
  const { data } = await api.get("/products/search", {
    params: withCommonParams({ q, limit, skip }, { sort, delay }),
    signal,
  });
  return normalizeProductList(data);
}

export async function getCategories({ signal } = {}) {
  const { data } = await api.get("/products/categories", { signal });
  return normalizeCategories(data);
}

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

export async function getProductById(id, { signal } = {}) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return normalizeProduct(data);
}

export async function addProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return normalizeProduct(data);
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
