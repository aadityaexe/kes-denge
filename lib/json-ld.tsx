/**
 * lib/json-ld.ts — Safe JSON-LD helpers
 *
 * JSON.stringify does NOT escape </script> sequences, so putting a schema
 * object that contains DB-sourced text directly into
 *   <script type="application/ld+json">{JSON.stringify(schema)}</script>
 * lets an attacker store   </script><script>alert(1)</script>  in any
 * text field and have it execute on the page.
 *
 * safeJsonLd() escapes the five characters that matter:
 *   < > & U+2028 U+2029
 * so the resulting string is safe to embed between <script> tags.
 *
 * Usage:
 *   import { JsonLd } from "@/lib/json-ld";
 *   <JsonLd data={schema} />
 *
 * Or if you need the raw string:
 *   import { safeJsonLd } from "@/lib/json-ld";
 *   dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
 */

/** Escape a stringified JSON blob for safe embedding in <script type="application/ld+json"> */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** Drop-in React component: renders a <script type="application/ld+json"> safely. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
       
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
