"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { EASE, DURATION, SCROLL_TRIGGER, DIRECTIONAL_ENTRANCE } from "@/lib/animations";
import { prefersReducedMotion } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealOptions {
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  toggleActions?: string;
  childSelector?: string;
}

/**
 * Reusable GSAP ScrollTrigger reveal animation.
 * Supports directional slides (up/down/left/right) with fade.
 * Falls back to immediate visibility for prefers-reduced-motion.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the container element
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): { ref: RefObject<T | null>; isVisible: boolean } {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    direction = "up",
    distance = 30,
    duration = DURATION.normal,
    delay = 0,
    stagger = 0,
    start = SCROLL_TRIGGER.start,
    toggleActions = SCROLL_TRIGGER.toggleActions,
    childSelector,
  } = options;

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let ctx: ReturnType<typeof import("gsap").default.context> | undefined;

    const init = async () => {
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule;
      await import("gsap/ScrollTrigger");

      const element = ref.current;
      if (!element) return;

      const targets = childSelector
        ? element.querySelectorAll(childSelector)
        : element;

      if (childSelector && (targets as NodeListOf<Element>).length === 0) {
        setIsVisible(true);
        return;
      }

      const fromVars: Record<string, number> = { opacity: 0 };
      const toVars: Record<string, number | string> = { opacity: 1 };

      switch (direction) {
        case "up":
          fromVars.y = distance;
          toVars.y = 0;
          break;
        case "down":
          fromVars.y = -distance;
          toVars.y = 0;
          break;
        case "left":
          fromVars.x = distance;
          toVars.x = 0;
          break;
        case "right":
          fromVars.x = -distance;
          toVars.x = 0;
          break;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(targets, fromVars, {
          ...toVars,
          duration,
          delay,
          stagger: stagger || 0,
          ease: EASE.out,
          scrollTrigger: {
            trigger: element,
            start,
            toggleActions,
            onEnter: () => setIsVisible(true),
          },
        });
      }, element);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, [direction, distance, duration, delay, stagger, start, toggleActions, childSelector]);

  return { ref, isVisible };
}
