"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  addToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const contextValue: ToastContextType = {
    toast: addToast,
    addToast,
    success: (msg: string) => addToast(msg, "success"),
    error: (msg: string) => addToast(msg, "error"),
    info: (msg: string) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              t.type === "success"
                ? "bg-surface-1/95 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : t.type === "error"
                ? "bg-surface-1/95 border-red-500/30 text-red-600 dark:text-red-400"
                : "bg-surface-1/95 border-[var(--color-border)] text-text-primary"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
            {t.type === "error" && <AlertCircle size={16} className="text-red-500 shrink-0" />}
            {t.type === "info" && <Info size={16} className="text-[var(--color-accent-dark)] shrink-0" />}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X size={13} />
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
    // Graceful fallback if used outside provider
    return {
      toast: (msg: string) => console.log("[Toast]", msg),
      addToast: (msg: string) => console.log("[Toast]", msg),
      success: (msg: string) => console.log("[Toast success]", msg),
      error: (msg: string) => console.error("[Toast error]", msg),
      info: (msg: string) => console.log("[Toast info]", msg),
    };
  }
  return context;
}
