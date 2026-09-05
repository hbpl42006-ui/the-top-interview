import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reporterSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllReporters } from "@/lib/data/reporters";

export async function GET() {
  return handleRoute(async () => ok(await getAllReporters()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const data = reporterSchema.parse(await request.json());
    const reporter = await prisma.reporter.create({ data });
    return created(reporter);
  });
}
