"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-accent",
  secondary:
    "bg-transparent text-text-primary border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-surface-1",
  outline:
    "bg-transparent text-text-primary border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-surface-1",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-1",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[var(--text-body-sm)]",
  md: "px-6 py-3 text-[var(--text-body)]",
  lg: "px-8 py-4 text-[var(--text-body-lg)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      magnetic = false,
      children,
      className = "",
      href,
      target,
      rel,
      ...props
    },
    forwardedRef
  ) {
    const magneticRef = useMagneticButton<HTMLButtonElement>(0.3);
    const ref = magnetic ? magneticRef : forwardedRef;

    const classes = [
      "inline-flex items-center justify-center gap-2",
      "font-medium rounded-[var(--radius-md)]",
      "transition-all duration-[var(--transition-normal)]",
      "cursor-pointer select-none",
      "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={classes}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);
