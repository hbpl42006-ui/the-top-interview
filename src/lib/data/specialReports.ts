import { prisma } from "@/lib/prisma";
import { SpecialReport } from "@/lib/types";
import type { SpecialReport as SpecialReportRow } from "@prisma/client";

function mapSpecialReport(s: SpecialReportRow): SpecialReport {
  return {
    slug: s.slug,
    title: s.title,
    dek: s.dek,
    image: s.image,
    location: s.location,
    publishedAt: (s.publishedAt ?? s.createdAt).toISOString(),
    chapters: s.chapters as SpecialReport["chapters"],
    timeline: s.timeline as SpecialReport["timeline"],
    views: s.views,
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllSpecialReports(): Promise<SpecialReport[]> {
  const rows = await prisma.specialReport.findMany({ where: publishedWhere, orderBy: { publishedAt: "desc" } });
  return rows.map(mapSpecialReport);
}

export async function getAllSpecialReportsForAdmin() {
  return prisma.specialReport.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getSpecialReportBySlug(slug: string): Promise<SpecialReport | undefined> {
  const row = await prisma.specialReport.findUnique({ where: { slug } });
  return row ? mapSpecialReport(row) : undefined;
}
