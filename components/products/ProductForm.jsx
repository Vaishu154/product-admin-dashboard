"use client";

import { useEffect, useState } from "react";
import { validateProductForm } from "@/utils/validation";

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

export default function ProductForm({
  initialValues,
  categories = [],
  submitLabel = "Save Product",
  onSubmit,
  isSubmitting = false,
  serverError = "",
}) {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues((current) => ({ ...current, ...initialValues }));
    }
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700" role="alert">
          {serverError}
        </div>
      ) : null}

      <Field id="title" label="Title" required error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={getInputClass(Boolean(errors.title))}
        />
      </Field>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          placeholder="Provide a detailed description of the product..."
          className={getInputClass(Boolean(errors.description))}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="price" label="Price ($)" required error={errors.price}>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            placeholder="0.00"
            className={getInputClass(Boolean(errors.price))}
          />
        </Field>
        <Field id="stock" label="Stock Quantity" required error={errors.stock}>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={handleChange}
            placeholder="0"
            className={getInputClass(Boolean(errors.stock))}
          />
        </Field>
      </div>

      <Field id="category" label="Category" required error={errors.category}>
        {categories.length > 0 ? (
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className={getInputClass(Boolean(errors.category))}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
            {values.category && !categories.some((item) => item.slug === values.category) ? (
              <option value={values.category}>{values.category}</option>
            ) : null}
          </select>
        ) : (
          <input
            id="category"
            name="category"
            type="text"
            value={values.category}
            onChange={handleChange}
            placeholder="e.g. electronics"
            className={getInputClass(Boolean(errors.category))}
          />
        )}
      </Field>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-medium text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
}

function getInputClass(hasError) {
  return `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
  }`;
}

function Field({ id, label, required = false, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
