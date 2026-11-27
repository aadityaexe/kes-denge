"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CAREER_FAQS } from "./careers-data";

export function CareersFAQ() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <section className="section-padding bg-surface-2/40">
      <div className="container-site max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {CAREER_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.question}
                className="bg-surface-1 border border-[var(--color-border)] rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-display font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[var(--color-accent-dark)]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-text-secondary leading-relaxed border-t border-[var(--color-border)] pt-3">
                        {faq.answer}
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
