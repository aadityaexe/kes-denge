"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const phases = [
  { index: "01", label: "Architecture", desc: "Foundations & Scalable Systems" },
  { index: "02", label: "Engineering", desc: "High-Performance Digital Products" },
  { index: "03", label: "Innovation", desc: "AI Automation & Modern Infrastructure" },
  { index: "04", label: "MARK", desc: "We Build Digital Products That Scale" },
];

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<SVGSVGElement>(null);
  const innerDiamondRef = useRef<SVGGElement>(null);
  const phaseListRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only execute preloader on home page
    if (pathname !== "/") {
      if (typeof window !== "undefined") {
        (window as any).__MARK_PRELOADER_DONE__ = true;
      }
      setIsLoading(false);
      return;
    }

    // Lock body scroll during preloading animation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const counterObj = { value: 0 };
    const masterTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = "";
        if (typeof window !== "undefined") {
          (window as any).__MARK_PRELOADER_DONE__ = true;
        }
        setIsLoading(false);
      },
    });

    // 1. Continuous Precision Dual-Rotation of Emblem
    if (outerRingRef.current) {
      gsap.to(outerRingRef.current, {
        rotation: 360,
        duration: 16,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }

    if (innerDiamondRef.current) {
      gsap.to(innerDiamondRef.current, {
        rotation: -360,
        duration: 9,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
    }

    // 2. Smooth Continuous Progress Bar & Numeric Counter
    masterTl.to(
      progressFillRef.current,
      {
        width: "100%",
        duration: 2.2,
        ease: "power2.inOut",
      },
      0
    );

    masterTl.to(
      counterObj,
      {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            const val = Math.floor(counterObj.value);
            counterRef.current.textContent =
              val < 10 ? `00${val}` : val < 100 ? `0${val}` : `${val}`;
          }
        },
      },
      0
    );

    // 3. Sequential Phase Word Transitions
    if (phaseListRef.current) {
      const items = phaseListRef.current.children;
      gsap.set(items, { y: 55, opacity: 0, scale: 0.96 });

      for (let i = 0; i < items.length; i++) {
        const isLast = i === items.length - 1;
        const holdTime = isLast ? 0.8 : 0.22;

        // Slide into view with subtle perspective
        masterTl.to(
          items[i],
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.36,
            ease: "power3.out",
            onStart: () => {
              if (descRef.current) {
                descRef.current.textContent = phases[i].desc;
                gsap.fromTo(
                  descRef.current,
                  { opacity: 0, y: 8 },
                  { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                );
              }
            },
          },
          i === 0 ? 0.12 : "-=0.1"
        );

        // Slide up out of view
        if (!isLast) {
          masterTl.to(
            items[i],
            {
              y: -45,
              opacity: 0,
              scale: 0.96,
              duration: 0.24,
              ease: "power2.in",
            },
            `+=${holdTime}`
          );
        }
      }
    }

    // 4. Grand Curtain Reveal:
    // First, fade and lift content
    masterTl.to(
      contentRef.current,
      {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.38,
        ease: "power2.in",
      },
      "+=0.08"
    );

    // Awaken Hero Section exactly as curtain begins opening
    masterTl.add(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("mark:preloader-reveal"));
      }
    }, "-=0.05");

    // Next, slide up the 4 architectural shutter panels with staggered wave
    masterTl.to(
      ".shutter-panel",
      {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
        stagger: 0.08,
      },
      "-=0.1"
    );

    return () => {
      masterTl.kill();
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = "";
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] pointer-events-auto overflow-hidden select-none"
    >
      {/* 4 Architectural Shutter Panels that slide up on exit */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="shutter-panel flex-1 bg-white border-r border-[var(--color-border)]/40 h-full shadow-2xl" />
        <div className="shutter-panel flex-1 bg-white border-r border-[var(--color-border)]/40 h-full shadow-2xl" />
        <div className="shutter-panel flex-1 bg-white border-r border-[var(--color-border)]/40 h-full shadow-2xl" />
        <div className="shutter-panel flex-1 bg-white h-full shadow-2xl" />
      </div>

      {/* Atmospheric Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {/* Soft Champagne Ambient Radiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle,_rgba(201,169,110,0.16)_0%,_transparent_70%)] rounded-full blur-[100px]" />
        {/* Fine Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-80" />
      </div>

      {/* Content Layer (Fades right as shutters open) */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-12 text-text-primary"
      >
        {/* Top Header Row: Matching Site Navbar Luxury Feel */}
        <div className="flex items-center justify-between w-full text-[11px] sm:text-xs font-mono tracking-widest text-text-muted uppercase border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
            </span>
            <span className="text-text-primary font-bold tracking-tight font-display text-sm">
              M<span className="text-[var(--color-accent-dark)]">ARK</span>
            </span>
            <span className="text-text-muted/40">•</span>
            <span className="text-[10px] tracking-widest text-text-secondary">TECHNOLOGIES</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">EST. 2024</span>
            <span className="hidden sm:inline text-text-muted/40">•</span>
            <span className="text-[var(--color-accent-dark)] font-semibold tracking-wider">
              BESPOKE DIGITAL PRODUCTS
            </span>
          </div>
        </div>

        {/* Center Stage: Rotating Monogram Emblem & Animated Phase Words */}
        <div className="flex flex-col items-center justify-center my-auto text-center px-4">
          
          {/* Luxury Geometric Orbit Emblem */}
          <div className="relative mb-8 flex items-center justify-center">
            {/* Ambient Back Glow */}
            <div className="absolute w-24 h-24 rounded-full bg-[var(--color-accent)]/20 blur-xl pointer-events-none" />

            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--color-accent)] drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
            >
              {/* Outer Dashed Compass Ring */}
              <circle
                ref={outerRingRef as any}
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                className="opacity-40"
              />

              {/* Middle Static Precision Ring with Corner Accents */}
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-50"
              />
              <line x1="50" y1="8" x2="50" y2="14" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
              <line x1="50" y1="86" x2="50" y2="92" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
              <line x1="8" y1="50" x2="14" y2="50" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
              <line x1="86" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />

              {/* Inner Faceted Diamond Rotating in Reverse */}
              <g ref={innerDiamondRef}>
                <polygon
                  points="50,22 78,50 50,78 22,50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="opacity-90"
                />
                <circle cx="50" cy="22" r="2" fill="currentColor" />
                <circle cx="78" cy="50" r="2" fill="currentColor" />
                <circle cx="50" cy="78" r="2" fill="currentColor" />
                <circle cx="22" cy="50" r="2" fill="currentColor" />
              </g>

              {/* Center Core Monogram Dot */}
              <circle cx="50" cy="50" r="4.5" fill="currentColor" className="opacity-95" />
              <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.75" className="opacity-60" />
            </svg>
          </div>

          {/* Phase Typography Cycler */}
          <div
            ref={phaseListRef}
            className="relative h-20 sm:h-28 w-full max-w-3xl overflow-hidden flex items-center justify-center"
          >
            {phases.map((phase, i) => {
              const isBrand = phase.label === "MARK";
              return (
                <div
                  key={i}
                  className="absolute flex items-center gap-3 sm:gap-5 whitespace-nowrap text-center"
                >
                  <span className="font-mono text-xs sm:text-sm text-[var(--color-accent-dark)] tracking-widest uppercase font-semibold">
                    [{phase.index} / 04]
                  </span>

                  {isBrand ? (
                    <div className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-text-primary">
                      M
                      <span className="text-[var(--color-accent-dark)] font-display italic font-normal">
                        ARK
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-5xl md:text-6xl font-display font-semibold tracking-tight text-text-primary">
                      {phase.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dynamic Subtitle / Description */}
          <p
            ref={descRef}
            className="h-6 mt-4 text-xs sm:text-sm text-text-secondary tracking-widest font-mono uppercase transition-all duration-300"
          >
            Foundations & Scalable Systems
          </p>
        </div>

        {/* Bottom Row: Linear Progress Bar & Large Technical Counter */}
        <div className="w-full pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:max-w-md">
            <div className="relative flex-1 h-[2.5px] bg-surface-3 rounded-full overflow-hidden">
              <div
                ref={progressFillRef}
                className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[var(--color-accent-light)] via-[var(--color-accent)] to-[var(--color-accent-dark)] shadow-[0_0_12px_var(--color-accent)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-text-muted">
            <span className="hidden md:inline uppercase text-[10px] text-text-muted tracking-wider">
              INITIALIZING EXPERIENCE
            </span>
            <div className="flex items-center gap-1 text-text-primary font-bold">
              <span className="text-text-muted text-xs">[</span>
              <span
                ref={counterRef}
                className="w-11 text-center text-sm font-mono text-[var(--color-accent-dark)] font-bold tabular-nums"
              >
                000
              </span>
              <span className="text-text-muted text-xs">% ]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
