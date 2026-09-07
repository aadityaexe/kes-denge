"use client";

import { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  height?: "auto" | "sm" | "md" | "lg" | "tall" | "xl" | "full";
  allowFullscreen?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "3xl",
  height,
  allowFullscreen = true,
  className = "",
}: ModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);

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
    } else {
      setIsMaximized(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-md",              // ~448px (confirm dialogs)
    md: "max-w-xl",              // ~576px
    lg: "max-w-3xl",             // ~768px
    xl: "max-w-4xl",             // ~896px
    "2xl": "max-w-5xl",          // ~1024px
    "3xl": "max-w-6xl",          // ~1152px
    "4xl": "max-w-7xl",          // ~1280px
    "5xl": "max-w-[1400px]",     // ~1400px
    "6xl": "max-w-[1536px]",     // ~1536px
    "7xl": "max-w-[1680px]",     // ~1680px
    full: "max-w-[96vw]",        // ~96vw
  }[maxWidth];

  const resolvedHeight = height || (maxWidth === "sm" ? "auto" : "tall");
  const heightClasses = {
    auto: "max-h-[92vh]",
    sm: "h-[50vh] min-h-[360px] max-h-[85vh]",
    md: "h-[65vh] min-h-[460px] max-h-[88vh]",
    lg: "h-[78vh] min-h-[540px] max-h-[90vh]",
    tall: "h-[88vh] sm:min-h-[580px] max-h-[94vh]",
    xl: "h-[92vh] sm:min-h-[640px] max-h-[96vh]",
    full: "h-[95vh] max-h-[98vh]",
  }[resolvedHeight];

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div
        data-lenis-prevent="true"
        className={`relative flex flex-col bg-surface-1 rounded-2xl border border-[var(--color-border)] shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-200 transition-all ${
          isMaximized
            ? "w-full max-w-[98vw] h-[96vh]"
            : `w-full ${maxWidthClasses} ${heightClasses}`
        } ${className}`}
      >
        {/* Modal Header (pinned at top) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-surface-2 shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">{title}</h2>
            {description && <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{description}</p>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {allowFullscreen && maxWidth !== "sm" && (
              <button
                type="button"
                onClick={() => setIsMaximized((prev) => !prev)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer flex items-center justify-center"
                aria-label={isMaximized ? "Restore modal size" : "Maximize modal"}
                title={isMaximized ? "Restore modal size" : "Maximize modal"}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Close modal"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content (fully scrollable) */}
        <div
          data-lenis-prevent="true"
          className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 overscroll-contain"
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
