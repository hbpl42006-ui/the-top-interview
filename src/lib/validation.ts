import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const slugField = z
  .string()
  .min(2)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens only.");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  q: z.string().trim().max(200).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).optional(),
  category: z.string().trim().max(120).optional(),
});

export const newsArticleSchema = z.object({
  slug: slugField,
  headline: z.string().min(5).max(300),
  subheadline: z.string().max(400).optional().nullable(),
  excerpt: z.string().min(10).max(600),
  body: z.string().min(20),
  image: z.string().url(),
  videoUrl: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  contentLabel: z.enum(["NEWS", "OPINION", "SPONSORED"]).default("NEWS"),
  factCheck: z.enum(["VERIFIED", "UNDER_REVIEW", "DISPUTED"]).optional().nullable(),
  isBreaking: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  readMinutes: z.coerce.number().int().min(1).max(60).default(3),
  categoryId: z.string().min(1, "Category is required."),
  cityId: z.string().min(1).optional().nullable(),
  reporterId: z.string().min(1, "Reporter is required."),
  tagNames: z.array(z.string().min(1).max(60)).max(20).default([]),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const newsArticleUpdateSchema = newsArticleSchema.partial().extend({ slug: slugField.optional() });

export const groundReportSchema = z.object({
  slug: slugField,
  headline: z.string().min(5).max(300),
  excerpt: z.string().min(10).max(600),
  body: z.string().min(20),
  image: z.string().url(),
  videoUrl: z.string().url().optional().nullable(),
  duration: z.string().max(20).optional().nullable(),
  mapQuery: z.string().min(2).max(200),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  cityId: z.string().min(1).optional().nullable(),
  reporterId: z.string().min(1, "Reporter is required."),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const groundReportUpdateSchema = groundReportSchema.partial().extend({ slug: slugField.optional() });

export const interviewSchema = z.object({
  slug: slugField,
  topic: z.string().min(5).max(300),
  excerpt: z.string().min(10).max(600),
  body: z.string().min(20),
  thumbnail: z.string().url(),
  videoUrl: z.string().url().optional().nullable(),
  duration: z.string().min(1).max(20),
  category: z.string().min(2).max(80),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  guestId: z.string().min(1, "Guest is required."),
  reporterId: z.string().min(1, "Reporter is required."),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const interviewUpdateSchema = interviewSchema.partial().extend({ slug: slugField.optional() });

export const guestSchema = z.object({
  slug: slugField,
  name: z.string().min(2).max(150),
  designation: z.string().min(2).max(150),
  category: z.string().min(2).max(80),
  photo: z.string().url(),
  bio: z.string().min(10).max(2000),
});

export const podcastEpisodeSchema = z.object({
  slug: slugField,
  episodeNumber: z.coerce.number().int().min(1),
  title: z.string().min(5).max(300),
  guestName: z.string().min(2).max(150),
  description: z.string().min(10).max(2000),
  cover: z.string().url(),
  audioUrl: z.string().url(),
  duration: z.string().min(1).max(20),
  category: z.string().min(2).max(80),
  youtubeUrl: z.string().url().optional().nullable(),
  spotifyUrl: z.string().url().optional().nullable(),
  applePodcastsUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const podcastEpisodeUpdateSchema = podcastEpisodeSchema.partial().extend({ slug: slugField.optional() });

export const videoSchema = z.object({
  slug: slugField,
  title: z.string().min(5).max(300),
  category: z.enum(["news", "ground-report", "interview", "podcast", "special-report"]),
  thumbnail: z.string().url(),
  youtubeId: z.string().min(5).max(30),
  duration: z.string().min(1).max(20),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const videoUpdateSchema = videoSchema.partial().extend({ slug: slugField.optional() });

export const specialReportChapterSchema = z.object({ title: z.string().min(2), body: z.string().min(10) });
export const specialReportTimelineSchema = z.object({ date: z.string().min(2), event: z.string().min(2) });

export const specialReportSchema = z.object({
  slug: slugField,
  title: z.string().min(5).max(300),
  dek: z.string().min(10).max(600),
  image: z.string().url(),
  location: z.string().min(2).max(200),
  chapters: z.array(specialReportChapterSchema).min(1),
  timeline: z.array(specialReportTimelineSchema).default([]),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UNPUBLISHED"]).default("DRAFT"),
  publishedAt: z.coerce.date().optional().nullable(),
});
export const specialReportUpdateSchema = specialReportSchema.partial().extend({ slug: slugField.optional() });

export const categorySchema = z.object({
  slug: slugField,
  name: z.string().min(2).max(80),
});

export const stateSchema = z.object({
  slug: slugField,
  name: z.string().min(2).max(80),
  cities: z.array(z.string().min(1).max(100)).default([]),
});

export const reporterSchema = z.object({
  slug: slugField,
  name: z.string().min(2).max(150),
  designation: z.string().min(2).max(150),
  bio: z.string().min(10).max(2000),
  photo: z.string().url(),
  twitter: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  cityId: z.string().min(1).optional().nullable(),
});
export const reporterUpdateSchema = reporterSchema.partial().extend({ slug: slugField.optional() });

export const userCreateSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER", "MODERATOR", "USER"]),
});
export const userUpdateSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER", "MODERATOR", "USER"]).optional(),
  password: z.string().min(8).max(200).optional(),
});

export const commentCreateSchema = z.object({
  articleSlug: slugField,
  name: z.string().min(2).max(100),
  message: z.string().min(2).max(2000),
});
export const commentModerationSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  department: z.string().min(2).max(80),
  message: z.string().min(10).max(4000),
});
export const contactStatusSchema = z.object({ status: z.enum(["PENDING", "RESOLVED", "SPAM"]) });

export const publicVoiceSchema = z.object({
  name: z.string().min(2).max(150),
  contact: z.string().min(5).max(200),
  location: z.string().min(2).max(200),
  category: z.string().min(2).max(80),
  description: z.string().min(20).max(4000),
  mediaUrl: z.string().url().optional().nullable(),
  consent: z.literal(true),
});
export const submissionStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "PUBLISHED", "REJECTED"]),
});

export const advertisementSchema = z.object({
  name: z.string().min(2).max(150),
  placement: z.enum(["HEADER", "IN_ARTICLE", "SIDEBAR", "HOMEPAGE", "VIDEO_PAGE", "PODCAST_PAGE", "FOOTER"]),
  creativeUrl: z.string().url().optional().nullable(),
  targetUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().default(false),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});
export const advertisementUpdateSchema = advertisementSchema.partial();
