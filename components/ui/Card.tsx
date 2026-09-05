import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  hoverEffect?: "glow" | "lift" | "none";
}

const paddingStyles: Record<string, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Base card with elevation system.
 * Server Component — interactive behaviors added by wrapping with client components.
 */
export function Card({
  children,
  className = "",
  padding = "md",
  hover = true,
  hoverEffect,
}: CardProps) {
  return (
    <div
      className={`
        card ${paddingStyles[padding]}
        ${hover ? "" : "hover:border-[var(--color-border)] hover:shadow-none"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
