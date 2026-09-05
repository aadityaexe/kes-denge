import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import PortfolioItem from "@/models/Portfolio";
import { isValidObjectId, safeErrorMessage } from "@/lib/validation";

// Allowed fields for portfolio update — prevents mass assignment
const ALLOWED_UPDATE_FIELDS = new Set([
  "title", "slug", "category", "clientName", "clientLogo",
  "industry", "oneLiner", "shortDescription", "fullDescription",
  "overview", "problem", "solution", "results",
  "techStack", "startDate", "launchDate", "durationLabel",
  "status", "teamMembers", "screenshots", "liveUrl", "githubUrl",
  "testimonial", "isFeatured", "isActive", "order",
  "heroImage", "coverImage", "featuredImage",
  "keyFeatures", "impactMetrics", "technologies",
  "relatedServiceSlugs", "metaTitle", "metaDescription", "keywords",
]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid portfolio ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const item = await PortfolioItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Portfolio project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, portfolio: item });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to fetch portfolio item") }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid portfolio ID format" }, { status: 400 });
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
    const updated = await PortfolioItem.findByIdAndUpdate(id, sanitizedBody, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Portfolio project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, portfolio: updated });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to update portfolio item") }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid portfolio ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await PortfolioItem.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Portfolio project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to delete portfolio item") }, { status: 500 });
  }
}
