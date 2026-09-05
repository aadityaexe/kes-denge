import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import FAQItem from "@/models/FAQ";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const faqs = await FAQItem.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, faqs });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch FAQs") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { question, answer, category, order, isActive } = body;

    if (!isNonEmptyString(question, 500) || !isNonEmptyString(answer, 5000)) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    await connectToDatabase();
    const item = await FAQItem.create({
      question: sanitizeText(question, 500),
      answer: sanitizeText(answer, 5000),
      category: isNonEmptyString(category, 100) ? sanitizeText(category, 100) : "General",
      order: typeof order === "number" ? order : 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({ success: true, faq: item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create FAQ") },
      { status: 500 }
    );
  }
}
