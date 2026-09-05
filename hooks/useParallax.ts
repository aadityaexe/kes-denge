"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { PARALLAX } from "@/lib/animations";
import { prefersReducedMotion } from "@/lib/utils";

interface ParallaxOptions {
  speed?: number; // Scroll speed multiplier (0–2)
  direction?: "vertical" | "horizontal";
}

/**
 * Multi-layer parallax driven by GSAP ScrollTrigger (scrub).
 * Attach to any element to make it move at a different scroll speed.
 *
 * Disabled below 768px and for prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { speed = PARALLAX.background, direction = "vertical" } = options;

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    // Skip parallax on mobile
    const mql = window.matchMedia("(min-width: 768px)");
    if (!mql.matches) return;

    let ctx: gsap.Context | undefined;

    const element = ref.current;
    if (!element) return;

    const movement = (1 - speed) * 100; // Convert speed to movement amount
    const prop = direction === "vertical" ? "yPercent" : "xPercent";

    ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { [prop]: -movement * 0.5 },
        {
          [prop]: movement * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: element.parentElement || element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, element);

    return () => {
      ctx?.revert();
    };
  }, [speed, direction]);

  return ref;
}
