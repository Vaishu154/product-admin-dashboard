export function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const id = product.id;
  if (id === undefined || id === null) {
    return null;
  }

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  return {
    id,
    title: product.title || "Untitled product",
    description: product.description || "",
    category: product.category || "uncategorized",
    price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    rating: Number.isFinite(Number(product.rating)) ? Number(product.rating) : 0,
    stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0,
    thumbnail: product.thumbnail || images[0] || "",
    images,
    brand: product.brand || "",
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
  };
}

export function normalizeProductList(data) {
  const products = Array.isArray(data?.products)
    ? data.products.map(normalizeProduct).filter(Boolean)
    : [];

  return {
    products,
    total: Number.isFinite(Number(data?.total)) ? Number(data.total) : products.length,
    skip: Number.isFinite(Number(data?.skip)) ? Number(data.skip) : 0,
    limit: Number.isFinite(Number(data?.limit)) ? Number(data.limit) : products.length,
  };
}

export function normalizeCategories(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (typeof item === "string") {
        return { slug: item, name: item };
      }
      if (item && typeof item === "object") {
        const slug = item.slug || item.name || "";
        const name = item.name || item.slug || "";
        if (!slug) {
          return null;
        }
        return { slug, name };
      }
      return null;
    })
    .filter(Boolean);
}

export function applySessionOverlay(apiProducts, apiTotal, overlay, query) {
  const deletedIds = new Set((overlay.deletedIds || []).map(String));
  const deletedProducts = overlay.deletedProducts || [];
  const updates = overlay.updates || {};
  const added = overlay.added || [];
  const search = (query.search || "").trim().toLowerCase();
  const category = query.category || "";
  const pageSize = Number(query.pageSize) || 10;

  const matchesQuery = (product) => {
    if (!product) return false;
    if (search) {
      const haystack = `${product.title || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
      return haystack.includes(search);
    }
    if (category) {
      return product.category === category;
    }
    return true;
  };

  const withUpdates = (product) => {
    const patch = updates[product.id] || updates[String(product.id)];
    return patch ? { ...product, ...patch } : product;
  };

  let products = apiProducts
    .map(withUpdates)
    .filter((product) => !deletedIds.has(String(product.id)));

  const matchingAdded = added
    .filter((product) => !deletedIds.has(String(product.id)) && matchesQuery(product))
    .map(withUpdates);

  if (query.page === 1) {
    const remainingSlots = Math.max(0, pageSize - matchingAdded.length);
    products = [...matchingAdded, ...products.slice(0, remainingSlots)];
  }

  let deletedDeduction = 0;
  if (deletedProducts.length > 0) {
    deletedDeduction = deletedProducts.filter(matchesQuery).length;
  }

  const adjustedTotal = Math.max(
    0,
    apiTotal - deletedDeduction + matchingAdded.length
  );

  return {
    products,
    total: adjustedTotal,
  };
}

export function getProductImage(product) {
  return product?.thumbnail || product?.images?.[0] || "";
}
