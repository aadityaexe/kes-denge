"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TrustedBySectionProps {
  clientsData?: Array<{
    id?: string;
    _id?: string;
    name?: string;
    logoUrl?: string;
    isActive?: boolean;
  }>;
}

export function TrustedBySection({ clientsData = [] }: TrustedBySectionProps) {
  const { ref, isVisible } = useScrollReveal();
  
  const activeClients = clientsData.filter((c) => c.isActive !== false);
  if (activeClients.length === 0) return null;

  const rawList = activeClients.map((c) => c.name || "").filter(Boolean);
  // Duplicate logos to ensure seamless loop
  const duplicatedLogos = [...rawList, ...rawList];

  return (
    <section className="py-12 md:py-16 bg-surface-1 border-b border-[var(--color-border)] overflow-hidden">
      <div className="container-site">
        <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeading
            title="Trusted by industry leaders"
            subtitle="We've partnered with startups and enterprises to build products that serve millions of users."
            align="center"
          />
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex items-center h-24">
        {/* Fade gradients for smooth edge transition */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-surface-1 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-surface-1 to-transparent z-10 pointer-events-none" />
        
        {/* Marquee Track */}
        <motion.div
          className="flex whitespace-nowrap gap-8 sm:gap-12 md:gap-16 px-4 sm:px-8 items-center"
          animate={{ x: [0, "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35, // slow and smooth
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={`${logo}-${index}`}
              className="text-display-sm font-bold text-text-muted opacity-50 select-none tracking-wider"
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

