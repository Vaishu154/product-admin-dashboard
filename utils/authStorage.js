/**
 * Authentication Storage Utility
 *
 * Provides safe localStorage getters and setters for persisted user auth state.
 */

export const AUTH_STORAGE_KEY = "product_admin_auth";

/** Reads and parses stored authentication data from localStorage */
export function getStoredAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const accessToken = parsed.accessToken || parsed.token;
    if (!accessToken || typeof accessToken !== "string") {
      return null;
    }

    return {
      accessToken,
      refreshToken: parsed.refreshToken || "",
      user: parsed.user && typeof parsed.user === "object" ? parsed.user : null,
    };
  } catch {
    return null;
  }
}

/** Saves auth payload to localStorage */
export function setStoredAuth(auth) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // localStorage can be unavailable in private browsing mode
  }
}

/** Removes auth data from localStorage */
export function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage failures
  }
}

/** Convenience getter for current JWT access token */
export function getAccessToken() {
  return getStoredAuth()?.accessToken || "";
}
