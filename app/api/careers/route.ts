import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import { escapeRegex, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const department = searchParams.get("department")?.trim() || "";
    const workMode = searchParams.get("workMode")?.trim() || "";
    const employmentType = searchParams.get("employmentType")?.trim() || "";
    const experienceLevel = searchParams.get("experienceLevel")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";

    await connectToDatabase();

    const filter: Record<string, unknown> = { status: "open" };

    if (department && department !== "all") {
      filter.department = department;
    }
    if (workMode && workMode !== "all") {
      filter.workMode = workMode;
    }
    if (employmentType && employmentType !== "all") {
      filter.employmentType = employmentType;
    }
    if (experienceLevel && experienceLevel !== "all") {
      filter.experienceLevel = experienceLevel;
    }
    if (location && location !== "all") {
      filter.location = { $regex: escapeRegex(location), $options: "i" };
    }
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [
        { title: regex },
        { summary: regex },
        { department: regex },
        { location: regex },
        { skills: regex },
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, jobs });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch job openings") },
      { status: 500 }
    );
  }
}
