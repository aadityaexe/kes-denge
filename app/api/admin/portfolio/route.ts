import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import PortfolioItem from "@/models/Portfolio";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const portfolio = await PortfolioItem.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, portfolio });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to fetch portfolio") }, { status: 500 });
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
      category,
      clientName,
      clientLogo,
      coverImage,
      heroImage,
      industry,
      oneLiner,
      shortDescription,
      fullDescription,
      overview,
      problem,
      solution,
      challenges,
      solutions,
      keyFeatures,
      impactMetrics,
      results,
      techStack,
      technologies,
      startDate,
      launchDate,
      durationLabel,
      status,
      teamMembers,
      screenshots,
      liveUrl,
      githubUrl,
      relatedServiceSlugs,
      testimonial,
      metaTitle,
      metaDescription,
      keywords,
      isFeatured,
      isActive,
      order,
    } = body;

    if (!title || !slug || !category || !clientName || !oneLiner || !problem || !solution) {
      return NextResponse.json({ error: "Missing required portfolio fields" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await PortfolioItem.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A portfolio project with this slug already exists" }, { status: 400 });
    }

    const item = await PortfolioItem.create({
      title,
      slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
      category: category || "Website",
      clientName,
      clientLogo: clientLogo || "",
      coverImage: coverImage || "",
      heroImage: heroImage || "",
      industry: industry || "Technology",
      oneLiner,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      overview: overview || "",
      problem,
      solution,
      challenges: challenges || [],
      solutions: solutions || [],
      keyFeatures: keyFeatures || [],
      impactMetrics: impactMetrics || [],
      results: results || [],
      techStack: techStack || [],
      technologies: technologies || [],
      startDate: startDate || new Date().toISOString().slice(0, 7),
      launchDate: launchDate || new Date().toISOString().slice(0, 7),
      durationLabel: durationLabel || "3 Months",
      status: status || "completed",
      teamMembers: teamMembers || [],
      screenshots: screenshots || [],
      liveUrl: liveUrl || "",
      githubUrl: githubUrl || "",
      relatedServiceSlugs: relatedServiceSlugs || [],
      testimonial: testimonial || undefined,
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      keywords: keywords || [],
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
      order: order ?? 0,
    });

    return NextResponse.json({ success: true, portfolio: item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to create portfolio item") }, { status: 500 });
  }
}
