"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { normalizeProduct } from "@/utils/productHelpers";

const ProductSessionContext = createContext(null);

export function ProductSessionProvider({ children }) {
  const [added, setAdded] = useState([]);
  const [updates, setUpdates] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);

  const isSessionAdded = useCallback(
    (id) => added.some((item) => String(item.id) === String(id)),
    [added]
  );

  const addSessionProduct = useCallback((product) => {
    const normalized = normalizeProduct(product);
    if (!normalized) {
      return null;
    }

    let addedItem = null;
    setAdded((current) => {
      const existingIds = new Set(current.map((item) => Number(item.id)));
      let nextId = Number(normalized.id);

      if (!Number.isFinite(nextId) || existingIds.has(nextId)) {
        const maxId = current.reduce((max, item) => {
          const num = Number(item.id);
          return Number.isFinite(num) ? Math.max(max, num) : max;
        }, Number.isFinite(nextId) ? nextId : 194);
        nextId = maxId + 1;
      }

      addedItem = {
        ...normalized,
        id: nextId,
      };

      return [...current, addedItem];
    });

    return addedItem;
  }, []);

  const updateSessionProduct = useCallback((product) => {
    const normalized = normalizeProduct(product);
    if (!normalized) {
      return;
    }

    setAdded((current) =>
      current.map((item) => (String(item.id) === String(normalized.id) ? { ...item, ...normalized } : item))
    );
    setUpdates((current) => ({
      ...current,
      [normalized.id]: { ...(current[normalized.id] || {}), ...normalized },
    }));
  }, []);

  const deleteSessionProduct = useCallback((id, productData = null) => {
    const numericId = Number(id);
    const targetId = Number.isFinite(numericId) ? numericId : id;
    const isAdded = added.some((item) => String(item.id) === String(id));

    setDeletedIds((current) => (current.includes(targetId) ? current : [...current, targetId]));

    if (isAdded) {
      setAdded((current) => current.filter((item) => String(item.id) !== String(id)));
    } else {
      const productInfo = productData || updates[id] || (Number.isFinite(numericId) ? updates[numericId] : null);
      if (productInfo) {
        setDeletedProducts((current) => {
          if (current.some((item) => String(item.id) === String(id))) {
            return current;
          }
          return [...current, productInfo];
        });
      }
    }
  }, [added, updates]);

  const getSessionProduct = useCallback(
    (id) => {
      const numericId = Number(id);
      const isDeleted =
        deletedIds.includes(numericId) ||
        deletedIds.includes(id) ||
        deletedIds.map(String).includes(String(id));

      if (isDeleted) {
        return { deleted: true, isAdded: false, product: null };
      }

      const addedProduct = added.find((item) => String(item.id) === String(id));
      const patch = updates[id] || (Number.isFinite(numericId) ? updates[numericId] : null);

      if (addedProduct) {
        return {
          deleted: false,
          isAdded: true,
          product: patch ? { ...addedProduct, ...patch } : addedProduct,
        };
      }

      if (patch) {
        return {
          deleted: false,
          isAdded: false,
          product: patch,
        };
      }

      return { deleted: false, isAdded: false, product: null };
    },
    [added, updates, deletedIds]
  );

  const hasSessionChanges =
    added.length > 0 || deletedIds.length > 0 || Object.keys(updates).length > 0;

  const overlay = useMemo(
    () => ({ added, updates, deletedIds, deletedProducts }),
    [added, updates, deletedIds, deletedProducts]
  );

  const value = useMemo(
    () => ({
      overlay,
      hasSessionChanges,
      addSessionProduct,
      updateSessionProduct,
      deleteSessionProduct,
      getSessionProduct,
      isSessionAdded,
    }),
    [
      overlay,
      hasSessionChanges,
      addSessionProduct,
      updateSessionProduct,
      deleteSessionProduct,
      getSessionProduct,
      isSessionAdded,
    ]
  );

  return (
    <ProductSessionContext.Provider value={value}>
      {children}
    </ProductSessionContext.Provider>
  );
}

export function useProductSession() {
  const context = useContext(ProductSessionContext);
  if (!context) {
    throw new Error("useProductSession must be used inside ProductSessionProvider.");
  }
  return context;
}
