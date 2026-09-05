"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/Button";
import { Parallax } from "@/components/ui/Parallax";

// Dynamically import the 3D scene so it doesn't block initial render or SSR
const Scene = dynamic(
  () => import("@/components/3d/Scene").then((mod) => ({ default: mod.Scene })),
  { ssr: false }
);

function Stat({ label, value, suffix, index }: { label: string; value: number; suffix: string, index: number }) {
  const { ref, displayValue } = useCountUp({ end: value, duration: 2000 });

  return (
    <div className="stat-item flex flex-col gap-1 opacity-0 translate-y-4">
      <div ref={ref} className="text-display-md font-bold text-text-primary font-display">
        {displayValue}{suffix}
      </div>
      <div className="text-[var(--text-body-sm)] text-text-muted font-medium">
        {label}
      </div>
    </div>
  );
}

interface HeroSectionProps {
  settingsData?: any;
}

export function HeroSection({ settingsData }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const badgeText = settingsData?.hero?.badge || "Digital Product Agency";
  const headlineText = settingsData?.hero?.headline || "Engineering The Future.";
  const subheadlineText = settingsData?.hero?.subheadline || settingsData?.description || "We engineer ultra-premium web applications, mobile platforms, and AI systems for ambitious luxury brands and high-growth startups.";
  const ctaPrimaryText = settingsData?.hero?.ctaPrimaryText || "Start Your Project";
  const ctaPrimaryHref = settingsData?.hero?.ctaPrimaryHref || "/contact";
  const ctaSecondaryText = settingsData?.hero?.ctaSecondaryText || "View Our Work";
  const ctaSecondaryHref = settingsData?.hero?.ctaSecondaryHref || "/portfolio";
  const heroStats = Array.isArray(settingsData?.stats) ? settingsData.stats : [];
  
  useEffect(() => {
    let hasAnimated = false;

    const runHeroAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.1
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.2
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.35
        );
      }

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.5
        );
      }

      tl.fromTo(
        ".stat-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        0.65
      );
    };

    // If preloader is already completed or skipped
    if (typeof window !== "undefined" && (window as any).__MARK_PRELOADER_DONE__) {
      runHeroAnimation();
    } else {
      const handlePreloaderReveal = () => {
        runHeroAnimation();
      };
      window.addEventListener("mark:preloader-reveal", handlePreloaderReveal);

      // Fallback timer in case preloader was skipped or event missed
      const fallback = setTimeout(() => {
        runHeroAnimation();
      }, 2600);

      return () => {
        window.removeEventListener("mark:preloader-reveal", handlePreloaderReveal);
        clearTimeout(fallback);
      };
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden border-b border-[var(--color-border)]"
    >
      {/* Background Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.5} className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[var(--color-accent)]/5 to-transparent blur-[120px]" />
        <Parallax speed={0.2} className="absolute bottom-1/4 -right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-blue-500/5 to-transparent blur-[100px]" />
      </div>

      {/* Lightweight 3D scene — renders only here, not globally */}
      <Scene />

      <Parallax speed={1.1} className="container-site relative z-10 w-full flex flex-col items-center text-center">
        <div className="max-w-4xl w-full">
          
          <div ref={badgeRef} className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-surface-1/50 backdrop-blur-md opacity-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">{badgeText}</span>
          </div>

          <h1 
            ref={headlineRef}
            className="font-display text-[clamp(3.5rem,8vw,7.5rem)] text-text-primary tracking-tight mb-8 leading-[1.02] opacity-0"
          >
            {headlineText.includes(".") ? (
              <>
                {headlineText.split(".")[0]} <br />
                <span className="text-[var(--color-accent)] italic font-light">{headlineText.split(".")[1] || "."}</span>
              </>
            ) : (
              headlineText
            )}
          </h1>
          
          <p 
            ref={copyRef}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 md:mb-12 opacity-0 font-light leading-relaxed"
          >
            {subheadlineText}
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center gap-4 mb-10 md:mb-12 opacity-0"
          >
            <Button size="lg" href={ctaPrimaryHref} className="rounded-full px-8 bg-text-primary text-surface-1 hover:bg-text-secondary">
              {ctaPrimaryText}
            </Button>
            <Button size="lg" variant="outline" href={ctaSecondaryHref} className="rounded-full px-8 border-[var(--color-border)] hover:bg-surface-2">
              {ctaSecondaryText}
            </Button>
          </div>
          
          {/* Stats */}
          {heroStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[var(--color-border)] w-full">
              {heroStats.map((stat: any, i: number) => (
                <Stat 
                  key={stat._id || stat.id || i} 
                  index={i} 
                  label={stat.label}
                  value={typeof stat.value === "number" ? stat.value : Number(stat.value) || 0}
                  suffix={stat.suffix || "+"}
                />
              ))}
            </div>
          )}
        </div>
      </Parallax>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted/50 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-text-muted/50 to-transparent" />
      </div>
    </section>
  );
}


