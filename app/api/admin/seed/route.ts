import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  // Only allow seeding in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database seeding is not available in production" },
      { status: 403 }
    );
  }

  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    // Dynamic import to avoid bundling the massive seed file in production
    const { runSeed } = await import("@/scripts/seed");
    await runSeed();
    return NextResponse.json({
      success: true,
      message: "Database successfully initialized and seeded with sample content.",
    });
  } catch (error: unknown) {
    console.error("API Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
