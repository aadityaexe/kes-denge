import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { safeErrorMessage } from "@/lib/validation";

const defaultStats = [
  { label: "Projects Shipped", value: 150, suffix: "+" },
  { label: "Happy Clients", value: 85, suffix: "+" },
  { label: "Satisfaction Rate", value: 98, suffix: "%" },
  { label: "Years Experience", value: 6, suffix: "+" },
];

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({ stats: defaultStats });
    } else if (!settings.stats || settings.stats.length === 0) {
      settings.stats = defaultStats;
      await settings.save();
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch settings") },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    await connectToDatabase();

    // Whitelist top-level settings fields
    const allowedKeys = [
      "siteName",
      "tagline",
      "description",
      "logoUrl",
      "faviconUrl",
      "contactEmail",
      "contactPhone",
      "address",
      "googleMapsUrl",
      "socialLinks",
      "hero",
      "about",
      "seo",
      "stats",
      "whyChooseUs",
      "processSteps",
      "technologies",
      "footer",
    ];

    const sanitizedUpdates: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        sanitizedUpdates[key] = body[key];
      }
    }

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(sanitizedUpdates);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, { $set: sanitizedUpdates }, { new: true, runValidators: true });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update settings") },
      { status: 500 }
    );
  }
}
