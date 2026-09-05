import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import PricingTier from "@/models/Pricing";
import { isValidObjectId, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid pricing tier ID" }, { status: 400 });
    }

    await connectToDatabase();
    const tier = await PricingTier.findById(id);
    if (!tier) {
      return NextResponse.json({ error: "Pricing tier not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, pricingTier: tier });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch pricing tier") },
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
      return NextResponse.json({ error: "Invalid pricing tier ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const allowedUpdates: Record<string, unknown> = {};
    if (body.name !== undefined) allowedUpdates.name = sanitizeText(body.name, 100);
    if (body.price !== undefined) allowedUpdates.price = sanitizeText(body.price, 50);
    if (body.period !== undefined) allowedUpdates.period = sanitizeText(body.period, 50);
    if (body.description !== undefined) allowedUpdates.description = sanitizeText(body.description, 1000);
    if (body.features !== undefined && Array.isArray(body.features)) {
      allowedUpdates.features = body.features
        .map((f: any) => {
          if (typeof f === "string") {
            const text = sanitizeText(f, 200);
            return text ? { text, included: true } : null;
          }
          if (f && typeof f === "object") {
            const text = sanitizeText(f.text, 200);
            return text ? { text, included: f.included !== false } : null;
          }
          return null;
        })
        .filter(Boolean);
    }
    if (body.isPopular !== undefined) allowedUpdates.isPopular = Boolean(body.isPopular);
    if (body.ctaText !== undefined) allowedUpdates.ctaText = sanitizeText(body.ctaText, 50);
    if (body.ctaHref !== undefined) allowedUpdates.ctaHref = typeof body.ctaHref === "string" ? body.ctaHref.slice(0, 200) : "/contact";
    if (body.order !== undefined) allowedUpdates.order = typeof body.order === "number" ? body.order : 0;
    if (body.isActive !== undefined) allowedUpdates.isActive = Boolean(body.isActive);

    const updated = await PricingTier.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Pricing tier not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, pricingTier: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update pricing tier") },
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
      return NextResponse.json({ error: "Invalid pricing tier ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await PricingTier.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Pricing tier not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Pricing tier deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete pricing tier") },
      { status: 500 }
    );
  }
}
