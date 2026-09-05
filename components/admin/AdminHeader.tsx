"use client";

import Link from "next/link";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
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
  return (
    <header className="bg-surface-1 border-b border-[var(--color-border)] px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-text-primary">{title}</h1>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
            className="p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin text-[var(--color-accent-dark)]" : ""} />
          </button>
        )}

        {actionButton && (
          <Button
            size="sm"
            onClick={actionButton.onClick}
            className="flex items-center gap-1.5 shadow-sm text-xs font-semibold"
          >
            {actionButton.icon ? <actionButton.icon size={15} /> : <Plus size={15} />}
            <span>{actionButton.label}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
