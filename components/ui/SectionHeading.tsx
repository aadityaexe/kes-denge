import { type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

interface SectionHeadingProps {
  overline?: string;
  badge?: string; // alias for overline, rendered as a Badge component
  title: string;
  subtitle?: string;
  centered?: boolean;
  align?: "left" | "center" | "right";
  as?: "h1" | "h2" | "h3";
  children?: ReactNode;
}

/**
 * Consistent section heading pattern: overline/badge + title + subtitle.
 * Server Component — no hooks, no event handlers.
 */
export function SectionHeading({
  overline,
  badge,
  title,
  subtitle,
  centered,
  align,
  as: HeadingTag = "h2",
  children,
}: SectionHeadingProps) {
  const isCentered = centered !== undefined ? centered : align === "center" || align === undefined;
  
  return (
    <div
      className={`mb-8 md:mb-10 ${isCentered ? "text-center" : align === "right" ? "text-right" : "text-left"}`}
    >
      {badge && (
        <div className={`mb-4 ${isCentered ? "flex justify-center" : ""}`}>
          <Badge variant="accent">{badge}</Badge>
        </div>
      )}
      {!badge && overline && (
        <p className="text-overline mb-3">{overline}</p>
      )}
      <HeadingTag className="text-display-md mb-3">{title}</HeadingTag>
      {subtitle && (
        <p className={`text-[var(--text-subheading)] text-text-secondary max-w-2xl leading-relaxed ${isCentered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
