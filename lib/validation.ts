// ============================================================
// MARK Technologies — Validation & Security Utilities
// ============================================================

import mongoose from "mongoose";
import type { NextRequest } from "next/server";

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
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return mongoose.Types.ObjectId.isValid(id);
}

// ------ Sanitization ------

/**
 * Strip HTML tags from a string to prevent stored XSS.
 * Preserves plain text content.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitize a text input: trim, limit length, strip HTML
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
  "image/avif": [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }], // ftyp box
  "application/pdf": [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  "video/mp4": [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }], // ftyp box (same as avif, disambiguated by extension)
  "video/webm": [{ offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] }], // EBML header
};

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
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the last entry — this is the IP Vercel's own edge proxy added
    const lastIp = forwarded.split(",").at(-1)?.trim();
    if (lastIp) return lastIp;
  }

  return "unknown-ip";
}

// ------ Rate Limiting (MongoDB-backed, serverless-safe) ------

/**
 * Durable rate limiter backed by MongoDB.
 *
 * Replaces the previous in-memory Map implementation which was broken in
 * serverless/multi-instance environments (Vercel) — the Map reset on cold start
 * and was not shared across concurrent function instances or regions.
 *
 * Uses a `RateLimit` collection with a TTL index on `resetAt` so MongoDB
 * automatically purges expired entries — no cron job needed.
 *
 * Signature is intentionally kept identical to the old in-memory version
 * so no call sites need to change.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  try {
    // Lazy import to avoid circular deps and to keep this file importable
    // in contexts where the DB connection hasn't been established yet.
    const { connectToDatabase } = await import("@/lib/mongodb");
    const RateLimit = (await import("@/models/RateLimit")).default;

    await connectToDatabase();

    const now = new Date();
    const windowEnd = new Date(now.getTime() + windowMs);

    // Atomic upsert: create entry if it doesn't exist, or increment count.
    // We only set resetAt on insert ($setOnInsert) so the window doesn't slide
    // on every request — it's a fixed window anchored to the first request.
    const entry = await RateLimit.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { resetAt: windowEnd },
      },
      {
        upsert: true,
        new: true, // Return the updated document
        setDefaultsOnInsert: true,
      }
    );

    if (!entry) {
      // Shouldn't happen with upsert: true, but fail open
      return { allowed: true };
    }

    const retryAfterMs = entry.resetAt.getTime() - now.getTime();

    if (entry.count > maxAttempts) {
      return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
    }

    return { allowed: true };
  } catch (err) {
    // Fail open on DB error to avoid blocking legitimate requests
    // if the DB is temporarily unavailable. Log for alerting.
    console.error("[checkRateLimit] MongoDB rate limit check failed, failing open:", err);
    return { allowed: true };
  }
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
