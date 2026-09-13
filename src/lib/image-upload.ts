// Shared, credential-free validation for admin image uploads.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!IMAGE_TYPES.some((type) => type === file.type)) {
    return "Choose a JPEG, PNG, WebP or AVIF image.";
  }
  if (file.size >= MAX_IMAGE_BYTES) return "Image must be smaller than 5 MB.";
  if (file.size === 0) return "This image is empty. Please choose another file.";
  return null;
}

export function isImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
