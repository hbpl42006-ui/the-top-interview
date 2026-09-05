import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { GroundReport } from "@/lib/types";

const include = {
  city: { select: { name: true, state: { select: { name: true } } } },
  reporter: { select: { slug: true, name: true } },
} satisfies Prisma.GroundReportInclude;

type Row = Prisma.GroundReportGetPayload<{ include: typeof include }>;

function mapGroundReport(g: Row): GroundReport {
  return {
    id: g.id,
    slug: g.slug,
    headline: g.headline,
    location: g.locationLabel ?? g.city?.name ?? "",
    state: g.city?.state.name ?? "",
    reporter: g.reporter.slug,
    reporterName: g.reporter.name,
    category: "Ground Reports",
    image: g.image,
    videoUrl: g.videoUrl ?? undefined,
    excerpt: g.excerpt,
    body: g.body.split(/\n{2,}/).filter(Boolean),
    publishedAt: (g.publishedAt ?? g.createdAt).toISOString(),
    duration: g.duration ?? undefined,
    views: g.views,
    tags: [],
    mapQuery: g.mapQuery,
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllGroundReports(): Promise<GroundReport[]> {
  const rows = await prisma.groundReport.findMany({
    where: publishedWhere,
    include,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapGroundReport);
}

export async function getAllGroundReportsForAdmin() {
  return prisma.groundReport.findMany({
    include: { reporter: { select: { slug: true, name: true } }, city: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGroundReportBySlug(slug: string): Promise<GroundReport | undefined> {
  const row = await prisma.groundReport.findUnique({ where: { slug }, include });
  return row ? mapGroundReport(row) : undefined;
}

export async function getLatestGroundReports(limit = 6): Promise<GroundReport[]> {
  const rows = await prisma.groundReport.findMany({
    where: publishedWhere,
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapGroundReport);
}

export async function getGroundReportsByReporter(reporterSlug: string): Promise<GroundReport[]> {
  const rows = await prisma.groundReport.findMany({
    where: { ...publishedWhere, reporter: { slug: reporterSlug } },
    include,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapGroundReport);
}

export async function getGroundReportsByState(state: string): Promise<GroundReport[]> {
  const rows = await prisma.groundReport.findMany({
    where: { ...publishedWhere, city: { state: { name: state } } },
    include,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapGroundReport);
}

export async function getRelatedGroundReports(current: GroundReport, limit = 3): Promise<GroundReport[]> {
  const sameState = await prisma.groundReport.findMany({
    where: { ...publishedWhere, slug: { not: current.slug }, city: { state: { name: current.state } } },
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  if (sameState.length > 0) return sameState.map(mapGroundReport);

  const fallback = await prisma.groundReport.findMany({
    where: { ...publishedWhere, slug: { not: current.slug } },
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return fallback.map(mapGroundReport);
}
