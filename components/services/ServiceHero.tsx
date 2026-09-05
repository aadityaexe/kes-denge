"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";

// Dynamically import lightweight 3D scene
const Scene = dynamic(
  () => import("@/components/3d/Scene").then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

interface ServiceHeroProps {
  title: string;
  tagline?: string;
  heroBadge?: string;
  shortDescription: string;
  slug: string;
}

export function ServiceHero({
  title,
  tagline,
  heroBadge,
  shortDescription,
  slug: _slug,
}: ServiceHeroProps) {
  // Format title for editorial aesthetic (e.g. italicize the last word)
  const titleParts = title.split(" ");
  const mainTitle = titleParts.slice(0, -1).join(" ");
  const lastWord = titleParts[titleParts.length - 1];

  return (
    <div className="relative pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 overflow-hidden border-b border-[var(--color-border)]">
      {/* Background 3D & Parallax Ambient Glows */}
      <Scene />

      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax
          speed={0.4}
          className="absolute top-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent blur-[140px]"
        />
        <Parallax
          speed={0.2}
          className="absolute bottom-10 -left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-amber-500/5 to-transparent blur-[120px]"
        />
      </div>

      <div className="container-site relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 md:mb-8">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-text-muted flex-wrap">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <span>/</span>
            </li>
            <li>
              <Link href="/services" className="hover:text-text-primary transition-colors">
                Services
              </Link>
            </li>
            <li aria-hidden="true">
              <span>/</span>
            </li>
            <li className="text-[var(--color-accent)] font-medium truncate max-w-[160px] sm:max-w-none" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        {/* Centered Editorial Hero Content */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Glowing Category Badge */}
          <div className="mb-4 md:mb-6 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[var(--color-border-accent)] bg-surface-1/80 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-text-secondary font-mono font-medium">
              {heroBadge || "ENGINEERING & DEVELOPMENT"}
            </span>
          </div>

          {/* Main Display Headline with Italic Champagne Accent */}
          <h1 className="font-display text-[clamp(1.85rem,5.5vw,6rem)] text-text-primary tracking-tight leading-[1.04] mb-4 md:mb-6 break-words">
            {mainTitle ? (
              <>
                {mainTitle}{" "}
                <span className="text-[var(--color-accent)] italic font-light">
                  {lastWord}
                </span>
              </>
            ) : (
              <span className="text-[var(--color-accent)] italic font-light">{title}</span>
            )}
          </h1>

          {/* Value proposition tagline */}
          {tagline && (
            <p className="text-base sm:text-lg md:text-xl font-medium text-[var(--color-accent-dark)] mb-3 md:mb-4 max-w-2xl px-2">
              {tagline}
            </p>
          )}

          {/* Short description */}
          <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-6 md:mb-8 font-light leading-relaxed px-2">
            {shortDescription}
          </p>

          {/* Dual Rounded Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 md:mb-10 w-full">
            <Button
              size="lg"
              href="/contact"
              className="rounded-full px-6 sm:px-9 bg-text-primary text-surface-1 hover:bg-text-secondary font-semibold shadow-xl w-full sm:w-auto"
            >
              Schedule Technical Discovery
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              href="/portfolio"
              className="rounded-full px-6 sm:px-8 border-[var(--color-border)] hover:bg-surface-2 w-full sm:w-auto"
            >
              Explore Case Studies
            </Button>
          </div>

          {/* Live KPI Metric Ribbon */}
          <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 md:pt-8 border-t border-[var(--color-border)] text-left">
            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono uppercase mb-1">
                <Zap size={14} className="text-[var(--color-accent)]" />
                <span>Performance</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold font-display text-text-primary">
                &lt; 450ms TTFB
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">Sub-second edge delivery</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono uppercase mb-1">
                <Shield size={14} className="text-[var(--color-accent)]" />
                <span>Security</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold font-display text-text-primary">
                100% IP Transfer
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">Zero vendor lock-in</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono uppercase mb-1">
                <Clock size={14} className="text-[var(--color-accent)]" />
                <span>Velocity</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold font-display text-text-primary">
                6 - 10 Weeks
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">Milestone sprint cadence</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-text-muted font-mono uppercase mb-1">
                <Layers size={14} className="text-[var(--color-accent)]" />
                <span>SLA Standard</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold font-display text-text-primary">
                99.99% Uptime
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">Production telemetry</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
