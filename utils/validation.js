/**
 * Form Validation Utility
 *
 * Validates login credentials and product creation/editing form fields.
 */

/** Validates Product creation/edit form values */
export function validateProductForm(values) {
  const errors = {};
  const title = (values.title || "").trim();
  const description = (values.description || "").trim();
  const category = (values.category || "").trim();
  const price = values.price;
  const stock = values.stock;

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < 2) {
    errors.title = "Title must be at least 2 characters.";
  } else if (title.length > 120) {
    errors.title = "Title must be 120 characters or fewer.";
  }

  // Description is optional; validate max length if provided
  if (description && description.length > 1000) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  if (!category) {
    errors.category = "Category is required.";
  }

  if (price === "" || price === null || price === undefined) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(price))) {
    errors.price = "Price must be a valid number.";
  } else if (Number(price) < 0) {
    errors.price = "Price cannot be negative.";
  } else if (Number(price) > 1000000) {
    errors.price = "Price is too large.";
  }

  if (stock === "" || stock === null || stock === undefined) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(Number(stock)) && String(stock).includes(".")) {
    errors.stock = "Stock must be a whole number.";
  } else if (Number.isNaN(Number(stock))) {
    errors.stock = "Stock must be a valid number.";
  } else if (Number(stock) < 0) {
    errors.stock = "Stock cannot be negative.";
  } else if (!Number.isInteger(Number(stock))) {
    errors.stock = "Stock must be a whole number.";
  }

  return errors;
}

/** Validates Login credentials and checks for unwanted whitespace */
export function validateLoginForm(values) {
  const errors = {};
  const rawUsername = values.username || "";
  const rawPassword = values.password || "";

  if (!rawUsername.trim()) {
    errors.username = "Username is required.";
  } else if (/\s/.test(rawUsername)) {
    errors.username = "Username cannot contain spaces.";
  }

  if (!rawPassword.trim()) {
    errors.password = "Password is required.";
  } else if (/\s/.test(rawPassword)) {
    errors.password = "Password cannot contain spaces.";
  }

  return errors;
}
