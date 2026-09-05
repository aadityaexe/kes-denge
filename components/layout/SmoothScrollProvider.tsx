"use client";

import { useLenis } from "@/hooks/useLenis";
import { type ReactNode } from "react";

/**
 * Wraps the site to initialize Lenis smooth scroll.
 * Must be a client component. Placed in the site layout.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
