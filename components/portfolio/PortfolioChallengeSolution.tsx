import { PortfolioItem } from "@/lib/types";
import { AlertCircle, CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react";

interface PortfolioChallengeSolutionProps {
  project: PortfolioItem;
}

export function PortfolioChallengeSolution({ project }: PortfolioChallengeSolutionProps) {
  const challenges = project.challenges || [
    "Legacy infrastructure bottleneck causing high latency during peak market activity.",
    "Complex multi-tenant security requirements demanding zero-knowledge encryption.",
    "Strict cross-platform performance standards across distributed geographical nodes.",
  ];

  const solutions = project.solutions || [
    "Architected edge-rendered distributed microservices with automated failover routing.",
    "Implemented role-based row-level encryption and automated compliance auditing.",
    "Constructed ultra-optimized client-side rendering engines with WebSockets.",
  ];

  return (
    <section id="challenge-solution" className="section-padding border-b border-[var(--color-border)]">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Engineering Strategy
          </div>
          <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
            The Core Challenge & Architectural Solution
          </h2>
          <p className="text-text-secondary text-base sm:text-lg font-light">
            How we decomposed complex business bottlenecks into clean, scalable software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. The Challenge Card */}
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-lg group hover:border-rose-500/40 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-mono font-bold uppercase tracking-wider mb-6 border border-rose-500/20">
                <AlertCircle size={14} /> The Problem & Technical Constraints
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-4">
                What Was Holding the Business Back
              </h3>

              <p className="text-text-secondary text-base leading-relaxed mb-8 font-light">
                {project.problem}
              </p>

              <div className="space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Key Technical Bottlenecks Faced:
                </p>
                {challenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)]"
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✕
                    </div>
                    <span className="text-sm text-text-primary leading-relaxed">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. The Solution Card */}
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-lg group hover:border-emerald-500/40 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-mono font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
                <ShieldCheck size={14} /> The Kas Denge Solution
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-text-primary mb-4">
                How We Solved It With Rigorous Engineering
              </h3>

              <p className="text-text-secondary text-base leading-relaxed mb-8 font-light">
                {project.solution}
              </p>

              <div className="space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Architectural Pillars Implemented:
                </p>
                {solutions.map((sol, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)]"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-sm text-text-primary leading-relaxed">{sol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
