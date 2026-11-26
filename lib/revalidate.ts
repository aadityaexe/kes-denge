import { revalidatePath } from "next/cache";

/**
 * Revalidate affected public pages, home page, and sitemap after an admin mutation.
 */
export function revalidatePublicPages(paths: string[]): void {
  const all = new Set(["/", "/sitemap.xml", ...paths]);
  for (const p of all) {
    try {
      revalidatePath(p);
    } catch {
      // Ignore revalidation errors outside Next request lifecycle (e.g. tests)
    }
  }
}
