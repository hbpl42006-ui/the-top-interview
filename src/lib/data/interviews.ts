import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Interview } from "@/lib/types";

const include = {
  guest: { select: { name: true, designation: true, photo: true } },
  reporter: { select: { slug: true } },
} satisfies Prisma.InterviewInclude;

type Row = Prisma.InterviewGetPayload<{ include: typeof include }>;

function mapInterview(i: Row): Interview {
  return {
    id: i.id,
    slug: i.slug,
    guest: i.guest.name,
    guestDesignation: i.guest.designation,
    guestPhoto: i.guest.photo,
    category: i.category,
    topic: i.topic,
    thumbnail: i.thumbnail,
    videoUrl: i.videoUrl ?? undefined,
    duration: i.duration,
    excerpt: i.excerpt,
    body: i.body.split(/\n{2,}/).filter(Boolean),
    publishedAt: (i.publishedAt ?? i.createdAt).toISOString(),
    reporter: i.reporter.slug,
    views: i.views,
    tags: [],
  };
}

const publishedWhere = { status: "PUBLISHED" as const };

export async function getAllInterviews(): Promise<Interview[]> {
  const rows = await prisma.interview.findMany({ where: publishedWhere, include, orderBy: { publishedAt: "desc" } });
  return rows.map(mapInterview);
}

export async function getAllInterviewsForAdmin() {
  return prisma.interview.findMany({
    include: { guest: { select: { name: true } }, reporter: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInterviewBySlug(slug: string): Promise<Interview | undefined> {
  const row = await prisma.interview.findUnique({ where: { slug }, include });
  return row ? mapInterview(row) : undefined;
}

export async function getInterviewsByReporter(reporterSlug: string): Promise<Interview[]> {
  const rows = await prisma.interview.findMany({
    where: { ...publishedWhere, reporter: { slug: reporterSlug } },
    include,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapInterview);
}

export async function getLatestInterviews(limit = 6): Promise<Interview[]> {
  const rows = await prisma.interview.findMany({
    where: publishedWhere,
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapInterview);
}

export async function getRelatedInterviews(current: Interview, limit = 3): Promise<Interview[]> {
  const sameCategory = await prisma.interview.findMany({
    where: { ...publishedWhere, slug: { not: current.slug }, category: current.category },
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  if (sameCategory.length > 0) return sameCategory.map(mapInterview);

  const fallback = await prisma.interview.findMany({
    where: { ...publishedWhere, slug: { not: current.slug } },
    include,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return fallback.map(mapInterview);
}

export const interviewCategories = [
  "Politicians",
  "Government Officials",
  "Entrepreneurs",
  "Teachers",
  "Doctors",
  "Students",
  "Social Workers",
  "Celebrities",
  "Experts",
  "Local Leaders",
  "Common People",
  "Industry Experts",
];
