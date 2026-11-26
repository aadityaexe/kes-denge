import { NextResponse } from "next/server";
import { getSession, SessionPayload } from "./auth";
import { connectToDatabase } from "./mongodb";
import User from "@/models/User";

export type AuthResult =
  | { authorized: true; session: SessionPayload; response?: undefined }
  | { authorized: false; response: NextResponse; session?: undefined };

const USER_CHECK_TTL_MS = 30_000;
const userCache = new Map<
  string,
  { role: string; tokenVersion: number; expiresAt: number }
>();

export function invalidateUserSessionCache(userId: string) {
  userCache.delete(userId);
}

async function verifyActiveUser(
  session: SessionPayload
): Promise<{ valid: boolean; role?: string }> {
  const now = Date.now();
  const cached = userCache.get(session.userId);
  if (cached && cached.expiresAt > now) {
    if ((session.tokenVersion ?? 0) !== cached.tokenVersion) {
      return { valid: false };
    }
    return { valid: true, role: cached.role };
  }

  try {
    await connectToDatabase();
    const user = await User.findById(session.userId)
      .select("role tokenVersion")
      .lean();
    if (!user) {
      userCache.delete(session.userId);
      return { valid: false };
    }
    const tv = typeof user.tokenVersion === "number" ? user.tokenVersion : 0;
    userCache.set(session.userId, {
      role: user.role,
      tokenVersion: tv,
      expiresAt: now + USER_CHECK_TTL_MS,
    });
    if ((session.tokenVersion ?? 0) !== tv) {
      return { valid: false };
    }
    return { valid: true, role: user.role };
  } catch {
    return { valid: false };
  }
}

export async function requireAdminSession(): Promise<AuthResult> {
  const session = await getSession();
  if (!session || !session.userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please log in as an administrator." },
        { status: 401 }
      ),
    };
  }

  const check = await verifyActiveUser(session);
  if (!check.valid) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Session has been revoked or user no longer exists." },
        { status: 401 }
      ),
    };
  }

  const liveSession: SessionPayload = {
    ...session,
    role: check.role || session.role,
  };

  return { authorized: true, session: liveSession };
}

/**
 * Enforce role-based access control on admin routes.
 * Editors can manage content; only "admin" can mutate settings, users,
 * delete leads, or delete media.
 */
export async function requireRole(
  ...allowedRoles: Array<"admin" | "editor">
): Promise<AuthResult> {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth;

  if (!allowedRoles.includes(auth.session.role as "admin" | "editor")) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden. Insufficient permissions for this action." },
        { status: 403 }
      ),
    };
  }

  return auth;
}
