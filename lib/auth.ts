import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { requireJwtSecret } from "@/lib/env";

export const SESSION_DURATION_SECONDS = 12 * 60 * 60; // 12 hours
const JWT_ISSUER = "mark2.in";
const JWT_AUDIENCE = "mark2-admin";

export function getSessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Host-admin_session"
    : "admin_session";
}

function getEncodedSecret(): Uint8Array {
  return new TextEncoder().encode(requireJwtSecret());
}

export interface SessionPayload {
  userId: string;
  role: "admin" | "editor" | string;
  email: string;
  name?: string;
  tokenVersion?: number;
  jti?: string;
  iat?: number;
  exp?: number;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  const jti = payload.jti || globalThis.crypto.randomUUID();
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
    name: payload.name,
    tokenVersion: payload.tokenVersion ?? 0,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getEncodedSecret());
}

export async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, getEncodedSecret(), {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName();
  const token =
    cookieStore.get(cookieName)?.value ??
    cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return await decrypt(token);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: getSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse): void {
  const isProd = process.env.NODE_ENV === "production";
  for (const name of ["__Host-admin_session", "admin_session"]) {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
    });
  }
}
