import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
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
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch product") },
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
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};

    if (body.name !== undefined) allowedUpdates.name = sanitizeText(body.name, 200);
    if (body.slug !== undefined) {
      const cleanSlug = String(body.slug).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!isValidSlug(cleanSlug)) {
        return NextResponse.json({ error: "Invalid product slug format" }, { status: 400 });
      }
      const existing = await Product.findOne({ slug: cleanSlug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Another product already uses this slug" }, { status: 400 });
      }
      allowedUpdates.slug = cleanSlug;
    }
    if (body.tagline !== undefined) allowedUpdates.tagline = sanitizeText(body.tagline, 500);
    if (body.description !== undefined) allowedUpdates.description = sanitizeText(body.description, 5000);
    if (body.fullDescription !== undefined) allowedUpdates.fullDescription = typeof body.fullDescription === "string" ? body.fullDescription : "";
    if (body.category !== undefined) allowedUpdates.category = sanitizeText(body.category, 100);
    if (body.heroBadge !== undefined) allowedUpdates.heroBadge = sanitizeText(body.heroBadge, 100);
    if (body.features !== undefined && Array.isArray(body.features)) allowedUpdates.features = body.features;
    if (body.modules !== undefined && Array.isArray(body.modules)) allowedUpdates.modules = body.modules;
    if (body.benefits !== undefined && Array.isArray(body.benefits)) allowedUpdates.benefits = body.benefits;
    if (body.useCases !== undefined && Array.isArray(body.useCases)) allowedUpdates.useCases = body.useCases;
    if (body.technologies !== undefined && Array.isArray(body.technologies)) allowedUpdates.technologies = body.technologies;
    if (body.integrations !== undefined && Array.isArray(body.integrations)) allowedUpdates.integrations = body.integrations;
    if (body.targetIndustries !== undefined && Array.isArray(body.targetIndustries)) {
      allowedUpdates.targetIndustries = body.targetIndustries.map((t: unknown) => sanitizeText(t, 100)).filter(Boolean);
    }
    if (body.deploymentOptions !== undefined && Array.isArray(body.deploymentOptions)) {
      allowedUpdates.deploymentOptions = body.deploymentOptions.map((d: unknown) => sanitizeText(d, 100)).filter(Boolean);
    }
    if (body.securityCompliance !== undefined && Array.isArray(body.securityCompliance)) {
      allowedUpdates.securityCompliance = body.securityCompliance.map((s: unknown) => sanitizeText(s, 100)).filter(Boolean);
    }
    if (body.specifications !== undefined && Array.isArray(body.specifications)) allowedUpdates.specifications = body.specifications;
    if (body.faqs !== undefined && Array.isArray(body.faqs)) allowedUpdates.faqs = body.faqs;
    if (body.images !== undefined && Array.isArray(body.images)) allowedUpdates.images = body.images;
    if (body.demoUrl !== undefined) allowedUpdates.demoUrl = typeof body.demoUrl === "string" ? body.demoUrl.slice(0, 1000) : "";
    if (body.metaTitle !== undefined) allowedUpdates.metaTitle = sanitizeText(body.metaTitle, 200);
    if (body.metaDescription !== undefined) allowedUpdates.metaDescription = sanitizeText(body.metaDescription, 500);
    if (body.keywords !== undefined && Array.isArray(body.keywords)) {
      allowedUpdates.keywords = body.keywords.map((k: unknown) => sanitizeText(k, 100)).filter(Boolean);
    }
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update product") },
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
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete product") },
      { status: 500 }
    );
  }
}
