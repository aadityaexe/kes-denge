import type { Metadata } from "next";
import { SEO_CONFIG } from "./config";
import { buildCanonicalUrl } from "./canonical";

export interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  absoluteTitle?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogAlt?: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Generates standardized Next.js Metadata API objects with canonical URLs,
 * Open Graph tags, Twitter cards, and optional robots directives.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  ogTitle,
  ogDescription,
  ogAlt,
  keywords,
  ogImage,
  twitterImage,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataInput): Metadata {
  const canonical = path ? buildCanonicalUrl(path) : undefined;
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || description;
  const resolvedOgImage = ogImage || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultOgImage}`;
  const resolvedTwitterImage =
    twitterImage || ogImage || `${SEO_CONFIG.siteUrl}${SEO_CONFIG.defaultTwitterImage}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    ...(canonical
      ? {
          alternates: {
            canonical,
          },
        }
      : {}),
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      ...(canonical ? { url: canonical } : {}),
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
      ...(type === "article" && authors ? { authors } : {}),
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: ogAlt || `${resolvedOgTitle} | ${SEO_CONFIG.siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [resolvedTwitterImage],
    },
  };
}
