import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/models/Client";
import { isNonEmptyString, sanitizeText, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const clients = await Client.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, clients });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch clients") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { name, logoUrl, industry, website, isFeatured, isActive, order } = body;

    if (!isNonEmptyString(name, 200)) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    await connectToDatabase();
    const client = await Client.create({
      name: sanitizeText(name, 200),
      logoUrl: typeof logoUrl === "string" ? logoUrl.slice(0, 1000) : "",
      industry: isNonEmptyString(industry, 100) ? sanitizeText(industry, 100) : "Technology",
      website: typeof website === "string" ? website.slice(0, 1000) : "",
      isFeatured: isFeatured ?? true,
      isActive: isActive ?? true,
      order: typeof order === "number" ? order : 0,
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create client") },
      { status: 500 }
    );
  }
}
