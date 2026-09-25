"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircleIcon, AlertCircleIcon, XMarkIcon } from "@/components/common/Icons";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).slice(2, 7);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
              item.type === "success"
                ? "bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10"
                : item.type === "error"
                ? "bg-white border-red-200 text-slate-800 shadow-red-500/10"
                : "bg-white border-indigo-200 text-slate-800 shadow-indigo-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.type === "success" ? (
                <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : item.type === "error" ? (
                <AlertCircleIcon className="w-5 h-5 text-red-500 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              )}
              <p className="text-sm font-medium leading-snug break-words">{item.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}
