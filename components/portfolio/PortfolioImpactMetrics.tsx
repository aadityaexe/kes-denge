import { PortfolioItem } from "@/lib/types";
import { TrendingUp, CheckCircle2, Trophy, BarChart3, ArrowUpRight } from "lucide-react";

interface PortfolioImpactMetricsProps {
  project: PortfolioItem;
}

export function PortfolioImpactMetrics({ project }: PortfolioImpactMetricsProps) {
  const metrics = project.impactMetrics || [];
  const results = project.results || [];

  return (
    <section id="results" className="section-padding border-b border-[var(--color-border)]">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Verified Outcomes
          </div>
          <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
            Measurable Results & Business Impact
          </h2>
          <p className="text-text-secondary text-base sm:text-lg font-light">
            Real performance telemetry and operational gains achieved after production launch.
          </p>
        </div>

        {/* Quantifiable Stat Counter Cards */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-10">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col justify-between transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center mb-6">
                    <TrendingUp size={22} />
                  </div>
                  <p className="text-display-xs sm:text-display-sm font-bold font-display text-[var(--color-accent)] mb-2">
                    {m.metric}
                  </p>
                  <h3 className="text-lg font-bold font-display text-text-primary mb-1">
                    {m.label}
                  </h3>
                  {m.description && (
                    <p className="text-text-secondary text-xs leading-relaxed font-light">
                      {m.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Impact Checklist Cards */}
        {results.length > 0 && (
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-10 shadow-xl">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-3">
                <Trophy size={13} /> Production Milestones
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
                Key Technical & Commercial Milestones
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-surface-2/70 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <p className="text-base text-text-primary font-medium leading-relaxed">
                    {result}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
