import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import { isValidObjectId, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";
import { isSafeUrl } from "@/lib/schemas";

const VALID_WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;
const VALID_EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const VALID_EXPERIENCE_LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead / Principal"] as const;
const VALID_STATUSES = ["open", "closed", "draft"] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    await connectToDatabase();
    const job = await Job.findById(id).lean();
    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch job posting") },
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
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};

    if (body.title !== undefined) allowedUpdates.title = sanitizeText(body.title, 200);
    if (body.slug !== undefined) {
      const slug = String(body.slug).toLowerCase().trim().replace(/\s+/g, "-");
      if (!isValidSlug(slug)) {
        return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
      }
      const existing = await Job.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use by another job" }, { status: 400 });
      }
      allowedUpdates.slug = slug;
    }
    if (body.department !== undefined) allowedUpdates.department = sanitizeText(body.department, 100);
    if (body.location !== undefined) allowedUpdates.location = sanitizeText(body.location, 150);
    if (body.workMode !== undefined && VALID_WORK_MODES.includes(body.workMode)) {
      allowedUpdates.workMode = body.workMode;
    }
    if (body.employmentType !== undefined && VALID_EMPLOYMENT_TYPES.includes(body.employmentType)) {
      allowedUpdates.employmentType = body.employmentType;
    }
    if (body.experienceLevel !== undefined && VALID_EXPERIENCE_LEVELS.includes(body.experienceLevel)) {
      allowedUpdates.experienceLevel = body.experienceLevel;
    }
    if (body.salaryRange !== undefined) allowedUpdates.salaryRange = sanitizeText(body.salaryRange, 120);
    if (body.summary !== undefined) allowedUpdates.summary = sanitizeText(body.summary, 1000);
    if (body.description !== undefined) allowedUpdates.description = sanitizeText(body.description, 20000);
    if (Array.isArray(body.responsibilities)) {
      allowedUpdates.responsibilities = body.responsibilities
        .map((r: unknown) => sanitizeText(r, 500))
        .filter(Boolean);
    }
    if (Array.isArray(body.requirements)) {
      allowedUpdates.requirements = body.requirements
        .map((r: unknown) => sanitizeText(r, 500))
        .filter(Boolean);
    }
    if (Array.isArray(body.niceToHave)) {
      allowedUpdates.niceToHave = body.niceToHave
        .map((r: unknown) => sanitizeText(r, 500))
        .filter(Boolean);
    }
    if (Array.isArray(body.skills)) {
      allowedUpdates.skills = body.skills.map((s: unknown) => sanitizeText(s, 60)).filter(Boolean);
    }
    if (Array.isArray(body.benefits)) {
      allowedUpdates.benefits = body.benefits.map((b: unknown) => sanitizeText(b, 300)).filter(Boolean);
    }
    if (body.applicationDeadline !== undefined) {
      allowedUpdates.applicationDeadline = body.applicationDeadline
        ? new Date(body.applicationDeadline)
        : null;
    }
    if (body.applyUrl !== undefined) {
      if (body.applyUrl && (typeof body.applyUrl !== "string" || !isSafeUrl(body.applyUrl))) {
        return NextResponse.json({ error: "Invalid external apply URL" }, { status: 400 });
      }
      allowedUpdates.applyUrl = typeof body.applyUrl === "string" ? body.applyUrl.trim().slice(0, 500) : "";
    }
    if (body.status !== undefined && VALID_STATUSES.includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.isFeatured !== undefined) allowedUpdates.isFeatured = Boolean(body.isFeatured);
    if (body.order !== undefined && Number.isFinite(Number(body.order))) {
      allowedUpdates.order = Number(body.order);
    }
    if (body.metaTitle !== undefined) allowedUpdates.metaTitle = sanitizeText(body.metaTitle, 200);
    if (body.metaDescription !== undefined) {
      allowedUpdates.metaDescription = sanitizeText(body.metaDescription, 500);
    }

    const updated = await Job.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update job posting") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    // Clean up associated applications so no orphaned records remain
    await JobApplication.deleteMany({ jobId: id });

    return NextResponse.json({ success: true, message: "Job posting deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete job posting") },
      { status: 500 }
    );
  }
}
