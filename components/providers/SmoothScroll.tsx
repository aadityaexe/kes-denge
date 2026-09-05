"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Central GSAP ScrollTrigger Registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GsapLenisIntegration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    
    // 1. Pathname change handling
    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
    
    // Refresh ScrollTrigger to recalculate positions after route change
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams, lenis]);

  useEffect(() => {
    if (!lenis) return;

    // 2. Wire Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    
    // Sync GSAP ticker with Lenis raf
    const updateGSAP = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateGSAP);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(updateGSAP);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Disable smooth scroll interception completely for admin pages to guarantee native scrolling
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) {
    return <>{children}</>;
  }

  const LenisProvider = ReactLenis as any;
  return (
    <LenisProvider root autoRaf={false} options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <Suspense fallback={null}>
        <GsapLenisIntegration />
      </Suspense>
      {children}
    </LenisProvider>
  );
}
