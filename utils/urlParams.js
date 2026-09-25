/**
 * URL Query Parameter Serializer & Parser
 *
 * Synchronizes pagination (page, pageSize), search query, category filter,
 * and sort order with the browser's URL address bar.
 */

import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "./pagination";

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", order: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", order: "desc" },
  { value: "rating-asc", label: "Rating: Low to High", sortBy: "rating", order: "asc" },
  { value: "rating-desc", label: "Rating: High to Low", sortBy: "rating", order: "desc" },
  { value: "title-asc", label: "Title: A-Z", sortBy: "title", order: "asc" },
  { value: "title-desc", label: "Title: Z-A", sortBy: "title", order: "desc" },
];

const SORT_VALUES = new Set(SORT_OPTIONS.map((option) => option.value));

function toPositiveInt(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

/** Parses string sort parameter into sortBy and order */
export function parseSort(value) {
  if (!value || !SORT_VALUES.has(value)) {
    return null;
  }
  return SORT_OPTIONS.find((option) => option.value === value) || null;
}

/** Parses current URL search params into clean query object */
export function parseProductQuery(searchParams) {
  const page = toPositiveInt(searchParams.get("page")) || 1;
  const pageSizeRaw = toPositiveInt(searchParams.get("pageSize"));
  const pageSize = PAGE_SIZES.includes(pageSizeRaw)
    ? pageSizeRaw
    : DEFAULT_PAGE_SIZE;

  const search = (searchParams.get("search") || "").trim();
  const categoryRaw = (searchParams.get("category") || "").trim();
  const sortRaw = searchParams.get("sort") || "";
  const sort = SORT_VALUES.has(sortRaw) ? sortRaw : "";

  const delayRaw = Number(searchParams.get("delay"));
  const delay =
    Number.isFinite(delayRaw) && delayRaw > 0 && delayRaw <= 5000
      ? delayRaw
      : 0;

  return {
    page,
    pageSize,
    search,
    category: categoryRaw,
    sort,
    delay,
  };
}

/** Serializes query object back into standard URL query string */
export function buildProductQuery({
  page,
  pageSize,
  search,
  category,
  sort,
  delay,
}) {
  const params = new URLSearchParams();

  if (page && page !== 1) {
    params.set("page", String(page));
  }

  if (pageSize && pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(pageSize));
  }

  if (search) {
    params.set("search", search);
  }

  if (category && !search) {
    params.set("category", category);
  }

  if (sort && SORT_VALUES.has(sort)) {
    params.set("sort", sort);
  }

  if (delay) {
    params.set("delay", String(delay));
  }

  return params.toString();
}
