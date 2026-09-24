"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import LoadingState from "@/components/common/LoadingState";
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
    return <LoadingState message="Checking authentication..." />;
  }

  if (isAuthenticated) {
    return <LoadingState message="Redirecting to products..." />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Product Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the DummyJSON demo account to open the dashboard.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Demo username: emilys / Demo password: emilyspass
        </p>
      </div>
    </main>
  );
}
