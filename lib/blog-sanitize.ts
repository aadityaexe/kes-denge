/**
 * lib/blog-sanitize.ts — Safe HTML sanitizer for blog/rich-text content
 *
 * Uses sanitize-html to allow an allowlist of article-safe tags and
 * attributes only. All inline event handlers, javascript: URLs,
 * data: URIs, and <script>/<style> tags are stripped.
 *
 * Call sanitizeBlogContent() on WRITE (admin POST/PUT) to scrub on the
 * way in. The same function is safe to call on render as a defence-in-depth
 * measure, but storing clean content is the primary protection.
 */

import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  // Block
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "blockquote", "pre", "code",
  "ul", "ol", "li",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "br",
  "div", "section", "article", "figure", "figcaption",
  // Inline
  "a", "strong", "b", "em", "i", "u", "s", "del",
  "mark", "sub", "sup", "small",
  "span", "abbr", "cite", "kbd",
  // Media
  "img",
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] = {
  // Allow class / id for styling hooks (never security-relevant in HTML)
  "*": ["class", "id"],
  a: [
    "href", "title", "target", "rel",
    // Never allow javascript: or data: on links — enforced below
  ],
  img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
  blockquote: ["cite"],
  abbr: ["title"],
};

/**
 * Sanitize HTML content intended for blog article bodies.
 * Strips all inline event handlers, javascript:/data: URLs, <script>, <style>.
 */
export function sanitizeBlogContent(html: string): string {
  if (!html || typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    // Force safe link attributes
    transformTags: {
      a: (_tagName, attribs) => {
        const nextAttribs: sanitizeHtml.Attributes = {
          ...attribs,
          rel: "noopener noreferrer",
        };
        if (attribs.href?.startsWith("/")) {
          delete nextAttribs.target;
        } else {
          nextAttribs.target = "_blank";
        }
        return {
          tagName: "a",
          attribs: nextAttribs,
        };
      },
    },
    // Strip the entire tag + contents for disallowed tags (not just the wrapper)
    disallowedTagsMode: "discard",
    // Remove all empty tags that may have been used to smuggle payloads
    exclusiveFilter: (frame) =>
      !frame.text.trim() &&
      ["script", "style", "iframe", "object", "embed"].includes(frame.tag),
  });
}
