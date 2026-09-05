import { ProductModule } from "@/lib/types";
import { 
  Banknote, 
  BarChart3, 
  Blocks, 
  Briefcase, 
  Building, 
  Check, 
  Clock, 
  Cpu, 
  Database, 
  Factory, 
  Layers, 
  Package, 
  Shield, 
  ShieldCheck, 
  ShoppingCart, 
  Target, 
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react";

interface ProductModulesGridProps {
  modules?: ProductModule[];
  productName: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Banknote,
  BarChart3,
  Blocks,
  Briefcase,
  Building,
  Clock,
  Cpu,
  Database,
  Factory,
  Layers,
  Package,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  Zap,
};

export function ProductModulesGrid({
  modules,
  productName,
}: ProductModulesGridProps) {
  if (!modules || modules.length === 0) return null;

  return (
    <section id="modules" className="section-padding border-b border-[var(--color-border)] bg-surface-2/30">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
            Enterprise Hub
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Modular Enterprise Workspace
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            Deploy the complete platform out of the box, or integrate standalone modules directly into your existing enterprise infrastructure.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, idx) => {
            const IconComp = iconMap[mod.icon] || Blocks;

            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 md:p-8 hover:shadow-xl hover:border-[var(--color-accent)]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-[var(--color-border)] text-[var(--color-accent)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-all duration-300 shadow-xs">
                    <IconComp size={22} />
                  </div>

                  <h3 className="text-xl font-bold font-display text-text-primary mb-2 group-hover:text-[var(--color-accent-dark)] transition-colors">
                    {mod.name}
                  </h3>

                  <p className="text-sm text-text-secondary font-light leading-relaxed mb-6">
                    {mod.description}
                  </p>
                </div>

                {mod.capabilities && mod.capabilities.length > 0 && (
                  <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                    <div className="text-[11px] font-mono uppercase text-text-muted font-bold tracking-wider mb-2">
                      Key Capabilities:
                    </div>
                    {mod.capabilities.map((cap, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-xs text-text-primary font-medium">
                        <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
