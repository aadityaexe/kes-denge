"use client";

import { motion } from "framer-motion";
import { ArrowDown, Briefcase } from "lucide-react";
import type { CompanyInfo } from "./careers-data";

interface CareersHeroProps {
  company: CompanyInfo;
  totalJobs: number;
  departmentCount: number;
  onExploreClick: () => void;
}

export function CareersHero({
  company,
  totalJobs,
  departmentCount,
  onExploreClick,
}: CareersHeroProps) {
  return (
    <section className="pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[75vw] h-[55vw] max-w-[900px] max-h-[600px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/15 via-[var(--color-accent)]/5 to-transparent blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-[var(--color-accent-dark)] tracking-wide uppercase">
              <Briefcase size={13} /> Careers at {company.siteName}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary tracking-tight leading-[1.08]">
              Build Your Future{" "}
              <span className="text-[var(--color-accent-dark)] italic">With Us</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {company.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors cursor-pointer"
              >
                Explore Opportunities <ArrowDown size={15} />
              </button>
              <a
                href="#about-company"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-1 border border-[var(--color-border)] text-sm font-medium text-text-primary hover:border-[var(--color-accent)] transition-colors"
              >
                Our Culture &amp; Mission
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-surface-1 via-surface-2 to-[var(--color-accent)]/10 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-text-muted font-mono">
                    Open Opportunities
                  </p>
                  <p className="text-3xl font-display font-bold text-text-primary mt-0.5">
                    {totalJobs}{" "}
                    <span className="text-sm font-normal text-text-secondary">
                      {totalJobs === 1 ? "Active Role" : "Active Roles"}
                    </span>
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-dark)]">
                  <Briefcase size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-surface-1/90 border border-[var(--color-border)]">
                  <p className="text-xs text-text-muted">Work Model</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    100% Remote
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-1/90 border border-[var(--color-border)]">
                  <p className="text-xs text-text-muted">Departments</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {Math.max(1, departmentCount)} Teams Hiring
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary bg-surface-1/80 border border-[var(--color-border)] rounded-xl px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
                <span>Actively reviewing applications across engineering &amp; design</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
