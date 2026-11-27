"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EMPLOYEE_TESTIMONIALS } from "./careers-data";

export function CareersTestimonials() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  return (
    <section className="section-padding border-b border-[var(--color-border)]">
      <div className="container-site space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              Team Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              What our people say.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() =>
                setTestimonialIdx((prev) =>
                  prev === 0 ? EMPLOYEE_TESTIMONIALS.length - 1 : prev - 1
                )
              }
              className="p-2.5 rounded-full border border-[var(--color-border)] bg-surface-1 text-text-primary hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() =>
                setTestimonialIdx((prev) => (prev + 1) % EMPLOYEE_TESTIMONIALS.length)
              }
              className="p-2.5 rounded-full border border-[var(--color-border)] bg-surface-1 text-text-primary hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EMPLOYEE_TESTIMONIALS.map((item, idx) => {
            const isHighlighted = idx === testimonialIdx;
            return (
              <div
                key={item.name}
                className={`rounded-2xl border p-6 sm:p-7 space-y-5 transition-all ${
                  isHighlighted
                    ? "bg-surface-1 border-[var(--color-accent)] shadow-md"
                    : "bg-surface-1 border-[var(--color-border)] opacity-85"
                }`}
              >
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--color-accent-dark)]">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.designation}</p>
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
