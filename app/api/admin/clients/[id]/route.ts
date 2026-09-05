import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/models/Client";
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
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    await connectToDatabase();
    const client = await Client.findById(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, client });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch client") },
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
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};
    if (body.name !== undefined) allowedUpdates.name = sanitizeText(body.name, 200);
    if (body.logoUrl !== undefined) allowedUpdates.logoUrl = typeof body.logoUrl === "string" ? body.logoUrl.slice(0, 1000) : "";
    if (body.industry !== undefined) allowedUpdates.industry = sanitizeText(body.industry, 100);
    if (body.website !== undefined) allowedUpdates.website = typeof body.website === "string" ? body.website.slice(0, 1000) : "";
    if (body.isFeatured !== undefined) allowedUpdates.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;

    const updated = await Client.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update client") },
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
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete client") },
      { status: 500 }
    );
  }
}
