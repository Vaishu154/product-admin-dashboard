"use client";

import AppHeader from "@/components/layout/AppHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProductsLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
