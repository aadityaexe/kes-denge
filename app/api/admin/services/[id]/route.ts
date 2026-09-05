import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import { isValidObjectId, safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid service ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, service });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to fetch service") }, { status: 500 });
  }
}

// Allowed fields for service update — prevents mass assignment
const ALLOWED_UPDATE_FIELDS = new Set([
  "title", "slug", "tagline", "heroBadge", "icon",
  "shortDescription", "fullDescription", "targetAudience",
  "problemsSolved", "features", "deliverables", "benefits",
  "process", "technologies", "whyChooseUs", "faqs",
  "relatedServiceSlugs", "metaTitle", "metaDescription",
  "keywords", "featuredImage", "order", "isActive",
]);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid service ID format" }, { status: 400 });
    }

    const body = await req.json();

    // Whitelist fields to prevent mass assignment
    const sanitizedBody: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_UPDATE_FIELDS.has(key)) {
        sanitizedBody[key] = body[key];
      }
    }

    await connectToDatabase();
    const updated = await Service.findByIdAndUpdate(id, sanitizedBody, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to update service") }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid service ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to delete service") }, { status: 500 });
  }
}
