import { fetchApi } from "@/lib/api/client";

export async function getAnalyticsSummary(token?: string) {
  try {
    const data = await fetchApi<any>('/api/core/dashboard/', { token });
    return data || {
      content: {
        news: { total: 0, published: 0, draft: 0 },
        groundReports: 0,
        interviews: 0,
        podcastEpisodes: 0,
        videos: 0,
        specialReports: 0,
        reporters: 0,
        users: 0,
      },
      engagement: {
        newsletterSubscribers: 0,
        pendingComments: 0,
        approvedComments: 0,
        pendingSubmissions: 0,
        pendingContact: 0,
      },
      topArticles: [],
      topGroundReports: [],
      topEpisodes: [],
      contentByState: [],
    };
  } catch (e) {
    return {
      content: {
        news: { total: 0, published: 0, draft: 0 },
        groundReports: 0,
        interviews: 0,
        podcastEpisodes: 0,
        videos: 0,
        specialReports: 0,
        reporters: 0,
        users: 0,
      },
      engagement: {
        newsletterSubscribers: 0,
        pendingComments: 0,
        approvedComments: 0,
        pendingSubmissions: 0,
        pendingContact: 0,
      },
      topArticles: [],
      topGroundReports: [],
      topEpisodes: [],
      contentByState: [],
    };
  }
}
