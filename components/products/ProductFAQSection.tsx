"use client";

import { useState } from "react";
import { ProductFAQItem } from "@/lib/types";
import { ChevronDown, HelpCircle } from "lucide-react";

interface ProductFAQSectionProps {
  faqs?: ProductFAQItem[];
  productName: string;
}

export function ProductFAQSection({
  faqs,
  productName,
}: ProductFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="section-padding border-b border-[var(--color-border)] bg-surface-1">
      <div className="container-site max-w-4xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)]">
            <HelpCircle size={12} className="text-[var(--color-accent)]" />
            Frequently Asked Questions
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-4">
            Technical & Business Questions
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">
            Direct details regarding customization timelines, deployment architectures, data migrations, and licensing.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 md:px-8 py-5 text-left flex items-center justify-between gap-4 hover:bg-surface-2/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-bold font-display text-text-primary">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-[var(--color-accent)] text-surface-1" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <div
                  id={`product-faq-answer-${idx}`}
                  role="region"
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-6 pt-2 text-text-secondary text-sm md:text-base font-light leading-relaxed border-t border-[var(--color-border)]/50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
