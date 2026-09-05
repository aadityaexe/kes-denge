import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import PricingTier from "@/models/Pricing";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const pricing = await PricingTier.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, pricing });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch pricing tiers") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { name, price, period, description, features, isPopular, ctaText, ctaHref, order, isActive } = body;

    if (!isNonEmptyString(name, 100) || !isNonEmptyString(price, 50) || !isNonEmptyString(description, 1000)) {
      return NextResponse.json({ error: "Missing required pricing tier fields" }, { status: 400 });
    }

    await connectToDatabase();
    const tier = await PricingTier.create({
      name: sanitizeText(name, 100),
      price: sanitizeText(price, 50),
      period: isNonEmptyString(period, 50) ? sanitizeText(period, 50) : "project",
      description: sanitizeText(description, 1000),
      features: Array.isArray(features)
        ? features
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
            .filter(Boolean)
        : [],
      isPopular: Boolean(isPopular),
      ctaText: isNonEmptyString(ctaText, 50) ? sanitizeText(ctaText, 50) : "Get Started",
      ctaHref: typeof ctaHref === "string" ? ctaHref.slice(0, 200) : "/contact",
      order: typeof order === "number" ? order : 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({ success: true, pricingTier: tier }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create pricing tier") },
      { status: 500 }
    );
  }
}
