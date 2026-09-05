import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
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
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 });
    }

    await connectToDatabase();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, testimonial });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch testimonial") },
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
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};

    if (body.clientName !== undefined) allowedUpdates.clientName = sanitizeText(body.clientName, 100);
    if (body.company !== undefined) allowedUpdates.company = sanitizeText(body.company, 100);
    if (body.role !== undefined) allowedUpdates.role = sanitizeText(body.role, 100);
    if (body.photo !== undefined) allowedUpdates.photo = typeof body.photo === "string" ? body.photo.slice(0, 1000) : "";
    if (body.review !== undefined) allowedUpdates.review = sanitizeText(body.review, 3000);
    if (body.rating !== undefined) {
      const parsed = Number(body.rating);
      allowedUpdates.rating = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 5) : 5;
    }
    if (body.isFeatured !== undefined) allowedUpdates.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update testimonial") },
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
      return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete testimonial") },
      { status: 500 }
    );
  }
}
