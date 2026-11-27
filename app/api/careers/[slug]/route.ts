import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import { isValidSlug, safeErrorMessage } from "@/lib/validation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: "Invalid job slug" }, { status: 400 });
    }

    await connectToDatabase();
    const job = await Job.findOne({ slug, status: "open" }).lean();
    if (!job) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch job opening") },
      { status: 500 }
    );
  }
}
