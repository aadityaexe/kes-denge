import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import TeamMember from "@/models/Team";
import { isValidObjectId, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    await connectToDatabase();
    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, teamMember: member });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch team member") },
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
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};

    if (body.name !== undefined) allowedUpdates.name = sanitizeText(body.name, 100);
    if (body.slug !== undefined) {
      const cleanSlug = String(body.slug).toLowerCase().trim().replace(/\s+/g, "-");
      if (!isValidSlug(cleanSlug)) {
        return NextResponse.json({ error: "Invalid team member slug" }, { status: 400 });
      }
      const existing = await TeamMember.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Another team member already uses this slug" }, { status: 400 });
      }
      allowedUpdates.slug = cleanSlug;
    }
    if (body.role !== undefined) allowedUpdates.role = sanitizeText(body.role, 100);
    if (body.specialization !== undefined) allowedUpdates.specialization = sanitizeText(body.specialization, 100);
    if (body.photo !== undefined) allowedUpdates.photo = typeof body.photo === "string" ? body.photo.slice(0, 1000) : "";
    if (body.bio !== undefined) allowedUpdates.bio = sanitizeText(body.bio, 2000);
    if (body.techTags !== undefined && Array.isArray(body.techTags)) {
      allowedUpdates.techTags = body.techTags.map((t: unknown) => sanitizeText(t, 50)).filter(Boolean);
    }
    if (body.socialLinks !== undefined && typeof body.socialLinks === "object" && body.socialLinks !== null) {
      allowedUpdates.socialLinks = body.socialLinks;
    }
    if (body.yearsExperience !== undefined) allowedUpdates.yearsExperience = Number(body.yearsExperience) || 0;
    if (body.joinedDate !== undefined) allowedUpdates.joinedDate = sanitizeText(body.joinedDate, 50);
    if (body.certifications !== undefined && Array.isArray(body.certifications)) {
      allowedUpdates.certifications = body.certifications.map((c: unknown) => sanitizeText(c, 100)).filter(Boolean);
    }
    if (body.currentlyWorkingOn !== undefined) allowedUpdates.currentlyWorkingOn = sanitizeText(body.currentlyWorkingOn, 200);
    if (body.quote !== undefined) allowedUpdates.quote = sanitizeText(body.quote, 500);
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;

    const updated = await TeamMember.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, teamMember: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update team member") },
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
      return NextResponse.json({ error: "Invalid team member ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Team member deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete team member") },
      { status: 500 }
    );
  }
}
