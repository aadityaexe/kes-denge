"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ChevronRight, ExternalLink, ShieldCheck, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface ProductHeroProps {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  heroBadge?: string;
  demoUrl?: string;
}

export function ProductHero({
  name,
  slug,
  tagline,
  description,
  category,
  heroBadge = "ENTERPRISE PLATFORM",
  demoUrl,
}: ProductHeroProps) {
  return (
    <section className="relative pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-14 border-b border-[var(--color-border)] overflow-hidden bg-gradient-to-b from-surface-2/60 to-surface-1">
      {/* Background ambient gold aura */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--color-accent)]/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container-site">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-text-muted mb-4 sm:mb-6 md:mb-8 font-mono flex-wrap">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-text-muted/60" />
          <Link href="/products" className="hover:text-text-primary transition-colors">
            Products
          </Link>
          <ChevronRight size={14} className="text-text-muted/60" />
          <span className="text-text-primary font-medium truncate max-w-[160px] sm:max-w-none">{name}</span>
        </nav>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-8 flex flex-col items-start">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold tracking-wider uppercase border border-[var(--color-accent-glow-strong)]">
                <Layers size={12} />
                {heroBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 text-text-secondary text-xs font-mono font-medium border border-[var(--color-border)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                {category} Category
              </span>
            </div>

            {/* Title */}
            <h1 className="text-display-md sm:text-display-lg md:text-display-xl font-bold font-display tracking-tight text-text-primary mb-3 sm:mb-4 leading-[1.08] break-words">
              {name}
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--color-accent-dark)] font-medium mb-4 sm:mb-6 leading-relaxed break-words">
              {tagline}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-text-secondary font-light leading-relaxed max-w-3xl mb-6 sm:mb-8">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full">
              <Button
                size="lg"
                href={`/contact?subject=Demo%20Request%20for%20${encodeURIComponent(name)}&product=${slug}`}
                className="bg-text-primary text-surface-1 hover:bg-[var(--color-accent-dark)] hover:text-surface-1 shadow-lg transition-all w-full sm:w-auto"
              >
                Request Technical Demo
              </Button>

              {demoUrl ? (
                <Button
                  size="lg"
                  variant="outline"
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-[var(--color-border)] hover:border-[var(--color-accent)] text-text-primary w-full sm:w-auto"
                >
                  <span>Interactive Preview</span>
                  <ExternalLink size={15} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  href="/contact"
                  className="border-[var(--color-border)] hover:border-[var(--color-accent)] text-text-primary w-full sm:w-auto"
                >
                  Contact Engineering Team
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Platform Trust Highlights */}
          <div className="lg:col-span-4 bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 shadow-sm w-full">
            <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Enterprise Assurance
            </div>
            
            <div className="space-y-4 text-sm text-text-secondary">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2/60 border border-[var(--color-border)]">
                <ShieldCheck size={18} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-text-primary">100% IP & Code Ownership</div>
                  <div className="text-xs text-text-muted">Full source repository handover with zero recurring per-user fees.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2/60 border border-[var(--color-border)]">
                <Zap size={18} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-text-primary">Custom Modular Architecture</div>
                  <div className="text-xs text-text-muted">Tailored database schemas and workflow integrations to match your exact business rules.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2/60 border border-[var(--color-border)]">
                <ShieldCheck size={18} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-text-primary">Dedicated SLA & Hyper-Care</div>
                  <div className="text-xs text-text-muted">Guaranteed post-launch warranty, automated backups, and 24/7 uptime monitoring.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
