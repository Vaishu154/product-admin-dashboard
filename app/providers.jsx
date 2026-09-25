"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ProductSessionProvider } from "@/context/ProductSessionContext";
import { ToastProvider } from "@/context/ToastContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProductSessionProvider>
        <ToastProvider>{children}</ToastProvider>
      </ProductSessionProvider>
    </AuthProvider>
  );
}
