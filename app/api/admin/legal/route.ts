import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import LegalDocument from "@/models/LegalDocument";
import { defaultPrivacyDocument, defaultTermsDocument } from "@/lib/db-helpers";
import { safeErrorMessage, sanitizeText } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();

    let privacy = await LegalDocument.findOne({ type: "privacy" }).lean();
    if (!privacy) {
      const created = await LegalDocument.create(defaultPrivacyDocument);
      privacy = created.toObject ? created.toObject() : created;
    }

    let terms = await LegalDocument.findOne({ type: "terms" }).lean();
    if (!terms) {
      const created = await LegalDocument.create(defaultTermsDocument);
      terms = created.toObject ? created.toObject() : created;
    }

    return NextResponse.json({
      success: true,
      privacy,
      terms,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch legal documents") },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { type, data } = body;

    if (type !== "privacy" && type !== "terms") {
      return NextResponse.json(
        { error: "Invalid document type. Must be 'privacy' or 'terms'." },
        { status: 400 }
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid document payload." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const sections = Array.isArray(data.sections)
      ? data.sections
          .filter((s: any) => s && typeof s.title === "string" && typeof s.content === "string")
          .map((s: any, idx: number) => ({
            title: sanitizeText(s.title, 200),
            content: sanitizeText(s.content, 10000),
            order: typeof s.order === "number" ? s.order : idx + 1,
          }))
      : [];

    const updatePayload = {
      title: sanitizeText(data.title || (type === "privacy" ? "Privacy Policy" : "Terms & Conditions"), 200),
      subtitle: sanitizeText(data.subtitle || "", 500),
      badge: sanitizeText(data.badge || "Legal", 100),
      lastUpdated: sanitizeText(data.lastUpdated || "September 2026", 100),
      contactEmail: sanitizeText(data.contactEmail || "hello@mark2.in", 150),
      sections,
    };

    const updated = await LegalDocument.findOneAndUpdate(
      { type },
      { $set: updatePayload },
      { new: true, upsert: true }
    ).lean();

    // Invalidate static / ISR caches
    revalidatePath("/privacy");
    revalidatePath("/terms");
    revalidatePath("/admin/legal");

    return NextResponse.json({
      success: true,
      document: updated,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update legal document") },
      { status: 500 }
    );
  }
}
