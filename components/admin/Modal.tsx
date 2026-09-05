"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "2xl",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  }[maxWidth];

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div
        data-lenis-prevent="true"
        className={`relative w-full ${maxWidthClasses} max-h-[92vh] flex flex-col bg-surface-1 rounded-2xl border border-[var(--color-border)] shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Modal Header (pinned at top) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">{title}</h2>
            {description && <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content (fully scrollable) */}
        <div
          data-lenis-prevent="true"
          className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain"
          style={{ maxHeight: footer ? "calc(92vh - 135px)" : "calc(92vh - 75px)" }}
        >
          {children}
        </div>

        {/* Modal Footer (pinned at bottom if provided) */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-[var(--color-border)] flex items-center justify-between bg-surface-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
