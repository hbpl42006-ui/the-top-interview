import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { requireRole, MODERATION_ROLES } from "@/lib/authz";
import { handleRoute, ok, created, RouteError } from "@/lib/api-response";
import { limit, clientIp } from "@/lib/rate-limit";

// TODO: also notify the relevant department via email (e.g. Resend/SendGrid)
// using EMAIL_PROVIDER_API_KEY — the enquiry itself is persisted below and
// visible in /admin/contact regardless of whether email is configured.
export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const { success } = limit(`contact:${clientIp(request)}`, { max: 5, windowMs: 60 * 60 * 1000 });
    if (!success) throw new RouteError("Too many messages sent from this connection. Please try again later.", 429);

    const data = contactSchema.parse(await request.json());
    const submission = await prisma.contactSubmission.create({ data });
    return created({ id: submission.id });
  });
}

export async function GET() {
  return handleRoute(async () => {
    await requireRole(MODERATION_ROLES);
    const submissions = await prisma.contactSubmission.findMany({ orderBy: { submittedAt: "desc" } });
    return ok(submissions);
  });
}
