import { NextRequest, NextResponse } from "next/server";
import { safeErrorMessage } from "@/lib/validation";

export function ok<T extends Record<string, unknown>>(
  data: T,
  status = 200,
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json({ success: true, ...data }, { status, headers });
}

export function fail(
  code: string,
  message: string,
  status = 400,
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status, headers }
  );
}

/**
 * Parse JSON request body with a strict byte-size limit BEFORE buffering into memory.
 */
export async function readJsonWithLimit<T = Record<string, unknown>>(
  req: NextRequest,
  maxBytes = 16 * 1024
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const len = Number(contentLength);
    if (Number.isFinite(len) && len > maxBytes) {
      return {
        ok: false,
        response: fail(
          "PAYLOAD_TOO_LARGE",
          `Request body exceeds ${maxBytes} bytes limit`,
          413
        ),
      };
    }
  }

  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > maxBytes) {
      return {
        ok: false,
        response: fail(
          "PAYLOAD_TOO_LARGE",
          `Request body exceeds ${maxBytes} bytes limit`,
          413
        ),
      };
    }
    const parsed = raw ? (JSON.parse(raw) as T) : ({} as T);
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      response: fail("INVALID_JSON", "Malformed JSON request body", 400),
    };
  }
}

export function handleDuplicateOrError(
  error: unknown,
  fallbackMessage: string
): NextResponse {
  const errObj = error as { code?: number };
  if (errObj?.code === 11000) {
    return fail("CONFLICT", "A record with this unique value already exists", 409);
  }
  return fail("INTERNAL_ERROR", safeErrorMessage(error, fallbackMessage), 500);
}
