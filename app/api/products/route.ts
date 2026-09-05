import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const rawLimit = parseInt(searchParams.get("limit") || "50", 10);
    const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 50 : rawLimit), 100);

    const query: Record<string, unknown> = { isActive: true };
    if (category && category !== "all") {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch products") },
      { status: 500 }
    );
  }
}
