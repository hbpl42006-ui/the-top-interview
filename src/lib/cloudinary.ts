import { v2 as cloudinary } from "cloudinary";
import { RouteError } from "@/lib/api-response";

// Defends against a very common misconfiguration: pasting a value copied
// from a local .env file (which may include surrounding quotes) or with
// trailing whitespace/newlines into a host's environment variable UI —
// either of which makes Cloudinary reject an otherwise "correct" credential
// with an opaque auth error.
function cleanEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/^['"]|['"]$/g, "").trim();
  return trimmed ? trimmed : undefined;
}

const CLOUD_NAME = cleanEnv(process.env.CLOUDINARY_CLOUD_NAME);
const API_KEY = cleanEnv(process.env.CLOUDINARY_API_KEY);
const API_SECRET = cleanEnv(process.env.CLOUDINARY_API_SECRET);

export const cloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
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
 *
 * Throws RouteError (not a plain Error) for every failure mode, with the
 * real reason attached, so `handleRoute()` returns that reason to the caller
 * instead of a generic "Unable to process request." — a plain Error thrown
 * here used to fall through to the catch-all 500 branch and hide whatever
 * Cloudinary actually rejected (bad credentials, wrong cloud name, etc.).
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string }> {
  if (!cloudinaryConfigured) {
    throw new RouteError(
      "Media uploads are not configured on this server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      503
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new RouteError("File is too large (max 15MB).", 413);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new RouteError(`Unsupported file type: ${file.type}`, 415);
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
          console.error("[cloudinary] upload_stream rejected the file:", {
            message: error?.message,
            name: error?.name,
            http_code: error?.http_code,
          });
          reject(
            new RouteError(
              error?.message ? `Cloudinary rejected the upload: ${error.message}` : "Cloudinary rejected the upload.",
              502
            )
          );
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
