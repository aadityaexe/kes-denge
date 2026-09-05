"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface TrustedBySectionProps {
  clientsData?: Array<{
    id?: string;
    _id?: string;
    name?: string;
    slug?: string;
    logoUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }>;
}

export function TrustedBySection({ clientsData = [] }: TrustedBySectionProps) {
  const { ref, isVisible } = useScrollReveal();
  
  const activeClients = clientsData.filter((c) => c.isActive !== false);
  if (activeClients.length === 0) return null;

  // Prioritize featured clients if marked, otherwise use all active
  const featured = activeClients.filter((c) => c.isFeatured !== false);
  const displayClients = featured.length > 0 ? featured : activeClients;

  // Build a track with enough items (at least 8) for smooth marquee loop
  let tickerList = [...displayClients];
  while (tickerList.length < 8) {
    tickerList = [...tickerList, ...displayClients];
  }
  const duplicatedLogos = [...tickerList, ...tickerList];

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
          {duplicatedLogos.map((client, index) => {
            const key = `${client.id || client._id || client.name}-${index}`;
            const clientName = client.name || "Partner";
            const content = (
              <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-muted opacity-40 hover:opacity-100 select-none tracking-tight transition-all duration-300">
                {clientName}
              </span>
            );

            return client.slug ? (
              <Link
                key={key}
                href={`/clients/${client.slug}`}
                className="flex items-center hover:scale-105 transition-transform"
                title={`View ${clientName} case study`}
              >
                {content}
              </Link>
            ) : (
              <div key={key} className="flex items-center">
                {content}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


