import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Service slug is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const service = await Service.findOne({ slug, isActive: true }).lean();

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch service") },
      { status: 500 }
    );
  }
}
