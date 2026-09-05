"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Initializes Lenis smooth scroll and registers it as GSAP ScrollTrigger's
 * scroller proxy so all scroll-linked animations stay in sync.
 *
 * Call once in the site layout — not per-section.
 */
export function useLenis() {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let animationId: number;

    const init = async () => {
      const Lenis = (await import("lenis")).default;
      const gsapModule = await import("gsap");
      const gsap = gsapModule.default || gsapModule;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      // Connect Lenis to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return lenisRef;
}
