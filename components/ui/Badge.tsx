import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-surface-2 text-text-secondary border-[var(--color-border)]",
  accent: "bg-[var(--color-accent-glow)] text-accent-dark border-[var(--color-border-accent)]",
  success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  error: "bg-red-500/10 text-red-700 border-red-500/25",
  outline: "bg-transparent text-text-primary border-[var(--color-border-hover)]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-3 py-1 text-[var(--text-overline)]",
};

/**
 * Tag pill for tech stack, status, industry labels.
 * Server Component.
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-[var(--radius-sm)] border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
