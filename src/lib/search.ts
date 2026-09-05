import { prisma } from "@/lib/prisma";

export interface SearchResult {
  title: string;
  href: string;
  type: string;
  meta?: string;
}

const insensitive = "insensitive" as const;

export async function searchSite(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim();
  if (!query) return [];

  const [articles, groundReports, interviews, episodes, reporters] = await Promise.all([
    prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { headline: { contains: query, mode: insensitive } },
          { locationLabel: { contains: query, mode: insensitive } },
          { tags: { some: { name: { contains: query, mode: insensitive } } } },
        ],
      },
      select: { slug: true, headline: true, category: { select: { name: true } } },
      take: 6,
    }),
    prisma.groundReport.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { headline: { contains: query, mode: insensitive } },
          { locationLabel: { contains: query, mode: insensitive } },
        ],
      },
      select: { slug: true, headline: true, locationLabel: true },
      take: 4,
    }),
    prisma.interview.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ topic: { contains: query, mode: insensitive } }, { guest: { name: { contains: query, mode: insensitive } } }],
      },
      select: { slug: true, topic: true, guest: { select: { name: true, designation: true } } },
      take: 4,
    }),
    prisma.podcastEpisode.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: { contains: query, mode: insensitive } }, { guestName: { contains: query, mode: insensitive } }],
      },
      select: { slug: true, title: true, episodeNumber: true },
      take: 3,
    }),
    prisma.reporter.findMany({
      where: {
        OR: [{ name: { contains: query, mode: insensitive } }, { designation: { contains: query, mode: insensitive } }],
      },
      select: { slug: true, name: true, designation: true },
      take: 3,
    }),
  ]);

  const results: SearchResult[] = [
    ...articles.map((a) => ({ title: a.headline, href: `/news/${a.slug}`, type: "News", meta: a.category.name })),
    ...groundReports.map((g) => ({
      title: g.headline,
      href: `/ground-report/${g.slug}`,
      type: "Ground Report",
      meta: g.locationLabel ?? undefined,
    })),
    ...interviews.map((i) => ({
      title: `${i.guest.name}: ${i.topic}`,
      href: `/interview/${i.slug}`,
      type: "Interview",
      meta: i.guest.designation,
    })),
    ...episodes.map((p) => ({ title: p.title, href: `/podcast/${p.slug}`, type: "Podcast", meta: `Ep. ${p.episodeNumber}` })),
    ...reporters.map((r) => ({ title: r.name, href: `/reporter/${r.slug}`, type: "Reporter", meta: r.designation })),
  ];

  return results.slice(0, 20);
}
