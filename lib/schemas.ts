import { z } from "zod";

/**
 * Validate that a URL is either a relative path ("/...") or an http(s) URL.
 * Rejects javascript:, data:, vbscript:, file:, etc.
 */
export function isSafeUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return true; // empty string is allowed for optional fields
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitize a URL for safe use in href/src at render time.
 * Returns "#" if the URL has a dangerous scheme.
 */
export function safeHref(url: unknown, fallback = "#"): string {
  if (typeof url !== "string" || !url.trim()) return fallback;
  return isSafeUrl(url) ? url.trim() : fallback;
}

export const safeUrlString = (maxLength = 1000) =>
  z
    .string()
    .max(maxLength)
    .refine((val) => isSafeUrl(val), {
      message: "URL must be a relative path or use http/https protocol",
    });

export const safeOptionalUrlString = (maxLength = 1000) =>
  safeUrlString(maxLength).optional().or(z.literal(""));

export const settingsUpdateSchema = z
  .object({
    siteName: z.string().trim().min(1).max(100).optional(),
    tagline: z.string().trim().max(300).optional(),
    description: z.string().trim().max(1000).optional(),
    logoUrl: safeOptionalUrlString(1000),
    faviconUrl: safeOptionalUrlString(1000),
    contactEmail: z.string().trim().email().max(254).optional().or(z.literal("")),
    contactPhone: z.string().trim().max(50).optional(),
    address: z.string().trim().max(500).optional(),
    googleMapsUrl: safeOptionalUrlString(1000),
    socialLinks: z
      .object({
        linkedin: safeOptionalUrlString(500),
        github: safeOptionalUrlString(500),
        twitter: safeOptionalUrlString(500),
        instagram: safeOptionalUrlString(500),
        facebook: safeOptionalUrlString(500),
      })
      .strict()
      .optional(),
    hero: z
      .object({
        badge: z.string().trim().max(120).optional(),
        headline: z.string().trim().max(300).optional(),
        subheadline: z.string().trim().max(1000).optional(),
        ctaPrimaryText: z.string().trim().max(100).optional(),
        ctaPrimaryHref: safeOptionalUrlString(500),
        ctaSecondaryText: z.string().trim().max(100).optional(),
        ctaSecondaryHref: safeOptionalUrlString(500),
      })
      .strict()
      .optional(),
    about: z
      .object({
        subtitle: z.string().trim().max(1000).optional(),
        mission: z.string().trim().max(1000).optional(),
        vision: z.string().trim().max(1000).optional(),
        story: z.string().trim().max(5000).optional(),
      })
      .strict()
      .optional(),
    seo: z
      .object({
        defaultTitle: z.string().trim().max(200).optional(),
        defaultDescription: z.string().trim().max(500).optional(),
        keywords: z.array(z.string().trim().max(100)).max(50).optional(),
        ogImageUrl: safeOptionalUrlString(1000),
      })
      .strict()
      .optional(),
    stats: z
      .array(
        z
          .object({
            _id: z.string().optional(),
            label: z.string().trim().min(1).max(100),
            value: z.coerce.number().finite(),
            suffix: z.string().trim().max(20).optional().default("+"),
          })
          .strict()
      )
      .max(20)
      .optional(),
    whyChooseUs: z
      .array(
        z
          .object({
            _id: z.string().optional(),
            title: z.string().trim().min(1).max(150),
            description: z.string().trim().min(1).max(1000),
            icon: z.string().trim().min(1).max(100),
          })
          .strict()
      )
      .max(20)
      .optional(),
    processSteps: z
      .array(
        z
          .object({
            _id: z.string().optional(),
            number: z.coerce.number().int().min(1).max(100),
            title: z.string().trim().min(1).max(150),
            description: z.string().trim().min(1).max(1000),
            icon: z.string().trim().min(1).max(100),
          })
          .strict()
      )
      .max(20)
      .optional(),
    technologies: z
      .array(
        z
          .object({
            _id: z.string().optional(),
            name: z.string().trim().min(1).max(100),
            icon: z.string().trim().max(500).optional().default(""),
            category: z.enum([
              "frontend",
              "backend",
              "database",
              "devops",
              "mobile",
              "language",
            ]),
          })
          .strict()
      )
      .max(50)
      .optional(),
    footer: z
      .object({
        copyrightText: z.string().trim().max(300).optional(),
        disclaimer: z.string().trim().max(500).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
