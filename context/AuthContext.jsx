"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "@/services/authApi";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "@/utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  const applyAuth = useCallback((auth) => {
    if (!auth?.accessToken) {
      setUser(null);
      setToken("");
      return;
    }
    setUser(auth.user);
    setToken(auth.accessToken);
  }, []);

  useEffect(() => {
    applyAuth(getStoredAuth());
    setIsInitializing(false);

    const handleUnauthorized = () => {
      applyAuth(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [applyAuth]);

  const login = useCallback(async ({ username, password }) => {
    const auth = await loginRequest({ username, password });
    setStoredAuth(auth);
    applyAuth(auth);
    return auth;
  }, [applyAuth]);

  const logout = useCallback(() => {
    clearStoredAuth();
    applyAuth(null);
  }, [applyAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isInitializing,
      login,
      logout,
    }),
    [user, token, isInitializing, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
