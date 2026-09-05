"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface TechStackSectionProps {
  technologies?: Array<{
    name: string;
    icon?: string;
    category: "frontend" | "backend" | "database" | "devops" | "mobile" | "language" | string;
  }>;
}

export function TechStackSection({ technologies = [] }: TechStackSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });

  if (!technologies || technologies.length === 0) return null;

  // Group technologies by category
  const groupedTech = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  const categoryLabels: Record<string, string> = {
    frontend: "Frontend & UI",
    backend: "Backend & API",
    database: "Database & Cache",
    devops: "DevOps & Cloud",
    mobile: "Mobile",
    language: "Languages",
  };

  return (
    <section className="section-padding bg-background border-t border-[var(--color-border)]">
      <div className="container-site">
        <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeading
            title="Our Tech Stack"
            subtitle="We don't chase hype. We use boring, battle-tested technologies to build exciting products."
            badge="Technologies"
            align="left"
          />
        </div>

        <motion.div 
          className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {Object.entries(groupedTech).map(([category, techs], i) => (
            <motion.div key={category} variants={fadeInUp} className="flex flex-col">
              <h3 className="text-[var(--text-heading-xs)] font-semibold text-text-primary mb-3.5 flex items-center gap-3">
                <span className="w-8 h-px bg-accent/50" />
                {categoryLabels[category] || category}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {techs.map((tech) => (
                  <div 
                    key={tech.name}
                    className="px-4 py-2 rounded-lg bg-surface-1 border border-[var(--color-border)] text-[var(--text-body-sm)] font-medium text-text-secondary hover:text-text-primary hover:border-[var(--color-border-accent)] transition-colors cursor-default"
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
