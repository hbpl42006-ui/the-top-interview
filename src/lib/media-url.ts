const LOCAL_IMAGE_FALLBACK = "/logo.png";

/** Keeps malformed or empty API media values away from next/image. */
export function safeImageUrl(value: unknown, fallback = LOCAL_IMAGE_FALLBACK): string {
  if (typeof value !== "string" || !value.trim()) return fallback;

  const candidate = value.trim();
  if (candidate.startsWith("/")) return candidate;

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}
