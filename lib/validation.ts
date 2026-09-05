// ============================================================
// MARK Technologies — Validation & Security Utilities
// ============================================================

import mongoose from "mongoose";

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

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
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
  ".svg",
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

// ------ Rate Limiting (in-memory) ------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Simple in-memory rate limiter.
 * Returns { allowed: boolean, retryAfterMs?: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true };
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
