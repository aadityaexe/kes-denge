import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary with environment variables.
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is intentionally NOT used here —
// the API key and secret are server-only, so cloud_name must also stay server-side
// to avoid accidentally pairing a public cloud_name with a secret key visible in the bundle.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  ) || Boolean(process.env.CLOUDINARY_URL);
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "mark",
  originalFilename?: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: originalFilename
          ? `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9-_]/g, "_").toLowerCase()}`
          : undefined,
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed with empty response"));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<{ result: string } | null> {
  try {
    const result = await cloudinary.uploader.destroy(publicId) as { result: string };
    return result;
  } catch (error) {
    console.warn("[Cloudinary] Failed to delete asset:", publicId, error);
    return null;
  }
}

export default cloudinary;
