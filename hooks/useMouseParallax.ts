"use client";

import { useEffect, useRef, type RefObject } from "react";
import { MOUSE_PARALLAX } from "@/lib/animations";
import { lerp, prefersReducedMotion } from "@/lib/utils";

/**
 * Mouse-based parallax for layers within a container.
 * Each layer moves based on pointer position relative to the container center.
 * Used in the hero section for subtle depth.
 *
 * Attach ref to the container. Child elements with data-mouse-speed="0.3"
 * will move at 30% of the pointer offset.
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    // Skip on mobile / touch devices
    const mql = window.matchMedia("(min-width: 768px) and (hover: hover)");
    if (!mql.matches) return;

    const container = ref.current;
    const layers = container.querySelectorAll<HTMLElement>("[data-mouse-speed]");
    if (layers.length === 0) return;

    const state = Array.from(layers).map(() => ({ currentX: 0, currentY: 0 }));
    let targetX = 0;
    let targetY = 0;
    let rafId: number;

    const animate = () => {
      layers.forEach((layer, i) => {
        const speed = parseFloat(layer.dataset.mouseSpeed || "0.3");
        state[i].currentX = lerp(
          state[i].currentX,
          targetX * speed,
          MOUSE_PARALLAX.dampingFactor
        );
        state[i].currentY = lerp(
          state[i].currentY,
          targetY * speed,
          MOUSE_PARALLAX.dampingFactor
        );
        layer.style.transform = `translate(${state[i].currentX}px, ${state[i].currentY}px)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = (e.clientX - centerX) / (rect.width / 2) * MOUSE_PARALLAX.maxDisplacement;
      targetY = (e.clientY - centerY) / (rect.height / 2) * MOUSE_PARALLAX.maxDisplacement;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
      layers.forEach((layer) => {
        layer.style.transform = "";
      });
    };
  }, []);

  return ref;
}
