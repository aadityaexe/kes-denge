"use client";

import { useEffect, useRef, type RefObject } from "react";
import { MOUSE_PARALLAX } from "@/lib/animations";
import { lerp, prefersReducedMotion } from "@/lib/utils";

/**
 * Magnetic button effect — element follows cursor within a bounded radius,
 * snapping back with spring easing on mouse leave.
 *
 * Attach ref to the interactive element.
 */
export function useMagneticButton<T extends HTMLElement = HTMLButtonElement>(
  strength: number = 0.3
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;

    const element = ref.current;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId: number;

    const animate = () => {
      currentX = lerp(currentX, targetX, MOUSE_PARALLAX.dampingFactor);
      currentY = lerp(currentY, targetY, MOUSE_PARALLAX.dampingFactor);

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      targetX = Math.max(
        -MOUSE_PARALLAX.maxDisplacement,
        Math.min(MOUSE_PARALLAX.maxDisplacement, deltaX)
      );
      targetY = Math.max(
        -MOUSE_PARALLAX.maxDisplacement,
        Math.min(MOUSE_PARALLAX.maxDisplacement, deltaY)
      );
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
      element.style.transform = "";
    };
  }, [strength]);

  return ref;
}
