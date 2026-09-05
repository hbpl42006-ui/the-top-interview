// Lightweight in-memory rate limiter for public form endpoints (contact,
// newsletter, public-voice/tips). Good enough for a single Railway instance.
//
// IMPORTANT: this state lives in process memory, so it resets on deploy and
// does NOT share state across multiple instances/replicas. If you scale
// beyond one instance, replace this with a shared store such as Upstash
// Redis (`@upstash/ratelimit`) — the call sites below only need `limit()`'s
// signature preserved.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this map doesn't grow unbounded.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  },
  5 * 60 * 1000
).unref?.();

export function limit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1 };
  }

  if (bucket.count >= max) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: max - bucket.count };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
