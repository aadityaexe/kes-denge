"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function FooterMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    const ctx = gsap.context(() => {
      const marqueeContent = marqueeRef.current?.firstElementChild as HTMLElement | null;
      if (!marqueeContent) return;
      
      // Clone for seamless loop if not already cloned
      if (marqueeRef.current && marqueeRef.current.children.length === 1) {
        const clone = marqueeContent.cloneNode(true);
        marqueeRef.current.appendChild(clone);
      }

      gsap.to(marqueeRef.current!.children, {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full border-y border-[var(--color-border)] py-3 sm:py-4 mb-8 relative flex overflow-hidden whitespace-nowrap bg-surface-2">
      <div ref={marqueeRef} className="flex">
        <div className="flex items-center gap-6 sm:gap-12 px-4 sm:px-6">
          <span className="text-display-md font-display italic text-text-primary/20">DIGITAL EXCELLENCE</span>
          <span className="text-xl text-text-primary/10">✦</span>
          <span className="text-display-md font-display italic text-text-primary/20">SCALABLE ARCHITECTURE</span>
          <span className="text-xl text-text-primary/10">✦</span>
          <span className="text-display-md font-display italic text-text-primary/20">PREMIUM DESIGN</span>
          <span className="text-xl text-text-primary/10">✦</span>
          <span className="text-display-md font-display italic text-text-primary/20">AI AUTOMATION</span>
          <span className="text-xl text-text-primary/10">✦</span>
        </div>
      </div>
    </div>
  );
}
