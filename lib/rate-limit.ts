/**
 * lib/rate-limit.ts — Pluggable, serverless-safe rate limiter
 *
 * Primary: Upstash Redis REST (sliding window via ZREMRANGEBYSCORE/ZADD/ZCARD)
 *          when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 * Fallback: MongoDB RateLimit collection with E11000 duplicate-key retry.
 *
 * Supports `failClosed: true` for sensitive endpoints (login, contact, upload).
 */

import { NextResponse } from "next/server";

export interface RateLimitOptions {
  failClosed?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix epoch ms
  retryAfterMs?: number;
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const resetSec = Math.ceil(result.resetAt / 1000);
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "RateLimit-Reset": String(resetSec),
  };
  if (!result.allowed && result.retryAfterMs !== undefined) {
    headers["Retry-After"] = String(Math.max(1, Math.ceil(result.retryAfterMs / 1000)));
  }
  return headers;
}

export function rateLimitExceededResponse(
  result: RateLimitResult,
  message?: string
): NextResponse {
  const retrySec = Math.max(1, Math.ceil((result.retryAfterMs ?? 60_000) / 1000));
  return NextResponse.json(
    {
      error:
        message ??
        `Too many requests. Please try again in ${retrySec} seconds.`,
    },
    {
      status: 429,
      headers: rateLimitHeaders(result),
    }
  );
}

async function checkUpstashSlidingWindow(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const now = Date.now();
  const windowStart = now - windowMs;
  const member = `${now}:${globalThis.crypto.randomUUID()}`;
  const redisKey = `rl:${key}`;

  const pipeline = [
    ["ZREMRANGEBYSCORE", redisKey, "0", String(windowStart)],
    ["ZADD", redisKey, String(now), member],
    ["ZCARD", redisKey],
    ["PEXPIRE", redisKey, String(windowMs)],
  ];

  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Upstash REST error: ${res.status}`);
  }

  const data = (await res.json()) as Array<{ result?: number }>;
  const count = Number(data?.[2]?.result ?? 1);
  const resetAt = now + windowMs;
  const allowed = count <= maxAttempts;

  return {
    allowed,
    limit: maxAttempts,
    remaining: Math.max(0, maxAttempts - count),
    resetAt,
    retryAfterMs: allowed ? undefined : windowMs,
  };
}

async function checkMongoRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  const { connectToDatabase } = await import("@/lib/mongodb");
  const RateLimit = (await import("@/models/RateLimit")).default;

  await connectToDatabase();

  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowMs);

  const attemptUpsert = async () =>
    RateLimit.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { resetAt: windowEnd },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

  let entry;
  try {
    entry = await attemptUpsert();
  } catch (err: unknown) {
    // Handle E11000 race condition when two concurrent requests hit upsert simultaneously
    const mongoErr = err as { code?: number };
    if (mongoErr?.code === 11000) {
      entry = await attemptUpsert();
    } else {
      throw err;
    }
  }

  if (!entry) {
    return {
      allowed: true,
      limit: maxAttempts,
      remaining: maxAttempts - 1,
      resetAt: windowEnd.getTime(),
    };
  }

  // If the existing window expired before Mongo TTL purged it, reset it atomically
  if (entry.resetAt.getTime() <= now.getTime()) {
    entry = await RateLimit.findOneAndUpdate(
      { key },
      { $set: { count: 1, resetAt: windowEnd } },
      { new: true }
    );
    if (!entry) {
      return {
        allowed: true,
        limit: maxAttempts,
        remaining: maxAttempts - 1,
        resetAt: windowEnd.getTime(),
      };
    }
  }

  const retryAfterMs = Math.max(entry.resetAt.getTime() - now.getTime(), 0);
  const allowed = entry.count <= maxAttempts;

  return {
    allowed,
    limit: maxAttempts,
    remaining: Math.max(0, maxAttempts - entry.count),
    resetAt: entry.resetAt.getTime(),
    retryAfterMs: allowed ? undefined : retryAfterMs,
  };
}

export async function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { failClosed = false } = options;

  try {
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return await checkUpstashSlidingWindow(key, maxAttempts, windowMs);
    }
    return await checkMongoRateLimit(key, maxAttempts, windowMs);
  } catch (err) {
    console.error(
      `[rateLimit] Provider failed (failClosed=${failClosed}):`,
      err instanceof Error ? err.message : "unknown"
    );
    if (failClosed) {
      return {
        allowed: false,
        limit: maxAttempts,
        remaining: 0,
        resetAt: Date.now() + 60_000,
        retryAfterMs: 60_000,
      };
    }
    return {
      allowed: true,
      limit: maxAttempts,
      remaining: maxAttempts,
      resetAt: Date.now() + windowMs,
    };
  }
}
