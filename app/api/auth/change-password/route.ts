import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdminSession, invalidateUserSessionCache } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { readJsonWithLimit } from "@/lib/api";
import { clearSessionCookie, encrypt, setSessionCookie } from "@/lib/auth";
import { logEvent } from "@/lib/logger";

const BCRYPT_COST = 12;

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const bodyResult = await readJsonWithLimit<{
      currentPassword?: unknown;
      newPassword?: unknown;
    }>(req, 4096);
    if (!bodyResult.ok) return bodyResult.response;

    const { currentPassword, newPassword } = bodyResult.data;

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 12 || newPassword.length > 200) {
      return NextResponse.json(
        { error: "New password must be between 12 and 200 characters" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(auth.session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    invalidateUserSessionCache(user._id.toString());

    logEvent("info", "auth.password.changed", { userId: user._id.toString() });

    const newToken = await encrypt({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion,
    });

    const res = NextResponse.json({
      success: true,
      message: "Password updated successfully. Other sessions have been invalidated.",
    });
    clearSessionCookie(res);
    setSessionCookie(res, newToken);
    return res;
  } catch {
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
