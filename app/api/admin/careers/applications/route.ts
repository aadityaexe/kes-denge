import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import { isValidObjectId, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const filter: Record<string, unknown> = {};
    if (jobId && jobId !== "all") {
      if (!isValidObjectId(jobId)) {
        return NextResponse.json({ error: "Invalid jobId filter" }, { status: 400 });
      }
      filter.jobId = jobId;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    await connectToDatabase();
    const applications = await JobApplication.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch job applications") },
      { status: 500 }
    );
  }
}
