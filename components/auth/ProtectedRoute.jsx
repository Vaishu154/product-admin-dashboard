"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/common/LoadingState";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingState message="Checking authentication..." fullScreen />;
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return <LoadingState message="Redirecting to login..." fullScreen />;
  }

  return children;
}
