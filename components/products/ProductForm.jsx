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
  submitLabel = "Save",
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
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}

      <Field
        id="title"
        label="Title"
        error={errors.title}
      >
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <Field id="description" label="Description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="price" label="Price" error={errors.price}>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
        <Field id="stock" label="Stock" error={errors.stock}>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="category" label="Category" error={errors.category}>
        {categories.length > 0 ? (
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className={inputClass}
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
            value={values.category}
            onChange={handleChange}
            className={inputClass}
          />
        )}
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
