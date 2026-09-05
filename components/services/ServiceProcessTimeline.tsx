"use client";

import { ServiceProcessItem } from "@/lib/types";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";

interface ServiceProcessTimelineProps {
  processSteps: ServiceProcessItem[];
}

export function ServiceProcessTimeline({ processSteps }: ServiceProcessTimelineProps) {
  if (!processSteps || processSteps.length === 0) return null;

  const sortedSteps = [...processSteps].sort((a, b) => a.step - b.step);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      {sortedSteps.map((stepItem, index) => {
        return (
          <div
            key={stepItem.step || index}
            className="group relative bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:border-[var(--color-accent)]/40 hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Ambient hover glow on card */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--color-accent)]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div>
              {/* Step Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-lg sm:text-xl text-text-primary group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm shrink-0">
                    0{stepItem.step}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-text-muted font-mono font-medium block">
                      Phase {stepItem.step}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-accent-dark)]">
                      Milestone {stepItem.step} of {sortedSteps.length}
                    </span>
                  </div>
                </div>

                {stepItem.duration && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 text-text-secondary text-xs font-medium border border-[var(--color-border)]">
                    <Clock size={12} className="text-[var(--color-accent)]" />
                    <span>{stepItem.duration}</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary mb-3 group-hover:text-[var(--color-accent)] transition-colors break-words">
                {stepItem.title}
              </h3>

              <p className="text-text-secondary text-sm leading-relaxed font-light break-words">
                {stepItem.description}
              </p>
            </div>

            {/* Bottom milestone guarantee */}
            <div className="mt-8 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-1.5 text-text-secondary">
                <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                <span>Deliverable verified</span>
              </div>
              <span className="text-[var(--color-accent-dark)] font-medium font-mono text-[11px] group-hover:translate-x-1 transition-transform inline-flex items-center">
                Sprint Ready &rarr;
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
