import { prisma } from "@/lib/prisma";
import type { AdPlacement } from "@prisma/client";

export async function getActiveAdsForPlacement(placement: AdPlacement) {
  const now = new Date();
  return prisma.advertisement.findMany({
    where: {
      placement,
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllAds() {
  return prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
}
