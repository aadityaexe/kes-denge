import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { extractClientIp, isValidSlug, safeErrorMessage } from "@/lib/validation";
import { rateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = extractClientIp(req);
    const rl = await rateLimit(`products-slug:${ip}`, 100, 60 * 1000);
    if (!rl.allowed) return rateLimitExceededResponse(rl);

    const { slug } = await params;
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: "Valid product slug is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { headers: PUBLIC_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch product") },
      { status: 500 }
    );
  }
}
