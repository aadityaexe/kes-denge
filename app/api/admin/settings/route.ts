import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { safeErrorMessage } from "@/lib/validation";
import { settingsUpdateSchema } from "@/lib/schemas";

const defaultStats = [
  { label: "Projects Shipped", value: 150, suffix: "+" },
  { label: "Happy Clients", value: 85, suffix: "+" },
  { label: "Satisfaction Rate", value: 98, suffix: "%" },
  { label: "Years Experience", value: 6, suffix: "+" },
];

export async function GET() {
  const auth = await requireRole("admin");
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    // Use findOneAndUpdate with upsert to avoid the race condition where two
    // concurrent first requests both see no document and both call create(),
    // resulting in a duplicate key error on the second writer.
    // $setOnInsert only sets defaults when inserting (not on subsequent reads).
    const settings = await Setting.findOneAndUpdate(
      {},
      { $setOnInsert: { stats: defaultStats } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch settings") },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireRole("admin");
  if (!auth.authorized) return auth.response;

  try {
    const rawBody = (await req.json()) as Record<string, unknown>;
    // Strip Mongoose document metadata fields that the admin form echoes back
    const { _id, __v, createdAt, updatedAt, ...body } = rawBody || {};
    void _id;
    void __v;
    void createdAt;
    void updatedAt;

    const parsed = settingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid settings payload",
          details: parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const sanitizedUpdates = parsed.data;

    const settings = await Setting.findOneAndUpdate(
      {},
      { $set: sanitizedUpdates },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Immediately purge cached layouts and pages so updates reflect dynamically everywhere
    try {
      revalidatePath("/", "layout");
      revalidatePath("/contact");
      revalidatePath("/about");
      revalidateTag("settings", "max");
    } catch (e) {
      console.error("Cache revalidation error:", e);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to update settings") },
      { status: 500 }
    );
  }
}
