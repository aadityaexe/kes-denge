"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";

function PricingCard({ tier, index }: { tier: any, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div variants={fadeInUp} className="h-full flex">
      <Parallax speed={index === 1 ? 1.05 : 0.95} className="w-full flex flex-col h-full">
        <div 
          onMouseMove={handleMouseMove}
          className={`
          group overflow-hidden relative flex flex-col w-full h-full rounded-[var(--radius-xl)] p-8 transition-colors duration-500
          ${tier.isPopular 
            ? 'bg-surface-1 border-2 border-[var(--color-accent)] shadow-xl md:-translate-y-4' 
            : 'bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-surface-2'
          }
        `}
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[var(--radius-xl)] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(201, 169, 110, 0.12),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="relative z-10 flex flex-col h-full">
            {tier.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(2rem+50%)] px-4 py-1 rounded-full bg-[var(--color-accent)] text-white text-[var(--text-caption)] font-bold tracking-wide uppercase shadow-lg z-20">
                Most Popular
              </div>
            )}
            
            <h3 className="text-[var(--text-heading-sm)] font-bold text-text-primary mb-2">
              {tier.name}
            </h3>
            
            <p className="text-[var(--text-body-sm)] text-text-secondary h-12 mb-6">
              {tier.description}
            </p>
            
            <div className="mb-8">
              <span className="text-display-sm font-bold text-text-primary">{tier.price}</span>
              <span className="text-[var(--text-body-sm)] text-text-muted ml-2">/ {tier.period}</span>
            </div>
            
            <div className="mb-8">
              <Button 
                href={tier.ctaHref} 
                variant={tier.isPopular ? 'primary' : 'outline'} 
                className="w-full justify-center"
              >
                {tier.ctaText}
              </Button>
            </div>
            
            <div className="space-y-4 flex-1">
              {tier.features.map((feature: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-text-muted shrink-0 mt-0.5 opacity-50" />
                  )}
                  <span className={`text-[var(--text-body-sm)] ${feature.included ? 'text-text-primary' : 'text-text-muted line-through opacity-50'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Parallax>
    </motion.div>
  );
}

interface PricingSectionProps {
  pricingData?: any[];
  hideHeader?: boolean;
  className?: string;
}

export function PricingSection({
  pricingData = [],
  hideHeader = false,
  className = "",
}: PricingSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });
  const tiers = pricingData.filter((tier: any) => tier.isActive !== false);

  if (tiers.length === 0) return null;

  return (
    <section
      id="pricing"
      className={`${className ? className : hideHeader ? "pb-16 md:pb-24 pt-4" : "section-padding"} bg-surface-1 border-t border-[var(--color-border)]`}
    >
      <div className="container-site">
        {!hideHeader && (
          <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeading
              title="Transparent Pricing"
              subtitle="No hidden fees, no scope creep. Choose a package that fits your stage, or let's build a custom engagement."
              badge="Pricing"
              align="center"
            />
          </div>
        )}

        <motion.div 
          className={`${hideHeader ? "mt-4" : "mt-8 md:mt-10"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiers.map((tier: any, index: number) => (
            <PricingCard key={tier._id || tier.id || index} tier={tier} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

