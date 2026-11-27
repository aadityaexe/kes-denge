import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import { isNonEmptyString, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";
import { isSafeUrl } from "@/lib/schemas";

const VALID_WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;
const VALID_EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const VALID_EXPERIENCE_LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead / Principal"] as const;
const VALID_STATUSES = ["open", "closed", "draft"] as const;

function sanitizeStringArray(arr: unknown, maxLen = 300): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => sanitizeText(item, maxLen)).filter(Boolean);
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const [jobs, counts] = await Promise.all([
      Job.find().sort({ isFeatured: -1, order: 1, createdAt: -1 }).lean(),
      JobApplication.aggregate([
        { $group: { _id: "$jobId", count: { $sum: 1 } } },
      ]),
    ]);

    const countMap = new Map<string, number>();
    for (const c of counts) {
      if (c._id) countMap.set(String(c._id), c.count);
    }

    const enrichedJobs = jobs.map((job) => ({
      ...job,
      applicantCount: countMap.get(String(job._id)) || 0,
    }));

    return NextResponse.json({ success: true, jobs: enrichedJobs });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch jobs") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      department,
      location,
      workMode,
      employmentType,
      experienceLevel,
      salaryRange,
      summary,
      description,
      responsibilities,
      requirements,
      niceToHave,
      skills,
      benefits,
      applicationDeadline,
      applyUrl,
      status,
      isFeatured,
      order,
      metaTitle,
      metaDescription,
    } = body;

    if (
      !isNonEmptyString(title, 200) ||
      !isNonEmptyString(slug, 200) ||
      !isNonEmptyString(summary, 1000) ||
      !isNonEmptyString(description, 20000)
    ) {
      return NextResponse.json(
        { error: "Title, slug, summary, and description are required" },
        { status: 400 }
      );
    }

    const sanitizedSlug = String(slug).toLowerCase().trim().replace(/\s+/g, "-");
    if (!isValidSlug(sanitizedSlug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    if (applyUrl && (typeof applyUrl !== "string" || !isSafeUrl(applyUrl))) {
      return NextResponse.json({ error: "Invalid external apply URL" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Job.findOne({ slug: sanitizedSlug });
    if (existing) {
      return NextResponse.json(
        { error: "A job posting with this slug already exists" },
        { status: 400 }
      );
    }

    const job = await Job.create({
      title: sanitizeText(title, 200),
      slug: sanitizedSlug,
      department: isNonEmptyString(department, 100)
        ? sanitizeText(department, 100)
        : "Engineering",
      location: isNonEmptyString(location, 150) ? sanitizeText(location, 150) : "Remote",
      workMode: VALID_WORK_MODES.includes(workMode) ? workMode : "Remote",
      employmentType: VALID_EMPLOYMENT_TYPES.includes(employmentType)
        ? employmentType
        : "Full-time",
      experienceLevel: VALID_EXPERIENCE_LEVELS.includes(experienceLevel)
        ? experienceLevel
        : "Mid Level",
      salaryRange: typeof salaryRange === "string" ? sanitizeText(salaryRange, 120) : "",
      summary: sanitizeText(summary, 1000),
      description: sanitizeText(description, 20000),
      responsibilities: sanitizeStringArray(responsibilities, 500),
      requirements: sanitizeStringArray(requirements, 500),
      niceToHave: sanitizeStringArray(niceToHave, 500),
      skills: sanitizeStringArray(skills, 60),
      benefits: sanitizeStringArray(benefits, 300),
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      applyUrl: typeof applyUrl === "string" ? applyUrl.trim().slice(0, 500) : "",
      status: VALID_STATUSES.includes(status) ? status : "open",
      isFeatured: Boolean(isFeatured),
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      metaTitle: sanitizeText(metaTitle || `${title} — Careers`, 200),
      metaDescription: sanitizeText(metaDescription || summary, 500),
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create job posting") },
      { status: 500 }
    );
  }
}
