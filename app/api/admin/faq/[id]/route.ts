import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import FAQItem from "@/models/FAQ";
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
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    await connectToDatabase();
    const faq = await FAQItem.findById(id);
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, faq });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch FAQ") },
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
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};
    if (body.question !== undefined) allowedUpdates.question = sanitizeText(body.question, 500);
    if (body.answer !== undefined) allowedUpdates.answer = sanitizeText(body.answer, 5000);
    if (body.category !== undefined) allowedUpdates.category = sanitizeText(body.category, 100);
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);

    const updated = await FAQItem.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update FAQ") },
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
      return NextResponse.json({ error: "Invalid FAQ ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await FAQItem.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete FAQ") },
      { status: 500 }
    );
  }
}
