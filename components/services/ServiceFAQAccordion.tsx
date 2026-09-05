"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { ServiceFAQItem } from "@/lib/types";

interface ServiceFAQAccordionProps {
  faqs: ServiceFAQItem[];
  serviceTitle: string;
}

export function ServiceFAQAccordion({ faqs, serviceTitle }: ServiceFAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const faqId = `service-faq-${index}`;

        return (
          <div
            key={index}
            className="border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-surface-1 overflow-hidden transition-all duration-300 hover:border-[var(--color-border-accent)] hover:shadow-sm"
          >
            <button
              type="button"
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={faqId}
            >
              <span className="text-base sm:text-lg font-semibold text-text-primary pr-2">
                {faq.question}
              </span>
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? "bg-[var(--color-accent)] text-surface-1 rotate-180"
                    : "bg-surface-2 text-text-muted hover:text-text-primary"
                }`}
              >
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={faqId}
                  role="region"
                  aria-labelledby={faqId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                >
                  <div className="px-6 pb-6 pt-1 text-text-secondary text-sm sm:text-base leading-relaxed border-t border-[var(--color-border)]/50 mt-1">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
