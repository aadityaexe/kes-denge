import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  TRUSTED_PROXY: z.enum(["vercel", "cloudflare", "none"]).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

/**
 * Lazy, cached environment accessor.
 * Does NOT throw at import time so missing optional vars or cold starts
 * don't take down public marketing pages.
 */
export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI || undefined,
    JWT_SECRET: process.env.JWT_SECRET || undefined,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || undefined,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || undefined,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || undefined,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL || undefined,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || undefined,
    TRUSTED_PROXY: process.env.TRUSTED_PROXY as AppEnv["TRUSTED_PROXY"],
  });
  cachedEnv = parsed.success ? parsed.data : {};
  return cachedEnv;
}

export function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SECURITY: JWT_SECRET environment variable is not set or is shorter than 32 characters."
    );
  }
  return secret;
}

export function requireMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }
  return uri;
}
