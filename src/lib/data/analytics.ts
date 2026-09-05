import { prisma } from "@/lib/prisma";

/**
 * Real, database-derived counts for the admin dashboard. There is
 * intentionally no visitor/pageview/traffic-source data here — this app
 * does not yet log page views anywhere (see the AnalyticsEvent model in
 * prisma/schema.prisma, which is ready to receive that data once a
 * pageview-logging hook or an analytics provider like GA4 is wired up via
 * NEXT_PUBLIC_GA_MEASUREMENT_ID). Showing fabricated traffic numbers here
 * would misrepresent this as tracking real visitors when it isn't.
 */
export async function getAnalyticsSummary() {
  const [
    newsTotal,
    newsPublished,
    newsDraft,
    groundReportTotal,
    interviewTotal,
    podcastEpisodeTotal,
    videoTotal,
    specialReportTotal,
    reporterTotal,
    userTotal,
    subscriberTotal,
    pendingComments,
    approvedComments,
    pendingSubmissions,
    pendingContact,
    topArticlesByViews,
    topGroundReportsByViews,
    topEpisodesByPlays,
    contentByState,
  ] = await Promise.all([
    prisma.newsArticle.count(),
    prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
    prisma.newsArticle.count({ where: { status: "DRAFT" } }),
    prisma.groundReport.count(),
    prisma.interview.count(),
    prisma.podcastEpisode.count(),
    prisma.video.count(),
    prisma.specialReport.count(),
    prisma.reporter.count(),
    prisma.user.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.comment.count({ where: { status: "APPROVED" } }),
    prisma.newsSubmission.count({ where: { status: "PENDING" } }),
    prisma.contactSubmission.count({ where: { status: "PENDING" } }),
    prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 5,
      select: { headline: true, views: true },
    }),
    prisma.groundReport.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 5,
      select: { headline: true, views: true },
    }),
    prisma.podcastEpisode.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { plays: "desc" },
      take: 5,
      select: { title: true, plays: true },
    }),
    prisma.state.findMany({
      select: {
        name: true,
        cities: { select: { _count: { select: { articles: true, groundReports: true } } } },
      },
    }),
  ]);

  return {
    content: {
      news: { total: newsTotal, published: newsPublished, draft: newsDraft },
      groundReports: groundReportTotal,
      interviews: interviewTotal,
      podcastEpisodes: podcastEpisodeTotal,
      videos: videoTotal,
      specialReports: specialReportTotal,
      reporters: reporterTotal,
      users: userTotal,
    },
    engagement: {
      newsletterSubscribers: subscriberTotal,
      pendingComments,
      approvedComments,
      pendingSubmissions,
      pendingContact,
    },
    topArticles: topArticlesByViews.map((a) => ({ label: a.headline, value: a.views })),
    topGroundReports: topGroundReportsByViews.map((g) => ({ label: g.headline, value: g.views })),
    topEpisodes: topEpisodesByPlays.map((e) => ({ label: e.title, value: e.plays })),
    contentByState: contentByState
      .map((s) => ({
        state: s.name,
        value: s.cities.reduce((sum, c) => sum + c._count.articles + c._count.groundReports, 0),
      }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value),
  };
}
