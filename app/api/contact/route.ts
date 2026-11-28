import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import Setting from "@/models/Setting";
import {
  extractClientIp,
  isValidEmail,
  isNonEmptyString,
  sanitizeText,
  safeErrorMessage,
} from "@/lib/validation";
import { rateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";
import { logEvent, hashIdentifier } from "@/lib/logger";

const MAX_CONTACT_BODY_BYTES = 16 * 1024; // 16 KB

async function sendResendNotification(params: {
  to: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
  leadId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL || "MARK2 <noreply@mark2.in>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        reply_to: params.email,
        subject: `New Project Inquiry from ${params.name} (${params.projectType})`,
        text: [
          `Lead ID: ${params.leadId}`,
          `Name: ${params.name}`,
          `Email: ${params.email}`,
          `Project Type: ${params.projectType}`,
          `Budget Range: ${params.budgetRange}`,
          "",
          "Message:",
          params.message,
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      logEvent("error", "contact.email.failed", { status: res.status, leadId: params.leadId });
    }
  } catch (err) {
    logEvent("error", "contact.email.error", {
      leadId: params.leadId,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured — skip
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req);
    const rl = await rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000, {
      failClosed: true,
    });
    if (!rl.allowed) {
      return rateLimitExceededResponse(
        rl,
        `Too many submissions. Please try again in ${Math.max(
          1,
          Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)
        )} seconds.`
      );
    }

    // Enforce body size limit before parsing
    const contentLength = req.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_CONTACT_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const isFormSubmit =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");
    let body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      const raw = await req.text();
      if (Buffer.byteLength(raw, "utf8") > MAX_CONTACT_BODY_BYTES) {
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
      }
      body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } else if (isFormSubmit) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      const raw = await req.text();
      if (Buffer.byteLength(raw, "utf8") > MAX_CONTACT_BODY_BYTES) {
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
      }
      body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    }

    const {
      name,
      email,
      phone,
      projectType,
      budgetRange,
      message,
      honeypot,
      formLoadedAt,
      turnstileToken,
    } = body;

    // Honeypot & time-trap bot checks (silently accept)
    const elapsedMs =
      typeof formLoadedAt === "number" || typeof formLoadedAt === "string"
        ? Date.now() - Number(formLoadedAt)
        : null;
    const isTooFast = elapsedMs !== null && Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < 1500;

    if (honeypot || isTooFast) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/contact?submitted=true", req.url), 303);
      }
      return NextResponse.json(
        { success: true, message: "Inquiry received successfully. We will get back to you shortly!" },
        { status: 201 }
      );
    }

    // Optional Turnstile CAPTCHA check when TURNSTILE_SECRET_KEY is configured
    if (process.env.TURNSTILE_SECRET_KEY) {
      const validCaptcha = await verifyTurnstile(
        typeof turnstileToken === "string" ? turnstileToken : "",
        ip
      );
      if (!validCaptcha) {
        if (isFormSubmit) {
          return NextResponse.redirect(new URL("/contact?error=captcha_failed", req.url), 303);
        }
        return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
      }
    }

    // Validation
    if (!isNonEmptyString(name, 100)) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/contact?error=invalid_name", req.url), 303);
      }
      return NextResponse.json(
        { error: "Please enter a valid name (up to 100 characters)." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/contact?error=invalid_email", req.url), 303);
      }
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(message, 5000)) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/contact?error=invalid_message", req.url), 303);
      }
      return NextResponse.json(
        { error: "Message is required (up to 5,000 characters)." },
        { status: 400 }
      );
    }

    // Sanitization (plain text, preserves < and > characters)
    const sanitizedName = sanitizeText(name, 100);
    const sanitizedEmail = String(email).trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = phone ? sanitizeText(phone, 50) : "";
    const sanitizedProjectType = isNonEmptyString(projectType, 100)
      ? sanitizeText(projectType, 100)
      : "web";
    const sanitizedBudget = isNonEmptyString(budgetRange, 100)
      ? sanitizeText(budgetRange, 100)
      : "₹1L - ₹5L";
    const sanitizedMessage = sanitizeText(message, 5000);

    // Duplicate-submission check (same email + message hash within 10 min)
    const dupHash = crypto
      .createHash("sha256")
      .update(`${sanitizedEmail}:${sanitizedMessage}`)
      .digest("hex")
      .slice(0, 24);
    const dupCheck = await rateLimit(`contact-dup:${dupHash}`, 1, 10 * 60 * 1000);
    if (!dupCheck.allowed) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL("/contact?submitted=true", req.url), 303);
      }
      return NextResponse.json(
        {
          success: true,
          message: "Your inquiry was already received. We will get back to you shortly!",
        },
        { status: 200 }
      );
    }

    await connectToDatabase();
    const currentSettings = await Setting.findOne().select("contactEmail").lean();
    const destinationEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      currentSettings?.contactEmail ||
      "hello@mark2.in";

    const newMessage = await Message.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      projectType: sanitizedProjectType,
      budgetRange: sanitizedBudget,
      message: sanitizedMessage,
      status: "new",
    });

    logEvent("info", "contact.inquiry.created", {
      leadId: newMessage._id.toString(),
      emailHash: hashIdentifier(sanitizedEmail),
    });

    // Non-blocking email notification via Next.js after()
    after(async () => {
      await sendResendNotification({
        to: destinationEmail,
        name: sanitizedName,
        email: sanitizedEmail,
        projectType: sanitizedProjectType,
        budgetRange: sanitizedBudget,
        message: sanitizedMessage,
        leadId: newMessage._id.toString(),
      });
    });

    if (isFormSubmit) {
      return NextResponse.redirect(new URL("/contact?submitted=true", req.url), 303);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received successfully. We will get back to you shortly!",
        id: newMessage._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMsg = safeErrorMessage(error, "Failed to submit inquiry. Please try again.");
    const contentType = req.headers.get("content-type") || "";
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      return NextResponse.redirect(new URL("/contact?error=submit_failed", req.url), 303);
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
