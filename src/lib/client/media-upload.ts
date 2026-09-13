"use client";

import { isImageUrl, type ImageUploadContext } from "@/lib/image-upload";

export interface MediaUploadResult {
  url: string;
  secureUrl: string;
  publicId?: string;
  resourceType?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export async function uploadMedia(file: File, context: ImageUploadContext, signal?: AbortSignal): Promise<MediaUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);
  const response = await fetch("/api/upload", { method: "POST", body: formData, credentials: "same-origin", signal });
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json().catch(() => null) : null;
  if (!response.ok || !payload?.success) {
    throw new Error(response.status === 401 ? "Your session has expired. Sign in again to upload an image." : response.status === 403 ? "You do not have permission to upload images." : response.status === 413 ? "Image must be smaller than 5 MB." : response.status === 415 ? "Choose a JPEG, PNG, WebP or AVIF image." : "Failed to upload image. Please try again.");
  }
  const data = payload.data;
  if (!data || typeof data.url !== "string" || !isImageUrl(data.url) || !data.url.startsWith("https://")) throw new Error("Failed to upload image. Please try again.");
  return { ...data, secureUrl: typeof data.secureUrl === "string" ? data.secureUrl : data.url };
}
