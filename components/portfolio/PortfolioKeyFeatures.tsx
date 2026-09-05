import { PortfolioItem, PortfolioKeyFeature } from "@/lib/types";
import {
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Database,
  Smartphone,
  Cpu,
  TrendingUp,
  Activity,
  Lock,
  Navigation,
  ShoppingCart,
  Video,
  FileText,
  CreditCard,
  Package,
  Users,
} from "lucide-react";

interface PortfolioKeyFeaturesProps {
  project: PortfolioItem;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Database,
  Smartphone,
  Cpu,
  TrendingUp,
  Activity,
  Lock,
  Navigation,
  ShoppingCart,
  Video,
  FileText,
  CreditCard,
  Package,
  Users,
};

export function PortfolioKeyFeatures({ project }: PortfolioKeyFeaturesProps) {
  const features: PortfolioKeyFeature[] = project.keyFeatures && project.keyFeatures.length > 0
    ? project.keyFeatures
    : [
        {
          title: "Real-Time State Synchronization",
          description: "Distributed WebSocket channels keeping client views and server data synced in milliseconds.",
          icon: "Zap",
        },
        {
          title: "Enterprise Role-Based Security",
          description: "Granular access control, cryptographically signed logs, and automated audit trails.",
          icon: "Shield",
        },
        {
          title: "Edge-Rendered High-Speed UI",
          description: "Sub-second initial paint times and green Core Web Vitals across every global region.",
          icon: "CheckCircle2",
        },
        {
          title: "Resilient Offline Caching",
          description: "Local data store with automatic background sync upon network reconnection.",
          icon: "Layers",
        },
      ];

  return (
    <section id="key-features" className="section-padding border-b border-[var(--color-border)] bg-surface-2/10">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Engineering Capabilities
          </div>
          <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
            Key Architecture & Features Delivered
          </h2>
          <p className="text-text-secondary text-base sm:text-lg font-light">
            Specific, high-impact features built strictly for {project.title.split("—")[0].trim()}&apos;s performance needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const IconComp = (feature.icon && iconMap[feature.icon]) || CheckCircle2;
            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-8 md:p-10 transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-dark)] mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500 shadow-sm">
                  <IconComp size={22} strokeWidth={1.75} />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-primary mb-3 group-hover:text-[var(--color-accent)] transition-colors break-words">
                  {feature.title}
                </h3>

                <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-light break-words">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
