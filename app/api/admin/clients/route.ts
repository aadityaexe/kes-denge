import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/models/Client";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const clients = await Client.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, clients });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch clients") },
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
      logoUrl,
      industry,
      website,
      tagline,
      description,
      aboutPartnership,
      servicesProvided,
      partnershipYear,
      companySize,
      location,
      testimonialQuote,
      testimonialAuthor,
      testimonialRole,
      keyAchievements,
      technologies,
      caseStudySlug,
      isFeatured,
      isActive,
      order,
    } = body;

    if (!isNonEmptyString(name, 200)) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    const computedSlug = isNonEmptyString(slug, 200)
      ? sanitizeText(slug, 200).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : sanitizeText(name, 200).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    await connectToDatabase();
    const client = await Client.create({
      name: sanitizeText(name, 200),
      slug: computedSlug,
      logoUrl: typeof logoUrl === "string" ? logoUrl.slice(0, 1000) : "",
      industry: isNonEmptyString(industry, 100) ? sanitizeText(industry, 100) : "Technology",
      website: typeof website === "string" ? website.slice(0, 1000) : "",
      tagline: typeof tagline === "string" ? sanitizeText(tagline, 500) : "",
      description: typeof description === "string" ? sanitizeText(description, 3000) : "",
      aboutPartnership: typeof aboutPartnership === "string" ? sanitizeText(aboutPartnership, 3000) : "",
      servicesProvided: Array.isArray(servicesProvided) ? servicesProvided.map((s: string) => sanitizeText(String(s), 100)).filter(Boolean) : [],
      partnershipYear: typeof partnershipYear === "string" ? sanitizeText(partnershipYear, 100) : "",
      companySize: typeof companySize === "string" ? sanitizeText(companySize, 100) : "",
      location: typeof location === "string" ? sanitizeText(location, 100) : "",
      testimonialQuote: typeof testimonialQuote === "string" ? sanitizeText(testimonialQuote, 2000) : "",
      testimonialAuthor: typeof testimonialAuthor === "string" ? sanitizeText(testimonialAuthor, 200) : "",
      testimonialRole: typeof testimonialRole === "string" ? sanitizeText(testimonialRole, 200) : "",
      keyAchievements: Array.isArray(keyAchievements) ? keyAchievements.map((k: string) => sanitizeText(String(k), 300)).filter(Boolean) : [],
      technologies: Array.isArray(technologies) ? technologies.map((t: string) => sanitizeText(String(t), 100)).filter(Boolean) : [],
      caseStudySlug: typeof caseStudySlug === "string" ? sanitizeText(caseStudySlug, 200) : "",
      isFeatured: isFeatured ?? true,
      isActive: isActive ?? true,
      order: typeof order === "number" ? order : 0,
    });

    // Revalidate frontend pages immediately so changes reflect live
    revalidatePath("/clients");
    if (client.slug) {
      revalidatePath(`/clients/${client.slug}`);
    }
    revalidatePath("/");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create client") },
      { status: 500 }
    );
  }
}
