"use client";

import React from "react";

interface StatusFilterItem {
  id: string;
  label: string;
  count: number;
  color?: string;
  activeColor?: string;
}

interface StatusBreakdownBarProps {
  items: StatusFilterItem[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  className?: string;
}

export function StatusBreakdownBar({
  items,
  activeFilter,
  onFilterChange,
  className = "",
}: StatusBreakdownBarProps) {
  return (
    <div
      className={`w-full lg:w-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-surface-2/80 border border-[var(--color-border)] ${className}`}
    >
      <span className="text-[10px] font-mono font-semibold text-text-muted px-2 uppercase tracking-wider hidden sm:inline-block">
        Filter:
      </span>
      {items.map((item) => {
        const isActive = activeFilter === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-medium transition-all cursor-pointer flex-1 sm:flex-initial whitespace-nowrap ${
              isActive
                ? item.activeColor ||
                  "bg-surface-1 text-text-primary shadow-xs border border-[var(--color-accent)]/35 font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-1/60 border border-transparent"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                isActive
                  ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)]"
                  : "bg-surface-3 text-text-muted"
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
