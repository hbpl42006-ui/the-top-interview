import { v2 as cloudinary } from "cloudinary";

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "audio/mpeg"]);

/**
 * Uploads a browser-submitted File (from FormData) to Cloudinary and returns
 * the resulting secure URL + public ID to store on the owning record.
 *
 * Requires CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.
 * The Cloudinary API secret never leaves the server — this only runs in
 * route handlers, never in a "use client" component.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfigured) {
    throw new Error(
      "Media upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (max 15MB).");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type.startsWith("video")
    ? "video"
    : file.type.startsWith("audio")
      ? "video" // Cloudinary stores audio under the "video" resource type
      : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `the-top-interview/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed."));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
