import { prisma } from "@/lib/prisma";
import { Reporter } from "@/lib/types";

function mapReporter(r: {
  id: string;
  slug: string;
  name: string;
  designation: string;
  bio: string;
  photo: string;
  twitter: string | null;
  instagram: string | null;
  email: string | null;
  location: { name: string; state: { name: string } } | null;
  _count: { articles: number; groundReports: number; interviews: number };
}): Reporter {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    designation: r.designation,
    location: r.location ? `${r.location.name}, ${r.location.state.name}` : "",
    bio: r.bio,
    photo: r.photo,
    twitter: r.twitter ?? undefined,
    instagram: r.instagram ?? undefined,
    email: r.email ?? undefined,
    articleCount: r._count.articles,
    groundReportCount: r._count.groundReports,
    interviewCount: r._count.interviews,
  };
}

const include = {
  location: { select: { name: true, state: { select: { name: true } } } },
  _count: { select: { articles: true, groundReports: true, interviews: true } },
} as const;

export async function getAllReporters(): Promise<Reporter[]> {
  const rows = await prisma.reporter.findMany({ include, orderBy: { name: "asc" } });
  return rows.map(mapReporter);
}

export async function getReporterBySlug(slug: string): Promise<Reporter | undefined> {
  const row = await prisma.reporter.findUnique({ where: { slug }, include });
  return row ? mapReporter(row) : undefined;
}
