import { ProductFeatureItem } from "@/lib/types";
import { 
  Banknote, 
  BarChart3, 
  Blocks, 
  Briefcase, 
  Building, 
  CheckCircle2, 
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

interface ProductFeaturesBentoProps {
  features: (string | ProductFeatureItem)[];
  productName: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Banknote,
  BarChart3,
  Blocks,
  Briefcase,
  Building,
  CheckCircle2,
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

export function ProductFeaturesBento({
  features,
  productName,
}: ProductFeaturesBentoProps) {
  if (!features || features.length === 0) return null;

  return (
    <section id="features" className="section-padding border-b border-[var(--color-border)] bg-surface-1">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Platform Capabilities
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Engineered Capabilities Built for Extreme Reliability
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            Every feature in {productName} is designed to eliminate operational friction, automate manual overhead, and guarantee high-throughput business execution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const isObject = typeof item === "object" && item !== null;
            const title = isObject ? item.title : `Feature ${idx + 1}`;
            const description = isObject ? item.description : item;
            const iconName = isObject ? item.icon : undefined;
            const IconComponent = (iconName && iconMap[iconName]) || CheckCircle2;

            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-8 md:p-10 hover:border-[var(--color-accent)]/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-all duration-300 shadow-sm">
                      <IconComponent size={22} />
                    </div>
                    <span className="text-xs font-mono font-bold text-text-muted">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-text-primary mb-3 group-hover:text-[var(--color-accent-dark)] transition-colors break-words">
                    {title}
                  </h3>

                  <p className="text-text-secondary text-sm sm:text-base font-light leading-relaxed mb-6 break-words">
                    {description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]/60 flex items-center gap-2 text-xs font-mono text-[var(--color-accent-dark)] font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Production-Grade Architecture</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
