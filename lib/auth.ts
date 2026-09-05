import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "SECURITY: JWT_SECRET environment variable is not set. " +
    "Please define JWT_SECRET in your .env.local file with a strong random string (minimum 32 characters)."
  );
}
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// Narrowed payload type — no open index signature to prevent payload injection.
// If you need to store additional fields, add them explicitly here.
export interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  name?: string;
  expires?: Date;
  iat?: number;
  exp?: number;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ userId: payload.userId, role: payload.role, email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedSecret, {
      algorithms: ["HS256"],
    });
    // Validate required fields exist before trusting the payload
    if (
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return payload as unknown as SessionPayload;
  } catch (_error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  if (!parsed) return;
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const isProduction = process.env.NODE_ENV === "production";
  const securePart = isProduction ? "; Secure" : "";

  const res = new Response("OK");
  res.headers.append(
    "Set-Cookie",
    `admin_session=${await encrypt(parsed)}; Path=/; HttpOnly; SameSite=Lax; Expires=${parsed.expires.toUTCString()}${securePart}`
  );
  return res;
}
