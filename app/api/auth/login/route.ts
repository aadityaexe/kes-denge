import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { checkRateLimit, isValidEmail, isNonEmptyString, safeErrorMessage } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";

    // 1. IP-level rate limiting: 10 attempts per 15 minutes
    const ipRate = checkRateLimit(`login-ip:${ip}`, 10, 15 * 60 * 1000);
    if (!ipRate.allowed) {
      const retrySec = Math.ceil((ipRate.retryAfterMs || 60000) / 1000);
      return NextResponse.json(
        { error: `Too many login attempts from this IP. Please try again in ${retrySec} seconds.` },
        { status: 429, headers: { "Retry-After": String(retrySec) } }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!isValidEmail(email) || !isNonEmptyString(password, 200)) {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Account-level rate limiting: 5 attempts per 15 minutes
    const accountRate = checkRateLimit(`login-acct:${normalizedEmail}`, 5, 15 * 60 * 1000);
    if (!accountRate.allowed) {
      const retrySec = Math.ceil((accountRate.retryAfterMs || 60000) / 1000);
      return NextResponse.json(
        { error: `Account locked temporarily due to multiple failed attempts. Try again in ${retrySec} seconds.` },
        { status: 429, headers: { "Retry-After": String(retrySec) } }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const sessionToken = await encrypt({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({ success: true, message: "Logged in successfully" });

    // Set cookie
    res.cookies.set({
      name: "admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "An error occurred during authentication") },
      { status: 500 }
    );
  }
}
