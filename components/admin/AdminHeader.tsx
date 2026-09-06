"use client";

import { RefreshCw, Plus } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
    variant?: "dark" | "gold";
  };
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function AdminHeader({
  title,
  description,
  actionButton,
  onRefresh,
  isLoading = false,
}: AdminHeaderProps) {
  const isGoldVariant = actionButton?.variant === "gold";

  return (
    <header className="bg-surface-1 border-b border-[var(--color-border)] px-4 sm:px-6 md:px-8 py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 sticky top-0 z-20">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-text-primary truncate">{title}</h1>
        {description && <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{description}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
            aria-label="Refresh Data"
            className="h-9 w-9 rounded-xl bg-surface-1 border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:border-[var(--color-border-hover)] hover:bg-surface-2 shadow-xs active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={15}
              className={`transition-transform duration-300 ${
                isLoading ? "animate-spin text-[var(--color-accent-dark)]" : "group-hover:rotate-45"
              }`}
            />
          </button>
        )}

        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className={`h-9 px-3.5 sm:px-4 rounded-xl text-xs sm:text-[13px] tracking-tight transition-all duration-200 flex items-center gap-2 cursor-pointer group select-none active:scale-[0.98] ${
              isGoldVariant
                ? "bg-gradient-to-b from-[#E2CDA4] via-[#C9A96E] to-[#B38F52] text-neutral-950 font-semibold border border-[#A88243]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.06),0_3px_10px_rgba(201,169,110,0.28)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_rgba(0,0,0,0.1),0_6px_20px_rgba(201,169,110,0.4)] hover:brightness-105"
                : "bg-neutral-900 hover:bg-neutral-800 text-white font-medium border border-neutral-800 hover:border-[var(--color-accent)]/40 shadow-xs hover:shadow-[0_2px_14px_rgba(201,169,110,0.2)]"
            }`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 rounded-lg transition-all duration-200 shadow-2xs ${
                isGoldVariant
                  ? "bg-neutral-950/10 text-neutral-950 group-hover:scale-110"
                  : "bg-[var(--color-accent)]/20 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-neutral-950"
              }`}
            >
              {actionButton.icon ? (
                <actionButton.icon size={13} strokeWidth={2.4} />
              ) : (
                <Plus size={13} strokeWidth={2.4} />
              )}
            </span>
            <span>{actionButton.label}</span>
          </button>
        )}
      </div>
    </header>
  );
}
