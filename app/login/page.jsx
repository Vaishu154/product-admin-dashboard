"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import LoadingState from "@/components/common/LoadingState";
import { ShoppingCartIcon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/products");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return <LoadingState message="Checking authentication..." fullScreen />;
  }

  if (isAuthenticated) {
    return <LoadingState message="Redirecting to products..." fullScreen />;
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <ShoppingCartIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
