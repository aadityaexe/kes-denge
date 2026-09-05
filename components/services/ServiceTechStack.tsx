"use client";

import { useState } from "react";
import { ServiceTechItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Server, 
  Database, 
  Cloud, 
  Zap, 
  Layers, 
  Globe, 
  Smartphone, 
  Paintbrush, 
  Cpu,
  Search,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface ServiceTechStackProps {
  technologies: ServiceTechItem[];
}

const techIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Smartphone,
  Server,
  Database,
  Cloud,
  Zap,
  Layers,
  Code2,
  Paintbrush,
  Cpu,
  Search,
  ShieldCheck,
};

export function ServiceTechStack({ technologies }: ServiceTechStackProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!technologies || technologies.length === 0) return null;

  // Extract all categories
  const categories = ["All", ...Array.from(new Set(technologies.map((t) => t.category || "Core")))];

  const filteredTechs = selectedCategory === "All"
    ? technologies
    : technologies.filter((t) => (t.category || "Core") === selectedCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-text-primary text-surface-1 shadow-md"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 border border-[var(--color-border)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Tech Cards */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence>
          {filteredTechs.map((tech, idx) => {
            const IconComponent = (tech.icon && techIconMap[tech.icon]) || Code2;
            return (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex flex-col items-center text-center transition-all duration-300 hover:border-[var(--color-border-accent)] hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-secondary flex items-center justify-center mb-3 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-300">
                  <IconComponent size={22} />
                </div>
                <div className="font-semibold text-text-primary text-sm mb-1">
                  {tech.name}
                </div>
                <div className="text-[11px] text-text-muted font-mono uppercase tracking-wider">
                  {tech.category}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
