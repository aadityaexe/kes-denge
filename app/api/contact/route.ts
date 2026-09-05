import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import {
  checkRateLimit,
  isValidEmail,
  isNonEmptyString,
  sanitizeText,
  safeErrorMessage,
} from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (5 submissions per 10 minutes per IP)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
    const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      const retryAfterSec = Math.ceil((rateLimit.retryAfterMs || 60000) / 1000);
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${retryAfterSec} seconds.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
          },
        }
      );
    }

    const body = await req.json();
    const { name, email, phone, projectType, budgetRange, message, honeypot } = body;

    // Honeypot check (bot traps)
    if (honeypot) {
      // Silently accept without saving
      return NextResponse.json(
        { success: true, message: "Inquiry received successfully. We will get back to you shortly!" },
        { status: 201 }
      );
    }

    // 2. Strict Validation
    if (!isNonEmptyString(name, 100)) {
      return NextResponse.json({ error: "Please enter a valid name (up to 100 characters)." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!isNonEmptyString(message, 5000)) {
      return NextResponse.json({ error: "Message is required (up to 5,000 characters)." }, { status: 400 });
    }

    // 3. Sanitization
    const sanitizedName = sanitizeText(name, 100);
    const sanitizedEmail = String(email).trim().toLowerCase().slice(0, 254);
    const sanitizedPhone = phone ? sanitizeText(phone, 50) : "";
    const sanitizedProjectType = isNonEmptyString(projectType, 100) ? sanitizeText(projectType, 100) : "web";
    const sanitizedBudget = isNonEmptyString(budgetRange, 100) ? sanitizeText(budgetRange, 100) : "$10k - $25k";
    const sanitizedMessage = sanitizeText(message, 5000);

    // 4. Save to Database
    await connectToDatabase();

    const newMessage = await Message.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      projectType: sanitizedProjectType,
      budgetRange: sanitizedBudget,
      message: sanitizedMessage,
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received successfully. We will get back to you shortly!",
        id: newMessage._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to submit inquiry. Please try again.") },
      { status: 500 }
    );
  }
}
