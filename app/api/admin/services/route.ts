import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, services });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to fetch services") }, { status: 500 });
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
      tagline, 
      heroBadge, 
      icon, 
      shortDescription, 
      fullDescription, 
      targetAudience, 
      problemsSolved, 
      features, 
      deliverables, 
      benefits, 
      process, 
      technologies, 
      whyChooseUs, 
      faqs, 
      relatedServiceSlugs, 
      metaTitle, 
      metaDescription, 
      keywords, 
      featuredImage, 
      order, 
      isActive 
    } = body;

    if (!title || !slug || !shortDescription || !fullDescription) {
      return NextResponse.json({ error: "Missing required service fields" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 400 });
    }

    const service = await Service.create({
      title,
      slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
      tagline: tagline || "",
      heroBadge: heroBadge || "ENGINEERING & DEVELOPMENT",
      icon: icon || "Globe",
      shortDescription,
      fullDescription,
      targetAudience: targetAudience || [],
      problemsSolved: problemsSolved || [],
      features: features || [],
      deliverables: deliverables || [],
      benefits: benefits || [],
      process: process || [],
      technologies: technologies || [],
      whyChooseUs: whyChooseUs || [],
      faqs: faqs || [],
      relatedServiceSlugs: relatedServiceSlugs || [],
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      keywords: keywords || [],
      featuredImage: featuredImage || "",
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: safeErrorMessage(error, "Failed to create service") }, { status: 500 });
  }
}
