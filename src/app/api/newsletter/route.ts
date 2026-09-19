import { NextRequest } from "next/server";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { proxyToDjango } from "@/lib/api/proxy";
import { RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`newsletter:${clientIp(request)}`, { max: 5, windowMs: 10 * 60 * 1000 });
    if (!success) throw new RouteError("Too many attempts. Please try again in a few minutes.", 429);

    return proxyToDjango(request, "/api/submissions/newsletter/");
  });
}

export async function GET(request: NextRequest) {
  await requireRole(ADMIN_ROLES);
  return proxyToDjango(request, "/api/submissions/newsletter/");
}
