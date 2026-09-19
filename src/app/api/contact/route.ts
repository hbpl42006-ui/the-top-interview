import { NextRequest } from "next/server";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";
import { handleRoute, RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

// TODO: also notify the relevant department via email (e.g. Resend/SendGrid)
// using EMAIL_PROVIDER_API_KEY — the enquiry itself is persisted below and
// visible in /admin/contact regardless of whether email is configured.
export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`contact:${clientIp(request)}`, { max: 5, windowMs: 60 * 60 * 1000 });
    if (!success) throw new RouteError("Too many messages sent from this connection. Please try again later.", 429);

    return proxyToDjango(request, "/api/submissions/contact/");
  });
}

export async function GET(request: NextRequest) {
  await requireRole(MODERATION_ROLES);
  return proxyToDjango(request, "/api/submissions/contact/");
}
