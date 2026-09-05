// Deterministic placeholder media. Swap for Cloudinary URLs once
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / media pipeline is wired up (see README).
export function thumb(seed: string, w = 900, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function portrait(seed: string, size = 400) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}-face/${size}/${size}`;
}
