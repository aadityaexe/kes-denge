import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import { isValidObjectId, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    await connectToDatabase();
    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch message") },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};
    const validStatuses = ["new", "read", "in_progress", "completed", "spam", "contacted", "closed"];
    if (body.status !== undefined && validStatuses.includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.notes !== undefined) {
      allowedUpdates.notes = sanitizeText(body.notes, 5000);
    }
    if (body.name !== undefined) {
      allowedUpdates.name = sanitizeText(body.name, 100);
    }
    if (body.phone !== undefined) {
      allowedUpdates.phone = sanitizeText(body.phone, 50);
    }
    if (body.projectType !== undefined) {
      allowedUpdates.projectType = sanitizeText(body.projectType, 100);
    }
    if (body.budgetRange !== undefined) {
      allowedUpdates.budgetRange = sanitizeText(body.budgetRange, 100);
    }

    const updated = await Message.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update message") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete message") },
      { status: 500 }
    );
  }
}
