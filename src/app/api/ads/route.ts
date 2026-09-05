import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { advertisementSchema } from "@/lib/validation";
import { requireRole, ADMIN_ROLES } from "@/lib/authz";
import { handleRoute, ok, created } from "@/lib/api-response";
import { getAllAds } from "@/lib/data/ads";

export async function GET() {
  return handleRoute(async () => ok(await getAllAds()));
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    await requireRole(ADMIN_ROLES);
    const data = advertisementSchema.parse(await request.json());
    const ad = await prisma.advertisement.create({ data });
    return created(ad);
  });
}
