import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import {
  isNonEmptyString,
  isValidEmail,
  sanitizeText,
  safeErrorMessage,
} from "@/lib/validation";

const VALID_STATUSES = [
  "new",
  "read",
  "in_progress",
  "completed",
  "spam",
  "contacted",
  "closed",
];

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const projectType = searchParams.get("projectType");

    await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (status && status !== "all" && VALID_STATUSES.includes(status)) {
      query.status = status;
    }
    if (projectType && projectType !== "all") {
      query.projectType = projectType;
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch messages") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { name, email, phone, projectType, budgetRange, message, status, notes } = body;

    if (!isNonEmptyString(name, 100)) {
      return NextResponse.json(
        { error: "Client name is required (up to 100 characters)" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const leadStatus = status && VALID_STATUSES.includes(status) ? status : "new";

    const newLead = await Message.create({
      name: sanitizeText(name, 100),
      email: String(email).trim().toLowerCase(),
      phone: phone ? sanitizeText(phone, 50) : "",
      projectType: sanitizeText(projectType || "web", 100),
      budgetRange: sanitizeText(budgetRange || "$10k - $25k", 100),
      message: sanitizeText(message || "Inbound inquiry logged manually via admin panel", 5000),
      status: leadStatus,
      notes: notes ? sanitizeText(notes, 5000) : "",
    });

    return NextResponse.json({ success: true, message: newLead }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create lead") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "At least one lead ID is required for bulk update" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided for update" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const result = await Message.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `Successfully updated ${result.modifiedCount} lead(s) to ${status}`,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to bulk update leads") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "At least one lead ID is required for bulk deletion" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const result = await Message.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Successfully deleted ${result.deletedCount} lead(s)`,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to bulk delete leads") },
      { status: 500 }
    );
  }
}
