"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ProductSessionProvider } from "@/context/ProductSessionContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ProductSessionProvider>{children}</ProductSessionProvider>
    </AuthProvider>
  );
}
