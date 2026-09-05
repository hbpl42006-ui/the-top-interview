// Frozen seed content — not typed against live @/lib/types, which can evolve independently.
import { thumb } from "@/lib/images";

const YT_ID = "dQw4w9WgXcQ";

export const videos = [
  {
    slug: "kushinagar-farmers-crop-loss",
    title: "We Visited the Location to Understand Kushinagar's Sugarcane Crisis",
    category: "ground-report",
    thumbnail: thumb("kushinagar-farmers-crop-loss"),
    youtubeId: YT_ID,
    duration: "8:42",
    views: 39200,
    publishedAt: "2026-09-04T07:30:00+05:30",
  },
  {
    slug: "mla-sunita-rawat-on-farmer-dues",
    title: "MLA Sunita Rawat Responds to Our Farmer Dues Investigation",
    category: "interview",
    thumbnail: thumb("mla-sunita-rawat-on-farmer-dues"),
    youtubeId: YT_ID,
    duration: "18:35",
    views: 41200,
    publishedAt: "2026-09-05T10:00:00+05:30",
  },
  {
    slug: "lucknow-drainage-crisis",
    title: "Ground Zero: Lucknow's Flooded Indira Nagar Colonies",
    category: "ground-report",
    thumbnail: thumb("lucknow-drainage-crisis"),
    youtubeId: YT_ID,
    duration: "11:05",
    views: 84210,
    publishedAt: "2026-09-03T09:15:00+05:30",
  },
  {
    slug: "jaipur-tanker-mafia",
    title: "Inside Jaipur's Illegal Water Tanker Network",
    category: "ground-report",
    thumbnail: thumb("jaipur-tanker-mafia"),
    youtubeId: YT_ID,
    duration: "9:58",
    views: 47600,
    publishedAt: "2026-08-30T10:00:00+05:30",
  },
  {
    slug: "dr-ashok-verma-rural-healthcare",
    title: "Why Rural Hospitals Can't Retain Specialist Doctors",
    category: "interview",
    thumbnail: thumb("dr-ashok-verma-rural-healthcare"),
    youtubeId: YT_ID,
    duration: "24:10",
    views: 18400,
    publishedAt: "2026-09-02T12:00:00+05:30",
  },
  {
    slug: "muzaffarpur-migrant-families",
    title: "The Villages Bihar's Migrant Workers Send Money Home To",
    category: "ground-report",
    thumbnail: thumb("muzaffarpur-migrant-families"),
    youtubeId: YT_ID,
    duration: "10:20",
    views: 52900,
    publishedAt: "2026-08-24T09:00:00+05:30",
  },
  {
    slug: "startup-founder-neha-kapoor",
    title: "Building Fintech for Tier-2 India — Neha Kapoor, CredLoop",
    category: "interview",
    thumbnail: thumb("startup-founder-neha-kapoor"),
    youtubeId: YT_ID,
    duration: "31:52",
    views: 15600,
    publishedAt: "2026-08-29T15:00:00+05:30",
  },
  {
    slug: "patna-flyover-collapse-breaking",
    title: "Flyover Section Collapses Near Patna Junction — On the Spot",
    category: "news",
    thumbnail: thumb("patna-flyover-collapse-breaking"),
    youtubeId: YT_ID,
    duration: "4:12",
    views: 152340,
    publishedAt: "2026-09-05T06:40:00+05:30",
  },
  {
    slug: "varanasi-ganga-pollution",
    title: "Has the Ganga Cleanup in Varanasi Actually Worked?",
    category: "ground-report",
    thumbnail: thumb("varanasi-ganga-pollution"),
    youtubeId: YT_ID,
    duration: "12:30",
    views: 68900,
    publishedAt: "2026-08-05T07:45:00+05:30",
  },
  {
    slug: "jodhpur-solar-jobs",
    title: "Solar Parks Promised Jobs to Jodhpur's Villages — Did They Deliver?",
    category: "ground-report",
    thumbnail: thumb("jodhpur-solar-jobs"),
    youtubeId: YT_ID,
    duration: "10:47",
    views: 28300,
    publishedAt: "2026-07-29T08:30:00+05:30",
  },
];

export function getAllVideos() {
  return videos;
}

export function getVideoBySlug(slug: string) {
  return videos.find((v) => v.slug === slug);
}

export function getVideosByCategory(category: string) {
  if (category === "All") return videos;
  return videos.filter((v) => v.category === category);
}
