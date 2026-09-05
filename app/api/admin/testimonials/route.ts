import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch testimonials") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { clientName, company, role, photo, review, rating, isFeatured, isActive, order } = body;

    if (!isNonEmptyString(clientName, 100) || !isNonEmptyString(company, 100) || !isNonEmptyString(review, 3000)) {
      return NextResponse.json({ error: "Missing required testimonial fields" }, { status: 400 });
    }

    await connectToDatabase();
    const parsedRating = Number(rating);
    const validRating = Number.isFinite(parsedRating) ? Math.min(Math.max(parsedRating, 1), 5) : 5;

    const testimonial = await Testimonial.create({
      clientName: sanitizeText(clientName, 100),
      company: sanitizeText(company, 100),
      role: isNonEmptyString(role, 100) ? sanitizeText(role, 100) : "Client",
      photo: typeof photo === "string" ? photo.slice(0, 1000) : "",
      review: sanitizeText(review, 3000),
      rating: validRating,
      isFeatured: isFeatured ?? true,
      isActive: isActive ?? true,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create testimonial") },
      { status: 500 }
    );
  }
}
