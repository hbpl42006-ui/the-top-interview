import { NextRequest } from "next/server";
import {
  cloudinaryConfigured,
  uploadToCloudinary,
} from "@/lib/cloudinary";
import {
  handleRoute,
  ok,
  RouteError,
} from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(
      `public-voice-upload:${clientIp(request)}`,
      {
        max: 10,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!success) {
      throw new RouteError(
        "Too many upload attempts. Please try again later.",
        429
      );
    }

    if (!cloudinaryConfigured) {
      throw new RouteError(
        "Media uploads are temporarily unavailable.",
        503
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new RouteError("No media file provided.", 400);
    }

    if (file.size === 0) {
      throw new RouteError("The selected file is empty.", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new RouteError(
        "Only JPEG, PNG, WebP, AVIF images and MP4 videos are supported.",
        415
      );
    }

    const isVideo = file.type === "video/mp4";

    if (!isVideo && file.size > MAX_IMAGE_BYTES) {
      throw new RouteError(
        "Image must be 5 MB or smaller.",
        413
      );
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      throw new RouteError(
        "Video must be 15 MB or smaller.",
        413
      );
    }

    const result = await uploadToCloudinary(
      file,
      "the-top-interview/public-voice"
    );

    return ok(result);
  });
}