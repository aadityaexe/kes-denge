import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { encrypt, setSessionCookie } from "@/lib/auth";
import {
  extractClientIp,
  isValidEmail,
  isNonEmptyString,
  safeErrorMessage,
} from "@/lib/validation";
import { rateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";
import { readJsonWithLimit } from "@/lib/api";
import { hashIdentifier, logEvent } from "@/lib/logger";

const BCRYPT_COST = 12;

// Pre-computed dummy hash (cost 12) for constant-time comparison when user does not exist.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-that-never-matches-$$", BCRYPT_COST);

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req);
    const ipHash = hashIdentifier(ip);

    // 1. Generous IP-level rate limit (20 attempts / 15 min), failClosed: true
    const ipRate = await rateLimit(`login-ip:${ip}`, 20, 15 * 60 * 1000, {
      failClosed: true,
    });
    if (!ipRate.allowed) {
      logEvent("warn", "auth.login.ip_rate_limited", { ipHash });
      return rateLimitExceededResponse(ipRate);
    }

    // 2. Enforce max body size (16 KB) before parsing JSON
    const bodyResult = await readJsonWithLimit<{ email?: unknown; password?: unknown }>(
      req,
      16 * 1024
    );
    if (!bodyResult.ok) return bodyResult.response;

    const { email, password } = bodyResult.data;

    if (!isValidEmail(email) || !isNonEmptyString(password, 200)) {
      logEvent("warn", "auth.login.invalid_format", { ipHash });
      return NextResponse.json(
        { error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailHash = hashIdentifier(normalizedEmail);

    // 3. Check failure-only lockout keyed by email + ip (prevents DoS lockout of real admin)
    // We check the failure counter without incrementing here; only failed attempts increment it.
    // Using a peek or checking via rateLimit only on failure? Since rateLimit increments,
    // we track failures in `login-fail:${normalizedEmail}:${ip}` AFTER a failed password check,
    // and check `RateLimit` count here or use a 5-failure limit on failure.
    await connectToDatabase();
    const RateLimit = (await import("@/models/RateLimit")).default;
    const failKey = `login-fail:${normalizedEmail}:${ip}`;
    const existingFail = await RateLimit.findOne({ key: failKey }).lean();
    if (
      existingFail &&
      existingFail.count >= 5 &&
      existingFail.resetAt.getTime() > Date.now()
    ) {
      const retryAfterMs = existingFail.resetAt.getTime() - Date.now();
      logEvent("warn", "auth.login.locked_out", { emailHash, ipHash });
      return rateLimitExceededResponse(
        {
          allowed: false,
          limit: 5,
          remaining: 0,
          resetAt: existingFail.resetAt.getTime(),
          retryAfterMs,
        },
        `Account locked temporarily due to multiple failed attempts. Try again in ${Math.ceil(
          retryAfterMs / 1000
        )} seconds.`
      );
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH);
      await rateLimit(failKey, 5, 15 * 60 * 1000, { failClosed: true });
      logEvent("warn", "auth.login.unknown_account", { emailHash, ipHash });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      await rateLimit(failKey, 5, 15 * 60 * 1000, { failClosed: true });
      logEvent("warn", "auth.login.wrong_password", { emailHash, ipHash });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Clear failure counter on successful login
    await RateLimit.deleteOne({ key: failKey }).catch(() => {});

    // Upgrade bcrypt cost to 12 transparently if stored hash used lower cost
    const storedCost = bcrypt.getRounds(user.passwordHash);
    if (storedCost < BCRYPT_COST) {
      user.passwordHash = await bcrypt.hash(password, BCRYPT_COST);
      await user.save();
    }

    logEvent("info", "auth.login.success", {
      userId: user._id.toString(),
      role: user.role,
      ipHash,
    });

    const sessionToken = await encrypt({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion ?? 0,
    });

    const res = NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
    setSessionCookie(res, sessionToken);

    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "An error occurred during authentication") },
      { status: 500 }
    );
  }
}
