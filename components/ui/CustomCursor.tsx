"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable custom cursor on desktop pointer devices
    if (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let ctx = gsap.context(() => {
      // Track mouse position
      const onMouseMove = (e: MouseEvent) => {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(dot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "none",
        });
      };

      // Magnetic / hover states on elements
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive =
          target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest(".interactive");

        if (isInteractive) {
          gsap.to(cursor, {
            scale: 3,
            backgroundColor: "rgba(201, 169, 110, 0.1)", // Gold glow
            border: "1px solid rgba(201, 169, 110, 0.5)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(dot, {
            scale: 0,
            duration: 0.2,
          });
        }
      };

      const handleMouseOut = () => {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          border: "1px solid rgba(17, 17, 17, 0.2)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
        });
      };

      const handleMouseDown = () => {
        gsap.to(cursor, { scale: 0.8, duration: 0.1 });
      };

      const handleMouseUp = () => {
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      };

      // Attach listeners
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseover", handleMouseOver);
      window.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);

      // Initial state setup to hide native cursor
      document.body.style.cursor = "none";
      document.querySelectorAll("a, button, input").forEach((el) => {
        (el as HTMLElement).style.cursor = "none";
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseover", handleMouseOver);
        window.removeEventListener("mouseout", handleMouseOut);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "auto";
      };
    }, cursorRef);

    // Call the cleanup returned from context
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="absolute left-0 top-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20 mix-blend-difference will-change-transform"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent mix-blend-difference will-change-transform"
      />
    </div>
  );
}
