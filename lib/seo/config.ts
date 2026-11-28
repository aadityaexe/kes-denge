/**
 * Centralized SEO & Site Configuration for MARK2 (mark2.in)
 */
export const SEO_CONFIG = {
  siteName: "MARK2",
  legalName: "MARK2 Technologies",
  siteUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in").replace(/\/+$/, ""),
  defaultTitle: "MARK2 — We Build Digital Products That Scale",
  titleTemplate: "%s | MARK2",
  defaultDescription:
    "A premier product-engineering agency that ships high-throughput web apps, mobile applications, enterprise ERP platforms, and AI automation for fast-growing businesses.",
  defaultOgImage: "/opengraph-image",
  defaultTwitterImage: "/twitter-image",
  twitterHandle: "@mark2in",
  locale: "en_US",
} as const;
