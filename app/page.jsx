"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/common/LoadingState";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    router.replace(isAuthenticated ? "/products" : "/login");
  }, [isAuthenticated, isInitializing, router]);

  return <LoadingState message="Redirecting..." fullScreen />;
}
