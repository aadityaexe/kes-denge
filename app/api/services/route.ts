import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import { safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit") || "50", 10);
    const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 50 : rawLimit), 100);

    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(error, "Failed to fetch services") },
      { status: 500 }
    );
  }
}
