"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user?.firstName || user?.username || "Admin";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <Link href="/products" className="text-lg font-semibold text-slate-900">
            Product Admin Dashboard
          </Link>
          <p className="text-sm text-slate-500">Manage DummyJSON products</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-slate-600 sm:block">Signed in as {displayName}</p>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
