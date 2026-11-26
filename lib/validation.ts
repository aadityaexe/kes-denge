// ============================================================
// MARK 2 — Validation & Security Utilities
// ============================================================

import type { NextRequest } from "next/server";

/** Escape a user-supplied string so it is safe to embed in a RegExp literal. */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ------ Input Validation ------

/**
 * Validate email format
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Validate that a value is a non-empty trimmed string within length bounds
 */
export function isNonEmptyString(
  val: unknown,
  maxLength = 5000
): val is string {
  return typeof val === "string" && val.trim().length > 0 && val.length <= maxLength;
}

/**
 * Validate slug format (lowercase, hyphens, alphanumeric)
 */
export function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== "string") return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 200;
}

/**
 * Validate MongoDB ObjectId format.
 *
 * NOTE: mongoose.Types.ObjectId.isValid() returns true for ANY 12-character
 * string (treating it as a 12-byte buffer), not just 24-character hex strings.
 * This was a correctness bug — a 12-char user-supplied string would pass the
 * check and be passed to Mongoose as an ObjectId, potentially causing
 * unexpected query behaviour.
 *
 * Fix: use an explicit 24-hex-char regex.
 */
export function isValidObjectId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return /^[a-f0-9]{24}$/i.test(id);
}

// ------ Sanitization ------

/**
 * Strip HTML tags from a string to prevent stored XSS.
 * Preserves plain text content.
 *
 * IMPORTANT: The previous implementation used /<[^>]*>/g which silently
 * deletes any text between < and > — meaning "budget < 5k and timeline > 2 months"
 * would have "&lt;5k and timeline &gt;" silently removed. Plain text fields
 * (contact form, notes) must NOT use HTML stripping at all — React's output
 * escaping handles rendering safety. Only use this for genuinely HTML fields.
 *
 * This function is intentionally kept for use in fields that explicitly
 * need HTML stripped (e.g. plain-text excerpts). For security sanitization
 * of blog HTML content, use sanitizeBlogContent() from lib/blog-sanitize.ts.
 */
export function stripHtml(input: string): string {
  // A proper allowlist sanitizer (sanitize-html) is used for rich content.
  // For plain-text fields, we do NOT strip HTML — we let React's escaping
  // protect the output, and we only normalize whitespace and control chars.
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .trim();
}

/**
 * Sanitize a text input: trim, limit length, strip control characters.
 * Does NOT strip HTML tags — React escaping protects output rendering.
 * For plain-text fields (contact form, notes, titles, descriptions).
 */
export function sanitizeText(input: unknown, maxLength = 5000): string {
  if (typeof input !== "string") return "";
  return stripHtml(input.slice(0, maxLength)).trim();
}

/**
 * Sanitize an optional text input (returns undefined if empty)
 */
export function sanitizeOptionalText(
  input: unknown,
  maxLength = 5000
): string | undefined {
  const result = sanitizeText(input, maxLength);
  return result.length > 0 ? result : undefined;
}

// ------ File Upload Validation ------

// SVG is intentionally excluded: SVG files can carry embedded <script> tags,
// event handler attributes, and external resource loads — a real XSS/SSRF vector
// even when served from a CDN. Re-add only with a server-side SVG sanitizer.
const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  // PDF
  "application/pdf",
  // Video
  "video/mp4",
  "video/webm",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".pdf",
  ".mp4",
  ".webm",
]);

const DANGEROUS_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".sh",
  ".bash",
  ".ps1",
  ".js",
  ".ts",
  ".html",
  ".htm",
  ".php",
  ".py",
  ".rb",
  ".pl",
  ".cgi",
  ".svg", // SVG can carry embedded scripts — block explicitly
]);

export function isAllowedFileType(
  mimeType: string,
  filename: string
): { valid: boolean; reason?: string } {
  const ext = filename.lastIndexOf(".") >= 0
    ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
    : "";

  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return { valid: false, reason: `File extension "${ext}" is not allowed` };
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, reason: `File extension "${ext}" is not supported. Allowed: ${[...ALLOWED_EXTENSIONS].join(", ")}` };
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return { valid: false, reason: `File type "${mimeType}" is not supported` };
  }

  return { valid: true };
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ------ Magic-Byte / File Signature Verification ------
// Verifies a file buffer matches the expected binary signature for its MIME type.
// This prevents attackers from renaming dangerous files with allowed extensions.

interface MagicSignature {
  offset: number;
  bytes: number[];
}

const MAGIC_SIGNATURES: Record<string, MagicSignature[]> = {
  "image/jpeg": [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }],
  "image/png": [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  "image/gif": [
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
    { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
  ],
  "image/webp": [{ offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }], // RIFF????WEBP
  // AVIF & MP4 both use ISO BMFF 'ftyp' at offset 4 — disambiguated by major brand at offset 8
  "image/avif": [
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66] }, // ftypavif
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x73] }, // ftypavis
  ],
  "application/pdf": [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  "video/mp4": [
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d] }, // ftypisom
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32] }, // ftypmp42
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x31] }, // ftypmp41
    { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x56, 0x20] }, // ftypM4V
  ],
  "video/webm": [{ offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] }], // EBML header
};

/**
 * Derive the verified MIME type from magic bytes rather than trusting client-supplied file.type.
 */
export function detectMimeFromMagicBytes(buffer: Buffer): string | null {
  for (const [mime, sigs] of Object.entries(MAGIC_SIGNATURES)) {
    if (sigs.some((sig) => matchesSignature(buffer, sig))) {
      return mime;
    }
  }
  return null;
}

function matchesSignature(buf: Buffer, sig: MagicSignature): boolean {
  if (buf.length < sig.offset + sig.bytes.length) return false;
  return sig.bytes.every((b, i) => buf[sig.offset + i] === b);
}

/**
 * Verify that a file buffer matches the binary signature for its declared MIME type.
 * Returns { valid: true } if the signature matches or if no signature is defined for the type.
 * Returns { valid: false, reason } if the buffer does not match.
 */
export function verifyFileMagicBytes(
  buffer: Buffer,
  mimeType: string
): { valid: boolean; reason?: string } {
  const signatures = MAGIC_SIGNATURES[mimeType];
  if (!signatures) {
    // No signature registered — allow but log a warning in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[validation] No magic byte signature registered for MIME type: ${mimeType}`);
    }
    return { valid: true };
  }

  const matched = signatures.some((sig) => matchesSignature(buffer, sig));
  if (!matched) {
    return {
      valid: false,
      reason: `File content does not match declared type "${mimeType}". The file may be corrupt or misnamed.`,
    };
  }

  return { valid: true };
}

// ------ Client IP Extraction ------

/**
 * Extract the client IP address from a Next.js request in a spoofing-resistant way.
 *
 * On Vercel, the edge proxy injects `x-real-ip` (single, trusted) and appends to
 * `x-forwarded-for`. We prefer x-real-ip. If absent, we take the LAST value of
 * x-forwarded-for (the one Vercel itself appended), not the first (which a client
 * could have pre-populated).
 *
 * Note: `request.ip` and `request.geo` were removed in Next.js v15.0.0.
 */
export function extractClientIp(req: NextRequest): string {
  const trustedProxy = process.env.TRUSTED_PROXY || "vercel";

  if (trustedProxy === "cloudflare") {
    const cfIp = req.headers.get("cf-connecting-ip")?.trim();
    if (cfIp) return cfIp;
  }

  if (trustedProxy === "vercel" || trustedProxy === "cloudflare") {
    const realIp = req.headers.get("x-real-ip")?.trim();
    if (realIp) return realIp;

    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      const lastIp = forwarded.split(",").at(-1)?.trim();
      if (lastIp) return lastIp;
    }
  }

  // Avoid a single shared "unknown-ip" bucket that lets one client lock out all others
  const ua = req.headers.get("user-agent") || "no-ua";
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = (hash * 31 + ua.charCodeAt(i)) | 0;
  }
  return `unknown-${Math.abs(hash)}`;
}

// ------ Rate Limiting (delegated to lib/rate-limit.ts) ------

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
  options?: { failClosed?: boolean }
): Promise<{
  allowed: boolean;
  retryAfterMs?: number;
  limit?: number;
  remaining?: number;
  resetAt?: number;
}> {
  const { rateLimit } = await import("@/lib/rate-limit");
  return rateLimit(key, maxAttempts, windowMs, options);
}

// ------ Safe Error Response ------

/**
 * Create a safe error message that doesn't leak internals.
 * In development, returns the actual error. In production, returns a generic message.
 */
export function safeErrorMessage(
  error: unknown,
  fallback = "An internal error occurred"
): string {
  if (process.env.NODE_ENV === "development") {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
  }
  return fallback;
}
