import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { groundReportSchema } from "@/lib/validation";
import { requireRole, CONTENT_EDITOR_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllGroundReports } from "@/lib/data/groundReports";

export async function GET() {
  return handleRoute(async () => ok(await getAllGroundReports()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(CONTENT_EDITOR_ROLES);
    const body = groundReportSchema.parse(await request.json());
    const report = await prisma.groundReport.create({ data: body });
    return created(report);
  });
}
