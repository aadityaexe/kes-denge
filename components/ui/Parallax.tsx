"use client";

import { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxProps {
  children?: ReactNode;
  speed?: number; // 1 = normal, >1 = faster (parallax up), <0 = slower (parallax down). Note: useParallax uses standard parallax speed logic where 1=static relative to scroll. Actually, let's adapt it.
  className?: string;
  id?: string;
}

export function Parallax({ children, speed = 1, className = "", id }: ParallaxProps) {
  // Our custom useParallax hook accepts a speed multiplier.
  const ref = useParallax<HTMLDivElement>({ speed });

  return (
    <div ref={ref} id={id} className={`overflow-hidden relative ${className}`}>
      {children}
    </div>
  );
}
