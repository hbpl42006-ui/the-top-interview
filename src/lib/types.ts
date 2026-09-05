export type Category =
  | "Ground Reports"
  | "Breaking News"
  | "Local News"
  | "National News"
  | "Interviews"
  | "Special Reports"
  | "Public Issues"
  | "Politics"
  | "Education"
  | "Technology"
  | "Business"
  | "Entertainment"
  | "Sports"
  | "Crime & Safety"
  | "Social Issues"
  | "Trending Stories";

export type ContentType =
  | "news"
  | "ground-report"
  | "interview"
  | "video"
  | "podcast"
  | "special-report";

export interface Reporter {
  id: string;
  slug: string;
  name: string;
  designation: string;
  location: string;
  bio: string;
  photo: string;
  twitter?: string;
  instagram?: string;
  email?: string;
  articleCount: number;
  groundReportCount: number;
  interviewCount: number;
}

export interface StateInfo {
  id: string;
  slug: string;
  name: string;
  cities: string[];
  storyCount: number;
}

export interface NewsArticle {
  slug: string;
  type: ContentType;
  headline: string;
  subheadline: string;
  category: Category;
  location?: string;
  state?: string;
  image: string;
  videoUrl?: string;
  excerpt: string;
  body: string[];
  quote?: { text: string; attribution: string };
  keyPoints?: string[];
  reporter: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  factCheck?: "Verified" | "Under Review" | "Disputed";
  contentLabel?: "News" | "Opinion" | "Sponsored";
  views: number;
  readMinutes: number;
}

export interface GroundReport {
  id: string;
  slug: string;
  headline: string;
  location: string;
  state: string;
  reporter: string;
  reporterName: string;
  category: Category;
  image: string;
  videoUrl?: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  duration?: string;
  views: number;
  tags: string[];
  mapQuery: string;
}

export interface Guest {
  slug: string;
  name: string;
  designation: string;
  category: string;
  photo: string;
  bio: string;
}

export interface Interview {
  id: string;
  slug: string;
  guest: string;
  guestDesignation: string;
  guestPhoto: string;
  category: string;
  topic: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  reporter: string;
  views: number;
  tags: string[];
}

export interface PodcastEpisode {
  slug: string;
  episodeNumber: number;
  title: string;
  guest: string;
  cover: string;
  description: string;
  duration: string;
  publishedAt: string;
  audioUrl: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  applePodcastsUrl?: string;
  category: string;
  plays: number;
  featured?: boolean;
}

export interface Video {
  slug: string;
  title: string;
  category: ContentType;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  views: number;
  publishedAt: string;
}

export interface SpecialReport {
  slug: string;
  title: string;
  dek: string;
  image: string;
  location: string;
  publishedAt: string;
  chapters: { title: string; body: string }[];
  timeline: { date: string; event: string }[];
  views: number;
}

export interface Comment {
  id: string;
  articleSlug: string;
  name: string;
  message: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface NewsSubmission {
  id: string;
  name: string;
  contact: string;
  location: string;
  category: string;
  description: string;
  mediaAttached: boolean;
  status: "pending" | "reviewed" | "published" | "rejected";
  submittedAt: string;
}

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR"
  | "REPORTER"
  | "VIDEO_EDITOR"
  | "PODCAST_MANAGER"
  | "MODERATOR"
  | "USER";
