import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import JobApplication from "@/models/JobApplication";
import { isValidObjectId, sanitizeText, safeErrorMessage } from "@/lib/validation";

const VALID_APP_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "interviewing",
  "rejected",
  "hired",
] as const;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    const existing = await JobApplication.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined && VALID_APP_STATUSES.includes(body.status)) {
      updates.status = body.status;
    }
    if (body.notes !== undefined) {
      updates.notes = sanitizeText(body.notes, 3000);
    }
    if (body.rating !== undefined) {
      const parsedRating = Number(body.rating);
      if (Number.isFinite(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
        updates.rating = Math.round(parsedRating);
      }
    }
    if (body.interviewDate !== undefined) {
      if (!body.interviewDate) {
        updates.interviewDate = null;
      } else {
        const dt = new Date(body.interviewDate);
        if (!Number.isNaN(dt.getTime())) {
          updates.interviewDate = dt;
        }
      }
    }
    if (body.interviewLink !== undefined) {
      const rawLink = String(body.interviewLink || "").trim();
      if (!rawLink) {
        updates.interviewLink = "";
      } else {
        try {
          const parsed = new URL(rawLink);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return NextResponse.json(
              { error: "Invalid interview meeting link URL" },
              { status: 400 }
            );
          }
          updates.interviewLink = sanitizeText(parsed.toString(), 500);
        } catch {
          return NextResponse.json(
            { error: "Invalid interview meeting link URL" },
            { status: 400 }
          );
        }
      }
    }

    const updateQuery: Record<string, unknown> = { $set: updates };
    if (updates.status && updates.status !== existing.status) {
      updateQuery.$push = {
        stageHistory: {
          status: updates.status,
          changedAt: new Date(),
        },
      };
    }

    const updated = await JobApplication.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update application") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await JobApplication.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete application") },
      { status: 500 }
    );
  }
}
