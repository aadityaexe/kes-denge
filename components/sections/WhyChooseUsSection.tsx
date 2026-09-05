"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import {
  Zap,
  Code2,
  Layers,
  Search,
  Shield,
  Cpu,
  Headphones,
  Receipt,
} from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Zap,
  Code2,
  Layers,
  Search,
  Shield,
  Cpu,
  Headphones,
  Receipt,
};

function FeatureCard({ item, index, isWide, speed }: { item: any, index: number, isWide: boolean, speed: number }) {
  const Icon = iconMap[item.icon] || Zap;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      variants={fadeInUp}
      className={`${isWide ? 'lg:col-span-2' : 'lg:col-span-1'} h-full`}
    >
      <Parallax speed={speed} className="h-full">
        <div 
          onMouseMove={handleMouseMove}
          className={`
          relative overflow-hidden
          bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8
          hover:bg-surface-2 transition-colors duration-[var(--transition-normal)]
          group h-full
        `}>
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0 rounded-[var(--radius-lg)]"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(201, 169, 110, 0.12),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6 inline-flex p-3 rounded-lg bg-background border border-[var(--color-border)] text-text-secondary group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/30 transition-colors">
              {Icon && <Icon size={20} />}
            </div>
            
            <h3 className="text-[var(--text-heading-sm)] font-bold mb-3 text-text-primary">
              {item.title}
            </h3>
            
            <p className="text-[var(--text-body-sm)] text-text-secondary mt-auto">
              {item.description}
            </p>
          </div>
        </div>
      </Parallax>
    </motion.div>
  );
}

interface WhyChooseUsSectionProps {
  items?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export function WhyChooseUsSection({ items = [] }: WhyChooseUsSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });

  if (!items || items.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-site">
        <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeading
            title="The Engineering Difference"
            subtitle="We don't just write code. We build scalable architectures that your internal team can actually maintain when we hand it off."
            badge="Why Us"
            align="center"
          />
        </div>

        <motion.div
          className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {items.map((item, index) => {
            const isWide = index === 0 || index === 7;
            const speed = index % 2 === 0 ? 1.05 : 0.95;
            return (
              <FeatureCard 
                key={index} 
                item={item} 
                index={index} 
                isWide={isWide} 
                speed={speed} 
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
