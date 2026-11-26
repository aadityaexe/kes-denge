import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, requireRole } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/Media";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { unlink } from "fs/promises";
import path from "path";
import { isValidObjectId, safeErrorMessage } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const rawLimit = parseInt(searchParams.get("limit") || "100", 10);
    const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 100 : rawLimit), 200);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    await connectToDatabase();
    const [media, total] = await Promise.all([
      Media.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Media.countDocuments(),
    ]);
    return NextResponse.json({
      success: true,
      media,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch media") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireRole("admin");
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Valid media ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const item = await Media.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      try {
        await deleteFromCloudinary(item.publicId);
      } catch (err) {
        console.warn("Failed to delete from Cloudinary:", err);
      }
    } else if (item.filename) {
      // Safely delete local file preventing directory traversal
      try {
        const safeFilename = path.basename(item.filename);
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadsDir, safeFilename);
        // Verify path stays within uploads directory
        if (filePath.startsWith(uploadsDir)) {
          await unlink(filePath);
        }
      } catch {
        // File may already be deleted or not found, ignore
      }
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to delete media") },
      { status: 500 }
    );
  }
}
