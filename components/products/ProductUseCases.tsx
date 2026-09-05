import { ProductUseCaseItem } from "@/lib/types";
import { Building2, TrendingUp } from "lucide-react";

interface ProductUseCasesProps {
  useCases?: ProductUseCaseItem[];
  targetIndustries?: string[];
  productName: string;
}

export function ProductUseCases({
  useCases,
  targetIndustries,
  productName,
}: ProductUseCasesProps) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <section id="use-cases" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
            Practical Business Applications
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Real-World Industry Use Cases
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            See how high-velocity organizations leverage {productName} to overcome critical bottlenecks and unlock measurable ROI.
          </p>
        </div>

        {/* Target Industries Tag Cloud */}
        {targetIndustries && targetIndustries.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 md:mb-10">
            <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider mr-2">
              Target Sectors:
            </span>
            {targetIndustries.map((ind, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-surface-1 border border-[var(--color-border)] text-xs font-medium text-text-secondary flex items-center gap-1.5 shadow-2xs"
              >
                <Building2 size={13} className="text-[var(--color-accent-dark)]" />
                {ind}
              </span>
            ))}
          </div>
        )}

        {/* Use Cases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => (
            <div
              key={idx}
              className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-6 md:p-8 hover:shadow-xl hover:border-[var(--color-accent)]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-4">
                  {uc.industry}
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-display text-text-primary mb-4 break-words">
                  {uc.title}
                </h3>

                <div className="space-y-3 sm:space-y-4 text-xs md:text-sm">
                  <div className="p-3 sm:p-3.5 rounded-lg bg-surface-2/60 border border-[var(--color-border)]">
                    <span className="font-mono font-bold text-red-600 block mb-1 uppercase text-[10px] tracking-wider">
                      The Operational Problem
                    </span>
                    <p className="text-text-secondary leading-relaxed font-light break-words">
                      {uc.problem}
                    </p>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-lg bg-surface-2/60 border border-[var(--color-border)]">
                    <span className="font-mono font-bold text-blue-600 block mb-1 uppercase text-[10px] tracking-wider">
                      The Engineered Solution
                    </span>
                    <p className="text-text-secondary leading-relaxed font-light break-words">
                      {uc.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Outcome Badge */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border)] bg-emerald-500/5 -mx-4 sm:-mx-6 md:-mx-8 -mb-4 sm:-mb-6 md:-mb-8 p-4 sm:p-6 rounded-b-[var(--radius-xl)]">
                <div className="flex items-start gap-2.5">
                  <TrendingUp size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-emerald-600 uppercase text-[10px] tracking-wider block mb-1">
                      Business Outcome
                    </span>
                    <p className="text-xs text-text-primary font-medium leading-relaxed break-words">
                      {uc.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
