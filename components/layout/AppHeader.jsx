"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCartIcon, PowerIcon } from "@/components/common/Icons";

export default function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user?.firstName || user?.username || "Admin";

  const avatarSrc =
    user?.image && !user.image.includes("dummyjson.com/icon")
      ? user.image
      : "/emily-avatar.png";

  return (
    <header className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/products" className="flex items-center gap-3 group">
            <div className="text-blue-600 group-hover:scale-105 transition-transform shrink-0">
              <ShoppingCartIcon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight block">
                Product Admin Dashboard
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your products, categories and inventory
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover bg-slate-100"
            />
            <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
              {displayName}
            </span>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <PowerIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
