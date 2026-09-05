import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { isNonEmptyString, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const products = await Product.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch products") },
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
      tagline,
      description,
      fullDescription,
      category,
      heroBadge,
      features,
      modules,
      benefits,
      useCases,
      technologies,
      integrations,
      targetIndustries,
      deploymentOptions,
      securityCompliance,
      specifications,
      faqs,
      images,
      demoUrl,
      metaTitle,
      metaDescription,
      keywords,
      isActive,
      order,
    } = body;

    if (!isNonEmptyString(name, 200) || !isNonEmptyString(slug, 200) || !isNonEmptyString(tagline, 500) || !isNonEmptyString(description, 5000)) {
      return NextResponse.json({ error: "Name, slug, tagline, and description are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!isValidSlug(cleanSlug)) {
      return NextResponse.json({ error: "Invalid product slug format" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await Product.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    }

    const product = await Product.create({
      name: sanitizeText(name, 200),
      slug: cleanSlug,
      tagline: sanitizeText(tagline, 500),
      description: sanitizeText(description, 5000),
      fullDescription: typeof fullDescription === "string" ? fullDescription : "",
      category: isNonEmptyString(category, 100) ? sanitizeText(category, 100) : "ERP",
      heroBadge: isNonEmptyString(heroBadge, 100) ? sanitizeText(heroBadge, 100) : "ENTERPRISE PLATFORM",
      features: Array.isArray(features) ? features : [],
      modules: Array.isArray(modules) ? modules : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      useCases: Array.isArray(useCases) ? useCases : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      integrations: Array.isArray(integrations) ? integrations : [],
      targetIndustries: Array.isArray(targetIndustries) ? targetIndustries.map((t: unknown) => sanitizeText(t, 100)).filter(Boolean) : [],
      deploymentOptions: Array.isArray(deploymentOptions) ? deploymentOptions.map((d: unknown) => sanitizeText(d, 100)).filter(Boolean) : [],
      securityCompliance: Array.isArray(securityCompliance) ? securityCompliance.map((s: unknown) => sanitizeText(s, 100)).filter(Boolean) : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      images: Array.isArray(images) ? images : [],
      demoUrl: typeof demoUrl === "string" ? demoUrl.slice(0, 1000) : "",
      metaTitle: sanitizeText(metaTitle || name, 200),
      metaDescription: sanitizeText(metaDescription || description, 500),
      keywords: Array.isArray(keywords) ? keywords.map((k: unknown) => sanitizeText(k, 100)).filter(Boolean) : [],
      isActive: isActive ?? true,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create product") },
      { status: 500 }
    );
  }
}
