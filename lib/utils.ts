// ============================================================
// MARK 2 — Utility Functions
// ============================================================

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Check if we're running on the client side
 */
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isClient()) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Parse an integer query param clamped to [min, max] with a default fallback
 */
export function parseBoundedInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number
): number {
  const parsed = parseInt(value || "", 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(min, parsed), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
