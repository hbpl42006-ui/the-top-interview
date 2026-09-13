import { v2 as cloudinary } from "cloudinary";
import { RouteError } from "@/lib/api-response";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, validateImageFile, hasImageSignature } from "@/lib/image-upload";

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
const ALLOWED_TYPES = new Set<string>([...IMAGE_TYPES, "video/mp4", "audio/mpeg"]);

/**
 * Uploads a browser-submitted File (from FormData) to Cloudinary and returns
 * the resulting secure URL + public ID to store on the owning record.
 *
 * Requires CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.
 * The Cloudinary API secret never leaves the server — this only runs in
 * route handlers, never in a "use client" component.
 *
 * Provider details are logged server-side; callers receive safe messages.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; secureUrl: string; publicId: string; resourceType: string; format?: string; width?: number; height?: number; bytes?: number }> {
  if (!cloudinaryConfigured) {
    throw new RouteError(
      "Image uploads are temporarily unavailable. Please try again later.",
      503
    );
  }
  if (file.type.startsWith("image/")) {
    const error = validateImageFile(file);
    if (error) throw new RouteError(error, file.size >= MAX_IMAGE_BYTES ? 413 : 415);
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    if (!hasImageSignature(header, file.type)) throw new RouteError("The file contents do not match its image type.", 415);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new RouteError("File is too large (max 15MB).", 413);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new RouteError("Unsupported file type.", 415);
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
              "Failed to upload image. Please try again.",
              502
            )
          );
          return;
        }
        resolve({ url: result.secure_url, secureUrl: result.secure_url, publicId: result.public_id, resourceType: result.resource_type, format: result.format, width: result.width, height: result.height, bytes: result.bytes });
      }
    );
    stream.end(buffer);
  });
}
