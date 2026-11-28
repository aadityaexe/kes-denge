import { SEO_CONFIG } from "./config";

/**
 * Builds a normalized, self-referencing canonical HTTPS URL for a given path.
 * Strips trailing slashes (except root) and query parameters.
 */
export function buildCanonicalUrl(path: string = "/"): string {
  const base = SEO_CONFIG.siteUrl.replace(/\/+$/, "");
  const cleanPath = path.split("?")[0].split("#")[0];
  if (!cleanPath || cleanPath === "/") {
    return base;
  }
  const normalized = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${base}${normalized.replace(/\/+$/, "")}`;
}
