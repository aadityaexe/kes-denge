/**
 * lib/logger.ts — Structured JSON logger without raw PII
 */
import crypto from "crypto";

export type LogLevel = "info" | "warn" | "error";

/**
 * One-way short hash for identifiers (emails, IPs) so logs can correlate
 * events without storing raw PII.
 */
export function hashIdentifier(value: string): string {
  if (!value) return "none";
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function logEvent(
  level: LogLevel,
  event: string,
  meta: Record<string, unknown> = {}
) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}
