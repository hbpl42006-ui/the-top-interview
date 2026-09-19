// Shared, credential-free validation for admin image uploads.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export type ImageUploadContext =
  | "news"
  | "ground-reports"
  | "interviews"
  | "podcasts"
  | "special-reports"
  | "reporters"
  | "team-members"
  | "advertisements";
export type MediaUploadContext = ImageUploadContext;

export const IMAGE_UPLOAD_FOLDERS: Record<ImageUploadContext, string> = {
  news: "news",
  "ground-reports": "ground-reports",
  interviews: "interviews",
  podcasts: "podcasts",
  "special-reports": "special-reports",
  reporters: "reporters",
  "team-members": "team-members",
  advertisements: "advertisements",
};

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!IMAGE_TYPES.some((type) => type === file.type)) {
    return "Choose a JPEG, PNG, WebP or AVIF image.";
  }
  if (file.size >= MAX_IMAGE_BYTES) return "Image must be smaller than 5 MB.";
  if (file.size === 0) return "This image is empty. Please choose another file.";
  return null;
}

export function validateMediaFile(file: { type: string; size: number }): string | null {
  if (file.type.startsWith("image/")) return validateImageFile(file);
  if (file.type !== "video/mp4") return "Choose a JPEG, PNG, WebP, AVIF image or MP4 video.";
  if (file.size === 0) return "This video is empty. Please choose another file.";
  if (file.size > 15 * 1024 * 1024) return "Video must be smaller than 15 MB.";
  return null;
}

export function hasImageSignature(bytes: Uint8Array, type: string): boolean {
  const starts = (values: number[]) => values.every((value, index) => bytes[index] === value);
  if (type === "image/jpeg") return starts([0xff, 0xd8, 0xff]);
  if (type === "image/png") return starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/webp") return starts([0x52, 0x49, 0x46, 0x46]) && bytes.slice(8, 12).every((value, index) => value === [0x57, 0x45, 0x42, 0x50][index]);
  // AVIF is an ISO-BMFF container: bytes 4-7 are `ftyp` and the brand is avif/avis.
  return type === "image/avif" && bytes.slice(4, 8).every((value, index) => value === [0x66, 0x74, 0x79, 0x70][index]) &&
    ["avif", "avis"].includes(String.fromCharCode(...bytes.slice(8, 12)));
}

export function isImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
