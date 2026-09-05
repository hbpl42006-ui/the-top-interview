/**
 * Seeds the database with the same realistic sample content the site
 * shipped with before it was database-backed (see prisma/seed-data/*.ts,
 * copied verbatim from the former src/lib/data/*.ts mock modules).
 *
 * Safe to re-run — every insert is keyed by a unique slug/email and uses
 * upsert, so running `npm run db:seed` twice does not create duplicates.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, type UserRole, type CommentStatus, type SubmissionStatus, type AdPlacement } from "@prisma/client";
import bcrypt from "bcryptjs";

import { newsArticles } from "./seed-data/news";
import { groundReports } from "./seed-data/groundReports";
import { interviews } from "./seed-data/interviews";
import { podcastEpisodes } from "./seed-data/podcasts";
import { videos } from "./seed-data/videos";
import { specialReports } from "./seed-data/specialReports";
import { reporters as reporterSeed } from "./seed-data/reporters";
import { states as stateSeed } from "./seed-data/locations";
import { mockComments, mockSubmissions, mockUsers } from "./seed-data/admin";
import { adSlots } from "./seed-data/ads";
import { CATEGORIES } from "../src/lib/constants";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function paragraphsToText(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

const AD_PLACEMENT_MAP: Record<string, AdPlacement> = {
  header: "HEADER",
  "in-article": "IN_ARTICLE",
  sidebar: "SIDEBAR",
  homepage: "HOMEPAGE",
  "video-page": "VIDEO_PAGE",
  "podcast-page": "PODCAST_PAGE",
  footer: "FOOTER",
};

const DEMO_SUBSCRIBERS = [
  "priya.mehta@example.com",
  "amit.k@example.com",
  "reader.up@example.com",
  "newsdaily.fan@example.com",
  "reporter.fan99@example.com",
];

const DEMO_CONTACT_SUBMISSIONS = [
  {
    name: "Rakesh Verma",
    email: "rakesh.verma@example.com",
    department: "Advertising",
    message: "We run a chain of coaching centres in Lucknow and would like to discuss a homepage ad placement for the next admission cycle.",
  },
  {
    name: "Sunita Agarwal",
    email: "sunita.agarwal@example.com",
    department: "Partnership",
    message: "I coordinate a district-level NGO network in Bihar and think there could be a good story partnership around our flood-relief work.",
  },
  {
    name: "Mohit Chawla",
    email: "mohit.chawla@example.com",
    department: "Careers",
    message: "Is The Top Interview hiring video editors? I've attached my portfolio link in a follow-up email.",
  },
];

async function main() {
  console.log("Seeding states & cities...");
  const cityByKey = new Map<string, string>(); // `${cityName}|${stateName}` -> cityId
  for (const s of stateSeed) {
    const state = await prisma.state.upsert({
      where: { slug: s.slug },
      update: { name: s.name },
      create: { slug: s.slug, name: s.name },
    });
    for (const cityName of s.cities) {
      const city = await prisma.city.upsert({
        where: { stateId_name: { stateId: state.id, name: cityName } },
        update: {},
        create: { slug: slugify(`${cityName}-${s.slug}`), name: cityName, stateId: state.id },
      });
      cityByKey.set(`${cityName}|${s.name}`, city.id);
    }
  }

  console.log("Seeding categories...");
  const categoryByName = new Map<string, string>();
  for (const name of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { slug: slugify(name), name },
    });
    categoryByName.set(name, category.id);
  }

  console.log("Seeding users...");
  const sharedPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const userIdByEmail = new Map<string, string>();
  for (const u of mockUsers) {
    const passwordHash = await bcrypt.hash(sharedPassword, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role as UserRole },
      create: { name: u.name, email: u.email, role: u.role as UserRole, passwordHash },
    });
    userIdByEmail.set(u.email, user.id);
  }

  console.log("Seeding reporters...");
  const reporterIdBySlug = new Map<string, string>();
  for (const r of reporterSeed) {
    const [cityName, stateName] = r.location.split(",").map((s) => s.trim());
    const cityId = stateName ? cityByKey.get(`${cityName}|${stateName}`) : undefined;
    const linkedUserId = r.email ? userIdByEmail.get(r.email) : undefined;

    const reporter = await prisma.reporter.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        designation: r.designation,
        bio: r.bio,
        photo: r.photo,
        twitter: r.twitter,
        instagram: r.instagram,
        email: r.email,
        locationId: cityId ?? null,
        userId: linkedUserId ?? null,
      },
      create: {
        slug: r.slug,
        name: r.name,
        designation: r.designation,
        bio: r.bio,
        photo: r.photo,
        twitter: r.twitter,
        instagram: r.instagram,
        email: r.email,
        locationId: cityId ?? null,
        userId: linkedUserId ?? null,
      },
    });
    reporterIdBySlug.set(r.slug, reporter.id);
  }

  console.log("Seeding guests...");
  const guestIdBySlug = new Map<string, string>();
  for (const i of interviews) {
    const guestSlug = slugify(i.guest);
    if (guestIdBySlug.has(guestSlug)) continue;
    const guest = await prisma.guest.upsert({
      where: { slug: guestSlug },
      update: { name: i.guest, designation: i.guestDesignation, category: i.category, photo: i.guestPhoto },
      create: {
        slug: guestSlug,
        name: i.guest,
        designation: i.guestDesignation,
        category: i.category,
        photo: i.guestPhoto,
        bio: i.excerpt,
      },
    });
    guestIdBySlug.set(guestSlug, guest.id);
  }

  console.log("Seeding news articles...");
  for (const a of newsArticles) {
    const cityId = a.location && a.state ? cityByKey.get(`${a.location}|${a.state}`) : undefined;
    const tagConnectOrCreate = a.tags.map((t) => ({
      where: { slug: slugify(t) },
      create: { slug: slugify(t), name: t },
    }));

    await prisma.newsArticle.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        headline: a.headline,
        subheadline: a.subheadline,
        excerpt: a.excerpt,
        body: paragraphsToText(a.body),
        image: a.image,
        videoUrl: a.videoUrl,
        status: "PUBLISHED",
        contentLabel: (a.contentLabel ?? "News").toUpperCase() as never,
        factCheck: a.factCheck ? (a.factCheck.replace(" ", "_").toUpperCase() as never) : null,
        isBreaking: a.isBreaking ?? false,
        isFeatured: a.isFeatured ?? false,
        views: a.views,
        readMinutes: a.readMinutes,
        quoteText: a.quote?.text,
        quoteAttribution: a.quote?.attribution,
        keyPoints: a.keyPoints ?? undefined,
        categoryId: categoryByName.get(a.category)!,
        cityId: cityId ?? null,
        locationLabel: a.location ?? null,
        reporterId: reporterIdBySlug.get(a.reporter)!,
        publishedAt: new Date(a.publishedAt),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt),
        tags: { connectOrCreate: tagConnectOrCreate },
      },
    });
  }

  console.log("Seeding ground reports...");
  for (const g of groundReports) {
    const cityId = cityByKey.get(`${g.location.split(",")[0].trim()}|${g.state}`);
    await prisma.groundReport.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug,
        headline: g.headline,
        excerpt: g.excerpt,
        body: paragraphsToText(g.body),
        image: g.image,
        videoUrl: g.videoUrl,
        duration: g.duration,
        mapQuery: g.mapQuery,
        status: "PUBLISHED",
        views: g.views,
        cityId: cityId ?? null,
        locationLabel: g.location,
        reporterId: reporterIdBySlug.get(g.reporter)!,
        publishedAt: new Date(g.publishedAt),
      },
    });
  }

  console.log("Seeding interviews...");
  for (const i of interviews) {
    await prisma.interview.upsert({
      where: { slug: i.slug },
      update: {},
      create: {
        slug: i.slug,
        topic: i.topic,
        excerpt: i.excerpt,
        body: paragraphsToText(i.body),
        thumbnail: i.thumbnail,
        videoUrl: i.videoUrl,
        duration: i.duration,
        category: i.category,
        status: "PUBLISHED",
        views: i.views,
        guestId: guestIdBySlug.get(slugify(i.guest))!,
        reporterId: reporterIdBySlug.get(i.reporter)!,
        publishedAt: new Date(i.publishedAt),
      },
    });
  }

  console.log("Seeding podcast + episodes...");
  const podcast = await prisma.podcast.upsert({
    where: { slug: "the-top-interview-podcasts" },
    update: {},
    create: { slug: "the-top-interview-podcasts", name: "The Top Interview Podcasts" },
  });
  for (const e of podcastEpisodes) {
    await prisma.podcastEpisode.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        episodeNumber: e.episodeNumber,
        title: e.title,
        guestName: e.guest,
        description: e.description,
        cover: e.cover,
        audioUrl: e.audioUrl,
        duration: e.duration,
        category: e.category,
        youtubeUrl: e.youtubeUrl,
        spotifyUrl: e.spotifyUrl,
        applePodcastsUrl: e.applePodcastsUrl,
        featured: e.featured ?? false,
        status: "PUBLISHED",
        plays: e.plays,
        podcastId: podcast.id,
        publishedAt: new Date(e.publishedAt),
      },
    });
  }

  console.log("Seeding videos...");
  for (const v of videos) {
    await prisma.video.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        slug: v.slug,
        title: v.title,
        category: v.category,
        thumbnail: v.thumbnail,
        youtubeId: v.youtubeId,
        duration: v.duration,
        status: "PUBLISHED",
        views: v.views,
        publishedAt: new Date(v.publishedAt),
      },
    });
  }

  console.log("Seeding special reports...");
  for (const s of specialReports) {
    await prisma.specialReport.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title: s.title,
        dek: s.dek,
        image: s.image,
        location: s.location,
        chapters: s.chapters,
        timeline: s.timeline,
        status: "PUBLISHED",
        views: s.views,
        publishedAt: new Date(s.publishedAt),
      },
    });
  }

  console.log("Seeding advertisements...");
  for (const ad of adSlots) {
    const existing = await prisma.advertisement.findFirst({ where: { name: ad.name } });
    const placement = AD_PLACEMENT_MAP[ad.placement];
    if (existing) {
      await prisma.advertisement.update({
        where: { id: existing.id },
        data: { placement, isActive: ad.status === "active", impressions: ad.impressions, clicks: ad.clicks },
      });
    } else {
      await prisma.advertisement.create({
        data: { name: ad.name, placement, isActive: ad.status === "active", impressions: ad.impressions, clicks: ad.clicks },
      });
    }
  }

  console.log("Seeding comments...");
  for (const c of mockComments) {
    const article = await prisma.newsArticle.findUnique({ where: { slug: c.articleSlug } });
    if (!article) continue;
    const exists = await prisma.comment.findFirst({ where: { articleId: article.id, name: c.name, message: c.message } });
    if (exists) continue;
    await prisma.comment.create({
      data: {
        articleId: article.id,
        name: c.name,
        message: c.message,
        status: c.status.toUpperCase() as CommentStatus,
        createdAt: new Date(c.createdAt),
      },
    });
  }

  console.log("Seeding news submissions (Public Voice / tips)...");
  for (const s of mockSubmissions) {
    const exists = await prisma.newsSubmission.findFirst({ where: { name: s.name, description: s.description } });
    if (exists) continue;
    await prisma.newsSubmission.create({
      data: {
        name: s.name,
        contact: s.contact,
        location: s.location,
        category: s.category,
        description: s.description,
        mediaUrl: s.mediaAttached ? "https://res.cloudinary.com/demo/image/upload/sample.jpg" : null,
        status: s.status.toUpperCase() as SubmissionStatus,
        submittedAt: new Date(s.submittedAt),
      },
    });
  }

  console.log("Seeding contact submissions...");
  for (const c of DEMO_CONTACT_SUBMISSIONS) {
    const exists = await prisma.contactSubmission.findFirst({ where: { email: c.email, message: c.message } });
    if (exists) continue;
    await prisma.contactSubmission.create({ data: c });
  }

  console.log("Seeding newsletter subscribers...");
  for (const email of DEMO_SUBSCRIBERS) {
    await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  }

  console.log("Seeding SUPER_ADMIN login...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@thetopinterview.in";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? sharedPassword;
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "SUPER_ADMIN", passwordHash: await bcrypt.hash(adminPassword, 10) },
    create: {
      name: "Admin Desk",
      email: adminEmail,
      role: "SUPER_ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  console.log("\nSeed complete.");
  console.log(`Log in at /admin/login with: ${adminEmail} / (SEED_ADMIN_PASSWORD from your .env)`);
  console.log(`All other seeded staff accounts share the password: SEED_ADMIN_PASSWORD, or "ChangeMe123!" if that env var is unset.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
