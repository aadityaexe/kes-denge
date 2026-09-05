"use client";

import { useState } from "react";
import { PortfolioItem } from "@/lib/types";
import {
  Activity,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Radio,
} from "lucide-react";

interface PortfolioVisualShowcaseProps {
  project: PortfolioItem;
}

export function PortfolioVisualShowcase({ project }: PortfolioVisualShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "architecture">("overview");

  return (
    <section className="py-16 md:py-20 border-b border-[var(--color-border)] bg-surface-2/20">
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-2 uppercase tracking-widest border border-[var(--color-border)]">
              Interactive System Telemetry
            </div>
            <h2 className="text-display-xs sm:text-display-sm font-bold font-display text-text-primary">
              Production Architecture & Interface Preview
            </h2>
          </div>

          {/* Interactive Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-1 border border-[var(--color-border)] self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap min-h-[36px] ${
                activeTab === "overview"
                  ? "bg-[var(--color-accent)] text-surface-1 shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              UI Showcase
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap min-h-[36px] ${
                activeTab === "metrics"
                  ? "bg-[var(--color-accent)] text-surface-1 shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap min-h-[36px] ${
                activeTab === "architecture"
                  ? "bg-[var(--color-accent)] text-surface-1 shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Stack Blueprint
            </button>
          </div>
        </div>

        {/* High-Tech Terminal / Showcase Window */}
        <div className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-surface-1 overflow-hidden shadow-2xl">
          {/* Top Window Control Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-[var(--color-border)] bg-surface-2/60 backdrop-blur-md gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 inline-block shrink-0" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 inline-block shrink-0" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 inline-block shrink-0" />
              <span className="ml-1.5 sm:ml-3 text-[11px] sm:text-xs font-mono text-text-muted truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                production://{project.slug}.mark.internal
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded-md">
                <Radio size={12} className="animate-pulse" />
                <span className="hidden xs:inline">Cluster </span>Online
              </div>
            </div>
          </div>

          {/* Main Visual Content Body */}
          <div className="p-4 sm:p-8 md:p-12 min-h-[auto] sm:min-h-[420px] flex flex-col justify-between">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Project Headline & Context */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-accent-dark)] font-bold uppercase tracking-wider">
                      <Activity size={14} /> Mission-Critical System Overview
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-primary break-words">
                      {project.shortDescription || project.oneLiner}
                    </h3>
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-light break-words">
                      {project.fullDescription || project.problem}
                    </p>
                  </div>

                  {/* Impact Summary Pill Grid */}
                  <div className="lg:col-span-5 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    {project.impactMetrics && project.impactMetrics.length > 0 ? (
                      project.impactMetrics.slice(0, 4).map((m, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-colors"
                        >
                          <p className="text-2xl font-bold font-display text-[var(--color-accent)] mb-1">
                            {m.metric}
                          </p>
                          <p className="text-xs font-semibold text-text-primary mb-0.5">
                            {m.label}
                          </p>
                          <p className="text-[11px] text-text-muted leading-tight">
                            {m.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)]">
                          <p className="text-2xl font-bold font-display text-[var(--color-accent)] mb-1">
                            100%
                          </p>
                          <p className="text-xs font-semibold text-text-primary">
                            TypeScript Typed
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)]">
                          <p className="text-2xl font-bold font-display text-[var(--color-accent)] mb-1">
                            99.9%
                          </p>
                          <p className="text-xs font-semibold text-text-primary">
                            Production SLA
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Key Deliverables Bullet Ribbon */}
                <div className="pt-6 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Zero Technical Debt Architecture</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>SOC2 & Enterprise Security Ready</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Edge CDN & Sub-Second Latency</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {project.impactMetrics && project.impactMetrics.length > 0 ? (
                    project.impactMetrics.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-6 rounded-2xl bg-surface-2/90 border border-[var(--color-border)] flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center mb-4">
                            <TrendingUp size={20} />
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-1 break-words">
                            {item.metric}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-accent-dark)] mb-2">
                            {item.label}
                          </p>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    project.results.map((res, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-surface-2/90 border border-[var(--color-border)]"
                      >
                        <p className="text-xl font-bold text-text-primary mb-2">Result #{i + 1}</p>
                        <p className="text-sm text-text-secondary">{res}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.map((tech, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-surface-1 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-dark)] shrink-0 font-mono text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{tech.name}</p>
                          <p className="text-xs text-text-muted">{tech.category || "Core Layer"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    project.techStack.map((t, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] flex items-center gap-3"
                      >
                        <Cpu size={18} className="text-[var(--color-accent)]" />
                        <span className="text-sm font-medium text-text-primary">{t}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
