"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

interface FAQSectionProps {
  faqsData?: any[];
}

export function FAQSection({ faqsData = [] }: FAQSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = faqsData.filter((item: any) => item.isActive !== false);

  if (items.length === 0) return null;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-background border-t border-[var(--color-border)]">
      <div className="container-site max-w-4xl">
        <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our process, pricing, and how we work."
            align="center"
          />
        </div>

        <div className="mt-6 md:mt-8 flex flex-col gap-4">
          {items.map((item: any, index: number) => {
            const isOpen = openIndex === index;
            const itemId = item._id || item.id || index;
            
            return (
              <div 
                key={itemId} 
                className="border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-surface-1 overflow-hidden transition-colors hover:border-[var(--color-border-accent)]"
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-6 focus:outline-none focus:bg-surface-2 transition-colors"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${itemId}`}
                >
                  <span className="text-[var(--text-heading-xs)] font-semibold text-text-primary">
                    {item.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-text-muted'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${itemId}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-[var(--text-body-md)] text-text-secondary leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

