import { ProductSpecificationItem, ProductTechItem } from "@/lib/types";
import { 
  Cloud, 
  Code2, 
  Cpu, 
  Database, 
  Globe, 
  Layers, 
  Lock, 
  Server, 
  ShieldCheck, 
  Terminal, 
  Zap 
} from "lucide-react";

interface ProductTechSpecsProps {
  specifications?: ProductSpecificationItem[];
  technologies?: ProductTechItem[];
  deploymentOptions?: string[];
  securityCompliance?: string[];
  productName: string;
}

const techIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Server,
  Zap,
};

export function ProductTechSpecs({
  specifications,
  technologies,
  deploymentOptions,
  securityCompliance,
  productName,
}: ProductTechSpecsProps) {
  const hasSpecs = specifications && specifications.length > 0;
  const hasTech = technologies && technologies.length > 0;
  const hasDeploy = deploymentOptions && deploymentOptions.length > 0;
  const hasSecurity = securityCompliance && securityCompliance.length > 0;

  if (!hasSpecs && !hasTech && !hasDeploy && !hasSecurity) return null;

  return (
    <section id="specifications" className="section-padding border-b border-[var(--color-border)] bg-surface-1">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Engineering & Infrastructure
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Technical Specifications & Compliance
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            Engineered with strict zero-compromise architectural standards for high throughput, data sovereignty, and regulatory audit compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Specifications Table */}
          {hasSpecs && (
            <div className="lg:col-span-7 bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[var(--color-border)]">
                <Terminal size={18} className="text-[var(--color-accent-dark)]" />
                <h3 className="text-base sm:text-lg font-bold font-display text-text-primary">
                  System Architecture Specs
                </h3>
              </div>

              <div className="divide-y divide-[var(--color-border)]">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-sm">
                    <span className="font-mono text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-text-primary font-medium sm:text-right break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Deployment, Security, Tech Stack */}
          <div className={`${hasSpecs ? "lg:col-span-5" : "lg:col-span-12"} space-y-6`}>
            {/* Deployment Options */}
            {hasDeploy && (
              <div className="bg-surface-2/60 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Cloud size={18} className="text-[var(--color-accent-dark)]" />
                  <h4 className="text-base font-bold font-display text-text-primary">
                    Deployment Options
                  </h4>
                </div>
                <ul className="space-y-2.5">
                  {deploymentOptions.map((opt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-text-primary font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security Compliance */}
            {hasSecurity && (
              <div className="bg-surface-2/60 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Lock size={18} className="text-emerald-600" />
                  <h4 className="text-base font-bold font-display text-text-primary">
                    Security & Regulatory Compliance
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {securityCompliance.map((sec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-[var(--color-border)] text-xs font-mono font-medium text-text-primary shadow-2xs"
                    >
                      <ShieldCheck size={13} className="text-emerald-600" />
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Badges */}
            {hasTech && (
              <div className="bg-surface-2/60 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu size={18} className="text-[var(--color-accent-dark)]" />
                  <h4 className="text-base font-bold font-display text-text-primary">
                    Core Technologies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t, idx) => {
                    const IconComp = (t.icon && techIconMap[t.icon]) || Code2;
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-[var(--color-border)] text-xs font-mono font-medium text-text-primary shadow-2xs"
                      >
                        <IconComp size={13} className="text-[var(--color-accent)]" />
                        {t.name}
                        <span className="text-[10px] text-text-muted">({t.category})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
