"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";

function PricingCard({ tier, index }: { tier: any, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div variants={fadeInUp} className="h-full flex w-full">
      <div className="w-full flex flex-col h-full">
        <div 
          onMouseMove={handleMouseMove}
          className={`
          group overflow-hidden relative flex flex-col w-full h-full rounded-3xl p-6 sm:p-8 transition-all duration-500
          ${tier.isPopular 
            ? 'bg-surface-1 border-2 border-[var(--color-accent)] shadow-2xl md:-translate-y-4' 
            : 'bg-surface-1 border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-surface-2 hover:shadow-xl'
          }
        `}
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  600px circle at ${mouseX}px ${mouseY}px,
                  rgba(201, 169, 110, 0.08),
                  transparent 80%
                )
              `,
            }}
          />
          <div className="relative z-10 flex flex-col h-full w-full">
            {tier.isPopular && (
              <div className="inline-flex w-fit mb-4 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                Most Popular
              </div>
            )}
            
            <h3 className={`text-xl sm:text-2xl font-bold text-text-primary mb-3 break-words ${!tier.isPopular ? 'mt-0 sm:mt-1' : ''}`}>
              {tier.name}
            </h3>
            
            <p className="text-sm sm:text-base text-text-secondary min-h-[3rem] mb-6 sm:mb-8 font-medium break-words leading-relaxed">
              {tier.description}
            </p>
            
            <div className="mb-6 sm:mb-8 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display font-bold text-text-primary tracking-tight break-words">{tier.price}</span>
              <span className="text-sm sm:text-base font-medium text-text-muted">/ {tier.period}</span>
            </div>
            
            <div className="mb-8 w-full">
              <Button 
                href={tier.ctaHref} 
                className={`w-full justify-center h-12 sm:h-14 rounded-full text-sm sm:text-base ${tier.isPopular ? 'bg-text-primary text-white hover:bg-text-secondary shadow-lg' : 'bg-surface-2 text-text-primary border border-[var(--color-border)] hover:bg-surface-3'}`}
              >
                {tier.ctaText}
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 flex-1">
              {tier.features.map((feature: any, i: number) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  {feature.included ? (
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-accent)]" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface-2 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted opacity-50" strokeWidth={2} />
                    </div>
                  )}
                  <span className={`text-sm sm:text-base font-medium ${feature.included ? 'text-text-primary' : 'text-text-muted line-through opacity-50'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
      className={`${className ? className : hideHeader ? "pb-16 md:pb-24 pt-4" : "py-16 sm:py-24 md:py-32"} bg-surface-1 border-t border-[var(--color-border)]`}
    >
      <div className="container-site px-4 sm:px-6 md:px-8 mx-auto">
        {!hideHeader && (
          <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} mb-12 sm:mb-16`}>
            <SectionHeading
              title="Transparent Pricing"
              subtitle="No hidden fees, no scope creep. Choose a package that fits your stage, or let's build a custom engagement."
              badge="Pricing"
              align="center"
            />
          </div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full max-w-7xl mx-auto"
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


