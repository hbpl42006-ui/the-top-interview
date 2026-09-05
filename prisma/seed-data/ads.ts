export interface AdSlot {
  id: string;
  placement: "header" | "in-article" | "sidebar" | "homepage" | "video-page" | "podcast-page" | "footer";
  name: string;
  status: "active" | "paused";
  impressions: number;
  clicks: number;
}

export const adSlots: AdSlot[] = [
  { id: "ad1", placement: "homepage", name: "Homepage Leaderboard", status: "active", impressions: 482000, clicks: 3120 },
  { id: "ad2", placement: "in-article", name: "In-Article Banner", status: "active", impressions: 891000, clicks: 5410 },
  { id: "ad3", placement: "sidebar", name: "Sidebar Skyscraper", status: "active", impressions: 264000, clicks: 1180 },
  { id: "ad4", placement: "video-page", name: "Pre-Video Sponsor Card", status: "paused", impressions: 0, clicks: 0 },
  { id: "ad5", placement: "podcast-page", name: "Podcast Episode Sponsor", status: "active", impressions: 118000, clicks: 640 },
  { id: "ad6", placement: "footer", name: "Footer Banner", status: "active", impressions: 302000, clicks: 890 },
];
