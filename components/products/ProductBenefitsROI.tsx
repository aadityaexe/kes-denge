import { ProductBenefitItem } from "@/lib/types";
import {
  CheckCircle2,
  Cpu,
  Database,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

interface ProductBenefitsROIProps {
  benefits?: ProductBenefitItem[];
  productName: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  CheckCircle2,
  Cpu,
  Database,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
};

export function ProductBenefitsROI({
  benefits,
  productName,
}: ProductBenefitsROIProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section id="why-choose" className="section-padding border-b border-[var(--color-border)] bg-surface-1">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Measurable Value
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Why Choose {productName}?
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            Engineered to deliver hard business advantages, rapid user adoption, and compounding operational savings.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, idx) => {
            const IconComp = (benefit.icon && iconMap[benefit.icon]) || TrendingUp;
            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:border-[var(--color-accent)]/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-surface-2 border border-[var(--color-border)] text-[var(--color-accent)] flex items-center justify-center shadow-2xs">
                      <IconComp size={20} />
                    </div>
                    {benefit.metric && (
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] font-mono text-[11px] sm:text-xs font-bold border border-[var(--color-accent-glow-strong)]">
                        {benefit.metric}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-text-primary mb-2 sm:mb-3 break-words">
                    {benefit.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed break-words">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
