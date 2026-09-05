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
              className="w-full text-left px-4 sm:px-6 py-3.5 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors min-h-[48px]"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={faqId}
            >
              <span className="text-sm sm:text-base md:text-lg font-semibold text-text-primary pr-2 break-words">
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

            <div
              id={faqId}
              role="region"
              aria-labelledby={faqId}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 text-text-secondary text-sm sm:text-base leading-relaxed border-t border-[var(--color-border)]/50 mt-1 break-words">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
