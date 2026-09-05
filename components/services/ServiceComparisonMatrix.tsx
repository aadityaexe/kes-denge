"use client";

import { Check, X, ShieldCheck } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  traditional: string;
  mark: string;
}

const comparisonData: ComparisonRow[] = [
  {
    dimension: "Engineering Team",
    traditional: "Junior developers with high turnover & offshore handoffs",
    mark: "Senior architects and distributed systems engineers only",
  },
  {
    dimension: "Source Code Ownership",
    traditional: "Vendor lock-in, proprietary platforms, or hidden licensing fees",
    mark: "100% intellectual property & source code transfer from day one",
  },
  {
    dimension: "Delivery Cadence",
    traditional: "Infrequent milestone demos with surprise budget overruns",
    mark: "Bi-weekly sprint demos with working live preview URLs on every commit",
  },
  {
    dimension: "Code Quality & Testing",
    traditional: "Manual ad-hoc testing with high post-launch regression bugs",
    mark: "Strict TypeScript, automated CI/CD pipelines & 90%+ test coverage",
  },
  {
    dimension: "Performance & SEO",
    traditional: "Bloated templates with failing 40-60 Core Web Vitals",
    mark: "Guaranteed 95+ Core Web Vitals and sub-450ms global TTFB",
  },
  {
    dimension: "Post-Launch Warranty",
    traditional: "Disappears after launch or charges exorbitant support fees",
    mark: "30-day hypercare warranty + dedicated SLA retention guarantees",
  },
];

export function ServiceComparisonMatrix({ serviceTitle }: { serviceTitle: string }) {
  return (
    <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-xl overflow-hidden">
      {/* Mobile-optimized Card View (< md) */}
      <div className="md:hidden divide-y divide-[var(--color-border)]">
        {comparisonData.map((row, idx) => (
          <div key={idx} className="p-4 sm:p-5 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-2 text-text-muted text-[11px] font-mono uppercase tracking-wider">
              {row.dimension}
            </div>

            {/* Traditional Agency */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-2/40 border border-red-500/10">
              <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <X size={12} strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-red-500/80 font-bold tracking-wider mb-0.5">
                  Typical Agency
                </p>
                <p className="text-xs text-text-secondary leading-relaxed break-words">
                  {row.traditional}
                </p>
              </div>
            </div>

            {/* MARK Engineering */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-accent-glow)]/30 border border-[var(--color-accent)]/20">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-[var(--color-accent-dark)] font-bold tracking-wider mb-0.5">
                  MARK Engineering
                </p>
                <p className="text-xs text-text-primary font-medium leading-relaxed break-words">
                  {row.mark}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table View (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-surface-2/60">
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-text-muted w-1/4">
                Evaluation Dimension
              </th>
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-text-muted w-3/8">
                Typical Agency / Freelance
              </th>
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-[var(--color-accent-dark)] font-bold bg-[var(--color-accent-glow)]/40 w-3/8">
                MARK Engineering
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/60 text-sm">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-2/30 transition-colors">
                <td className="py-5 px-6 font-semibold text-text-primary">
                  {row.dimension}
                </td>
                <td className="py-5 px-6 text-text-secondary">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                      <X size={12} strokeWidth={3} />
                    </div>
                    <span>{row.traditional}</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-text-primary font-medium bg-[var(--color-accent-glow)]/20">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{row.mark}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
