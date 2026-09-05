import { Blocks, CheckCircle2, Cloud, Cpu, Layers, Shield, Zap } from "lucide-react";

interface ProductIntegrationsProps {
  integrations?: string[];
  productName: string;
}

export function ProductIntegrations({
  integrations,
  productName,
}: ProductIntegrationsProps) {
  if (!integrations || integrations.length === 0) return null;

  return (
    <section id="integrations" className="section-padding border-b border-[var(--color-border)] bg-surface-2/30">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
            Ecosystem Connectivity
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Direct Enterprise Integrations
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            {productName} is designed to sit at the center of your operations, not in a silo. We connect seamlessly with your existing tool stack via webhooks, RESTful APIs, and OAuth connectors.
          </p>
        </div>

        {/* Integration Badges Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="px-5 py-3 rounded-xl bg-surface-1 border border-[var(--color-border)] text-sm font-semibold text-text-primary flex items-center gap-2.5 shadow-xs hover:border-[var(--color-accent)]/50 hover:shadow-md transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="text-xs font-mono text-text-muted">
            Need a custom proprietary ERP, CRM, or legacy database connector? Our engineering team builds bespoke ETL integrations.
          </span>
        </div>
      </div>
    </section>
  );
}
