"use client";

import React, { useState } from "react";
import { Info, Image as ImageIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  helperText?: string;
  recommendedDimension?: string;
  charCount?: {
    current: number;
    max?: number;
    optimal?: { min: number; max: number };
  };
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  tooltip,
  helperText,
  recommendedDimension,
  charCount,
  children,
  className = "",
}: FormFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Compute character count indicator status
  let charStatusColor = "text-text-muted";
  let charStatusLabel = "";

  if (charCount) {
    const { current, max, optimal } = charCount;
    if (max && current > max) {
      charStatusColor = "text-red-500 font-bold";
      charStatusLabel = "(Over limit)";
    } else if (optimal) {
      if (current >= optimal.min && current <= optimal.max) {
        charStatusColor = "text-emerald-500 font-medium";
        charStatusLabel = "(Optimal)";
      } else if (current > optimal.max) {
        charStatusColor = "text-amber-500";
        charStatusLabel = "(A bit long)";
      } else if (current > 0 && current < optimal.min) {
        charStatusColor = "text-text-muted";
        charStatusLabel = "(A bit short)";
      }
    }
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 relative">
          <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>

          {/* Info Tooltip Icon & Popover */}
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-text-muted hover:text-[var(--color-accent-dark)] transition-colors p-0.5 rounded cursor-help"
                title="View field guidance"
                aria-label="Field information"
              >
                <Info size={13} />
              </button>

              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 z-50 w-64 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)] shadow-xl text-[11px] text-text-secondary leading-relaxed backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-text-primary mb-1 flex items-center gap-1">
                    <Info size={12} className="text-[var(--color-accent-dark)]" /> Field Guide
                  </div>
                  {tooltip}
                </div>
              )}
            </div>
          )}

          {/* Recommended Dimension Pill */}
          {recommendedDimension && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-surface-2 border border-[var(--color-border)] text-text-muted">
              <ImageIcon size={10} className="text-[var(--color-accent)]" />
              {recommendedDimension}
            </span>
          )}
        </div>

        {/* Character / Item Counter */}
        {charCount && (
          <span className={`text-[11px] font-mono ${charStatusColor}`}>
            {charCount.current}
            {charCount.max ? ` / ${charCount.max}` : ""} {charStatusLabel}
          </span>
        )}
      </div>

      {/* Input / Control Element */}
      <div>{children}</div>

      {/* Helper Text Underneath */}
      {helperText && (
        <p className="text-[11px] text-text-muted leading-normal font-light">
          {helperText}
        </p>
      )}
    </div>
  );
}
