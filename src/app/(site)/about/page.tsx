import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Target,
  ShieldCheck,
  Eye,
  Users2,
  Mic,
  MessageSquare,
  FileCheck2,
  Sparkles,
  Search,
  Video,
  BookOpen,
  ArrowRight,
  Megaphone,
} from "lucide-react";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllReporters } from "@/lib/data/reporters";
import { SITE } from "@/lib/constants";
import { thumb } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who We Are, Our Mission, Our Vision and Journalism Approach at The Top Interview.",
};

const MISSION_PILLARS = [
  { icon: MapPin, title: "Ground Reporting" },
  { icon: MessageSquare, title: "Real Voices" },
  { icon: Mic, title: "Authentic Interviews" },
  { icon: Users2, title: "Public Issues" },
  { icon: ShieldCheck, title: "Responsible Journalism" },
  { icon: Sparkles, title: "Special Stories" },
];

const COVERAGE = [
  { emoji: "📰", label: "News", href: "/news" },
  { emoji: "📍", label: "Ground Reports", href: "/ground-reports" },
  { emoji: "🎤", label: "Interviews", href: "/interviews" },
  { emoji: "🎙", label: "Podcasts", href: "/podcasts" },
  { emoji: "🎥", label: "Video Reports", href: "/videos" },
  { emoji: "🔎", label: "Special Reports", href: "/special-reports" },
  { emoji: "💬", label: "Public Issues", href: "/category/public-issues" },
  { emoji: "🏙", label: "Local Stories", href: "/category/local-news" },
  { emoji: "📚", label: "Education", href: "/category/education" },
  { emoji: "💼", label: "Business", href: "/category/business" },
  { emoji: "⚽", label: "Sports", href: "/category/sports" },
  { emoji: "🎭", label: "Entertainment", href: "/category/entertainment" },
];

const GROUND_JOURNEY = [
  { icon: MapPin, label: "Location" },
  { icon: Search, label: "Investigation" },
  { icon: Mic, label: "Interviews" },
  { icon: Video, label: "Video" },
  { icon: BookOpen, label: "Story" },
];

const INTERVIEW_GUESTS = [
  "Public Representatives",
  "Government Officials",
  "Experts",
  "Entrepreneurs",
  "Teachers",
  "Doctors",
  "Students",
  "Social Workers",
  "Local Residents",
  "Industry Professionals",
  "Interesting Personalities",
];

const EDITORIAL_VALUES = [
  {
    icon: FileCheck2,
    title: "Accuracy",
    body: "We aim to verify information and present stories responsibly.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    body: "We clearly distinguish news, opinion, advertisements, and sponsored content.",
  },
  {
    icon: Users2,
    title: "People First",
    body: "We believe the voices of ordinary people and communities deserve attention.",
  },
  {
    icon: Eye,
    title: "Responsible Journalism",
    body: "We strive to present information fairly and responsibly.",
  },
];

export default async function AboutPage() {
  const reporters = await getAllReporters();

  return (
    <div className="pb-14">
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0">
          <Image
            src={thumb("about-hero-interview", 1600, 800)}
            alt="A reporter conducting an on-location interview"
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30" />
        </div>
        <Container className="relative py-16 text-center sm:py-24">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-brand-light">About Us</span>
          <h1 className="font-serif text-3xl font-extrabold leading-tight sm:text-5xl">
            ABOUT THE TOP INTERVIEW
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-white/85 sm:text-xl">
            &ldquo;{SITE.tagline}&rdquo;
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-white/80 sm:text-base">
            {SITE.name} is a ground-reporting and interview-based digital news channel that brings real stories,
            real people, and real voices directly from the ground.
          </p>
        </Container>
      </section>

      {/* Who We Are */}
      <Container className="mt-14 max-w-4xl">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">Who We Are</span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">A Digital News &amp; Media Platform</h2>
        <p className="mt-4 text-muted">
          {SITE.name} is a digital news and media platform focused on ground reporting, interviews, public issues,
          local stories, special reports, videos, and podcasts.
        </p>
        <p className="mt-4 text-muted">
          Our team goes directly to the ground, meets people, talks to local communities, speaks with experts and
          officials, and presents stories from the actual location. The goal is to give audiences a better
          understanding of what is really happening beyond headlines and social media posts.
        </p>
      </Container>

      {/* Mission */}
      <Container className="mt-14">
        <div className="rounded-lg border-l-4 border-brand bg-surface-muted p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
            <Target size={14} /> Our Mission
          </p>
          <p className="mt-2 max-w-3xl font-serif text-xl font-semibold leading-snug sm:text-2xl">
            {SITE.mission}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MISSION_PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center">
              <p.icon size={20} className="text-brand" />
              <p className="text-xs font-bold">{p.title}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Vision */}
      <Container className="mt-14 max-w-4xl">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <Eye size={14} /> Our Vision
        </span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          A Trusted Network Built On Real Stories
        </h2>
        <p className="mt-4 text-muted">
          To build a trusted digital media network where real stories, real people, and real voices are at the
          center of journalism. We aim to expand ground reporting across cities, districts, states, and eventually
          different parts of India.
        </p>
      </Container>

      {/* What We Cover */}
      <Container className="mt-14">
        <SectionHeading eyebrow="Coverage" title="What We Cover" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {COVERAGE.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-5 text-center transition hover:border-brand hover:shadow-md"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-sm font-bold">{c.label}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Ground Reporting */}
      <section className="mt-14 bg-charcoal text-white">
        <Container className="py-12 sm:py-14">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand-light">Ground Reporting</span>
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">WE GO TO THE GROUND</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            We don&apos;t just report from a desk. We go to the location, meet the people, ask questions,
            understand the situation, and show the story to our audience.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {GROUND_JOURNEY.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 sm:gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center">
                  <step.icon size={20} />
                  <span className="text-xs font-bold uppercase tracking-wide">{step.label}</span>
                </div>
                {i < GROUND_JOURNEY.length - 1 && (
                  <ArrowRight size={18} className="shrink-0 text-white/50" />
                )}
              </div>
            ))}
          </div>

          <Link
            href="/ground-reports"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            Explore Ground Reports <ArrowRight size={16} />
          </Link>
        </Container>
      </section>

      {/* Interviews */}
      <Container className="mt-14">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">Interviews</span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">THE TOP INTERVIEW</h2>
        <p className="mt-3 max-w-2xl text-muted">
          We conduct conversations with people from every walk of life — bringing perspective, accountability and
          context to the issues that matter.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {INTERVIEW_GUESTS.map((g) => (
            <span key={g} className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium">
              {g}
            </span>
          ))}
        </div>
        <Link href="/interviews" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3">
          Watch Interviews <ArrowRight size={16} />
        </Link>
      </Container>

      {/* Podcast */}
      <Container className="mt-14">
        <div className="rounded-lg border border-border bg-surface-muted p-6 sm:p-8">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">Podcast</span>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{SITE.podcastBrand.toUpperCase()}</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Our podcast division focuses on long-form conversations, opinions, experiences, expert discussions,
            inspiring stories, and the important topics that deserve more than a headline.
          </p>
          <Link
            href="/podcasts"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            Explore Podcasts <ArrowRight size={16} />
          </Link>
        </div>
      </Container>

      {/* Editorial Values */}
      <Container className="mt-14">
        <SectionHeading eyebrow="Our Standards" title="Editorial Values" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EDITORIAL_VALUES.map((v) => (
            <div key={v.title} className="rounded-lg border border-border p-5">
              <v.icon size={22} className="text-brand" />
              <h3 className="mt-3 font-serif text-lg font-bold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Team */}
      <Container id="team" className="mt-14 scroll-mt-20">
        <SectionHeading eyebrow="The People Behind The Stories" title="Meet Our Team" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reporters.map((r) => (
            <div key={r.slug} className="rounded-lg border border-border p-5">
              <div className="flex items-start gap-4">
                <Link href={`/reporter/${r.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                  <Image src={r.photo} alt={r.name} fill className="object-cover" sizes="64px" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/reporter/${r.slug}`} className="font-serif text-base font-bold hover:text-brand">
                    {r.name}
                  </Link>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand">{r.designation}</p>
                  {r.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                      <MapPin size={12} /> {r.location}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{r.bio}</p>
              <div className="mt-3 flex items-center gap-2">
                {r.twitter && (
                  <a href={r.twitter} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                    <FaXTwitter size={13} />
                  </a>
                )}
                {r.instagram && (
                  <a href={r.instagram} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                    <FaInstagram size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* CTA */}
      <section className="mt-16 bg-brand text-white">
        <Container className="flex flex-col items-center gap-4 py-12 text-center sm:py-14">
          <Megaphone size={32} />
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">HAVE A STORY TO SHARE?</h2>
          <p className="max-w-xl text-white/85">Something important is happening in your area? Tell us.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/public-voice"
              className="rounded-sm bg-charcoal px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-black"
            >
              Send News Tip
            </Link>
            <Link
              href="/contact"
              className="rounded-sm border-2 border-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand"
            >
              Contact Us
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
