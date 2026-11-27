import { type ReactNode } from "react";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  lead?: string;
  align?: "left" | "center" | "right";
  children?: ReactNode;
  className?: string;
}

/**
 * Shared public page hero with ambient parallax orb and consistent spacing.
 */
export function PageHero({
  badge,
  title,
  subtitle,
  lead,
  align = "center",
  children,
  className = "pb-8 md:pb-12",
}: PageHeroProps) {
  return (
    <div className={`pt-24 sm:pt-28 md:pt-32 relative overflow-hidden ${className}`}>
      {/* Background Parallax Orb */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax
          speed={0.8}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]"
        />
      </div>

      <div className="container-site relative z-10">
        <SectionHeading
          as="h1"
          title={title}
          subtitle={subtitle}
          badge={badge}
          align={align}
        />

        {lead && (
          <div className="max-w-3xl mx-auto mt-6 text-center">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              {lead}
            </p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
