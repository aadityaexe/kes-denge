import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
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

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch product") },
      { status: 500 }
    );
  }
}
