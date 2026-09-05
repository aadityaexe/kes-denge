import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PortfolioItem from "@/models/Portfolio";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit") || "50", 10);
    const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 50 : rawLimit), 100);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const serviceSlug = searchParams.get("serviceSlug");

    const query: Record<string, unknown> = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (serviceSlug) {
      query.relatedServiceSlugs = serviceSlug;
    }

    const portfolioItems = await PortfolioItem.find(query)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: portfolioItems.length,
      portfolio: portfolioItems,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch portfolio items") },
      { status: 500 }
    );
  }
}
