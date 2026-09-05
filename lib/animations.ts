// ============================================================
// Kas Denge Technologies — Animation Constants & Utilities
// ============================================================

// Shared easing curve — used everywhere for consistency
// GSAP: "power3.out" equivalent
// CSS: cubic-bezier(0.33, 1, 0.68, 1)
// Framer Motion: [0.33, 1, 0.68, 1]

export const EASE = {
  // Primary easing — entrances, reveals, slides
  out: "expo.out" as const,
  outCubicBezier: "cubic-bezier(0.16, 1, 0.3, 1)",
  outFramer: [0.16, 1, 0.3, 1] as const,

  // Spring for interactive elements (magnetic buttons, snaps)
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
  springBouncy: { type: "spring" as const, stiffness: 300, damping: 20 },
};

// Duration constants (seconds)
export const DURATION = {
  fast: 0.4,
  normal: 0.8, // Increased for a more luxurious, smooth entry
  slow: 1.2,
  pageTransition: 0.5,
  staggerItem: 0.1, // More distinct stagger
  staggerColumn: 0.15,
};

// Parallax speeds for layered depth
export const PARALLAX = {
  background: 0.25, // ~0.2–0.3x scroll speed (furthest)
  midground: 0.55, // ~0.5–0.6x scroll speed
  foreground: 1.05, // ~1.05x scroll speed (content lift)
};

// Mouse parallax constraints
export const MOUSE_PARALLAX = {
  maxDisplacement: 18, // px — max 15–20px
  dampingFactor: 0.08, // lerp factor
};

// ScrollTrigger defaults
export const SCROLL_TRIGGER = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse" as const,
};

// Directional entrance defaults
export const DIRECTIONAL_ENTRANCE = {
  distance: 50, // 40–60px horizontal translate
  opacity: { from: 0, to: 1 },
};

// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.outFramer },
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE.outFramer },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: DURATION.staggerItem,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE.outFramer },
  },
};
