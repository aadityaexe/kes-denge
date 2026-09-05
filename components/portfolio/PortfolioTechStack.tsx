import { PortfolioItem, PortfolioTechItem } from "@/lib/types";
import { Code2, Cpu, Database, Globe, Layers, Server, Shield, Terminal, Zap } from "lucide-react";

interface PortfolioTechStackProps {
  project: PortfolioItem;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Code2,
  Server,
  Database,
  Layers,
  Zap,
  Shield,
  Terminal,
  Cpu,
};

export function PortfolioTechStack({ project }: PortfolioTechStackProps) {
  const technologies: PortfolioTechItem[] = project.technologies && project.technologies.length > 0
    ? project.technologies
    : project.techStack.map((tech) => ({
        name: tech,
        category: "Core Stack",
        icon: "Code2",
      }));

  return (
    <section id="tech-stack" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            Technology Decisions
          </div>
          <h2 className="text-display-md font-bold font-display text-text-primary mb-4">
            Technologies & Frameworks Selected
          </h2>
          <p className="text-text-secondary text-base sm:text-lg font-light">
            Tools chosen strictly for reliability, performance, low latency, and long-term maintainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, idx) => {
            const IconComp = (tech.icon && iconMap[tech.icon]) || Code2;
            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-8 flex items-start gap-4 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-dark)] shrink-0 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-300">
                  <IconComp size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-text-primary mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
                    {tech.category || "Core Technology"}
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
