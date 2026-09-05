import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created, RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`newsletter:${clientIp(request)}`, { max: 5, windowMs: 10 * 60 * 1000 });
    if (!success) throw new RouteError("Too many attempts. Please try again in a few minutes.", 429);

    const { email } = newsletterSchema.parse(await request.json());
    try {
      const subscriber = await prisma.newsletterSubscriber.create({ data: { email } });
      return created({ id: subscriber.id });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        // Already subscribed — treat as success rather than leaking which emails exist.
        return ok({ alreadySubscribed: true });
      }
      throw err;
    }
  });
}

export async function GET() {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });
    return ok(subscribers);
  });
}
