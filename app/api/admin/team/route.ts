import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import TeamMember from "@/models/Team";
import { isNonEmptyString, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, team });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch team members") },
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
      name,
      slug,
      role,
      specialization,
      photo,
      bio,
      techTags,
      socialLinks,
      yearsExperience,
      joinedDate,
      certifications,
      currentlyWorkingOn,
      quote,
      isActive,
      order,
    } = body;

    if (!isNonEmptyString(name, 100) || !isNonEmptyString(slug, 100) || !isNonEmptyString(role, 100) || !isNonEmptyString(bio, 2000)) {
      return NextResponse.json({ error: "Missing required team member fields" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");
    if (!isValidSlug(cleanSlug)) {
      return NextResponse.json({ error: "Invalid team member slug" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await TeamMember.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json({ error: "A team member with this slug already exists" }, { status: 400 });
    }

    const member = await TeamMember.create({
      name: sanitizeText(name, 100),
      slug: cleanSlug,
      role: sanitizeText(role, 100),
      specialization: isNonEmptyString(specialization, 100) ? sanitizeText(specialization, 100) : sanitizeText(role, 100),
      photo: typeof photo === "string" ? photo.slice(0, 1000) : "",
      bio: sanitizeText(bio, 2000),
      techTags: Array.isArray(techTags) ? techTags.map((t: unknown) => sanitizeText(t, 50)).filter(Boolean) : [],
      socialLinks: typeof socialLinks === "object" && socialLinks !== null ? socialLinks : {},
      yearsExperience: Number(yearsExperience) || 3,
      joinedDate: isNonEmptyString(joinedDate, 50) ? sanitizeText(joinedDate, 50) : new Date().toISOString().slice(0, 7),
      certifications: Array.isArray(certifications) ? certifications.map((c: unknown) => sanitizeText(c, 100)).filter(Boolean) : [],
      currentlyWorkingOn: sanitizeText(currentlyWorkingOn || "", 200),
      quote: sanitizeText(quote || "", 500),
      isActive: isActive ?? true,
      order: typeof order === "number" ? order : 0,
    });

    revalidatePath("/team");
    revalidatePath("/");
    revalidatePath(`/team/${cleanSlug}`);
    revalidatePath("/admin/team");

    return NextResponse.json({ success: true, teamMember: member }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create team member") },
      { status: 500 }
    );
  }
}
