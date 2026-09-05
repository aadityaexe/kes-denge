"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface CountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
}

/**
 * Animated counter that counts up when the element scrolls into view.
 * Fires once, does not re-trigger.
 */
export function useCountUp<T extends HTMLElement = HTMLDivElement>(
  options: CountUpOptions
): { ref: RefObject<T | null>; displayValue: string } {
  const { end, duration = 2000, suffix = "" } = options;
  const ref = useRef<T>(null);
  // SSR & initial static fallback displays target value to prevent crawler zero-indexing and layout shift
  const [displayValue, setDisplayValue] = useState(`${end}${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    if (prefersReducedMotion()) {
      setDisplayValue(`${end}${suffix}`);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.disconnect();

            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * end);

              setDisplayValue(`${current}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [end, duration, suffix]);

  return { ref, displayValue };
}
