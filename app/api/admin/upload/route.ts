import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import Media from "@/models/Media";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { isAllowedFileType, MAX_FILE_SIZE, safeErrorMessage } from "@/lib/validation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "kasdenge";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check size limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type and extension
    const fileTypeCheck = isAllowedFileType(file.type || "", file.name);
    if (!fileTypeCheck.valid) {
      return NextResponse.json(
        { error: fileTypeCheck.reason },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name).toLowerCase() || ".png";
    const baseName = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .toLowerCase()
      .slice(0, 100); // Limit filename length
    const uniqueFileName = `${Date.now()}_${baseName}${ext}`;

    let publicUrl = "";
    let publicId = "";
    let width: number | undefined = undefined;
    let height: number | undefined = undefined;

    // Check if Cloudinary is configured
    if (isCloudinaryConfigured()) {
      try {
        const cloudinaryResult = await uploadToCloudinary(buffer, folder, baseName);
        publicUrl = cloudinaryResult.secure_url;
        publicId = cloudinaryResult.public_id;
        width = cloudinaryResult.width;
        height = cloudinaryResult.height;
      } catch (cloudinaryError: unknown) {
        const msg = cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown";
        console.warn("Cloudinary upload failed, falling back to local storage:", msg);
      }
    }

    // Fallback to local storage if Cloudinary not configured or failed
    if (!publicUrl) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, uniqueFileName);
      await writeFile(filePath, buffer);

      publicUrl = `/uploads/${uniqueFileName}`;
    }

    await connectToDatabase();
    const mediaDoc = await Media.create({
      filename: uniqueFileName,
      originalName: file.name.slice(0, 255), // Limit stored name length
      url: publicUrl,
      publicId,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      width,
      height,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId,
      storage: publicId ? "cloudinary" : "local",
      media: mediaDoc,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: safeErrorMessage(error, "Upload failed") },
      { status: 500 }
    );
  }
}
