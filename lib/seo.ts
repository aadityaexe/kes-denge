import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
export const BRAND_NAME = "MARK Technologies";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

interface BuildMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
  isRoot?: boolean;
}

/**
 * Standardized metadata builder to guarantee Title, Description,
 * Canonical URL, OpenGraph, and Twitter tags are always unified
 * and stay in lockstep across all routes with zero stale tags.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
  isRoot = false,
}: BuildMetadataParams): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = isRoot ? SITE_URL : `${SITE_URL}${cleanPath}`;
  const fullTitle = isRoot ? title : `${title} | ${BRAND_NAME}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title: isRoot ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      type,
      locale: "en_US",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
