/**
 * Pagination Calculation Utility
 *
 * Provides page size constants, offset math, total page calculations,
 * and range formatting helpers.
 */

export const PAGE_SIZES = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;

/** Computes the skip offset for DummyJSON pagination API */
export function getSkip(page, pageSize) {
  return Math.max(0, (page - 1) * pageSize);
}

/** Computes total pages count based on total items and pageSize */
export function getTotalPages(total, pageSize) {
  if (!pageSize || total <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Calculates current visible item range (e.g. { start: 1, end: 10 }) */
export function getVisibleRange(page, pageSize, total) {
  if (total <= 0) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return { start, end };
}

/** Clamps page number within valid bounds [1, totalPages] */
export function clampPage(page, total, pageSize) {
  const totalPages = getTotalPages(total, pageSize);
  if (page > totalPages) {
    return totalPages;
  }
  return page;
}
