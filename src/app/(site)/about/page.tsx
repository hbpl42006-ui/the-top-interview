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
import { FaXTwitter, FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa6";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getActiveTeamMembers } from "@/lib/data/teamMembers";
import { SITE } from "@/lib/constants";
import { thumb } from "@/lib/images";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who We Are, Our Mission, Our Vision and Journalism Approach at The Top Interview.",
};

const COVERAGE_HREFS = [
  { emoji: "📰", href: "/news" },
  { emoji: "📍", href: "/ground-reports" },
  { emoji: "🎤", href: "/interviews" },
  { emoji: "🎙", href: "/podcasts" },
  { emoji: "🎥", href: "/videos" },
  { emoji: "🔎", href: "/special-reports" },
  { emoji: "💬", href: "/category/public-issues" },
  { emoji: "🏙", href: "/category/local-news" },
  { emoji: "📚", href: "/category/education" },
  { emoji: "💼", href: "/category/business" },
  { emoji: "⚽", href: "/category/sports" },
  { emoji: "🎭", href: "/category/entertainment" },
];

export default async function AboutPage() {
  const dict = getDictionary(await getLocale());
  const d = dict.about;
  const teamMembers = await getActiveTeamMembers();

  const MISSION_PILLARS = [
    { icon: MapPin, title: d.coverageLabels.groundReports },
    { icon: MessageSquare, title: dict.home.publicVoiceSection.newsTips },
    { icon: Mic, title: d.interviewsHeading },
    { icon: Users2, title: d.coverageLabels.publicIssues },
    { icon: ShieldCheck, title: d.values.responsibleTitle },
    { icon: Sparkles, title: d.coverageLabels.specialReports },
  ];

  const COVERAGE = [
    { ...COVERAGE_HREFS[0], label: d.coverageLabels.news },
    { ...COVERAGE_HREFS[1], label: d.coverageLabels.groundReports },
    { ...COVERAGE_HREFS[2], label: d.coverageLabels.interviews },
    { ...COVERAGE_HREFS[3], label: d.coverageLabels.podcasts },
    { ...COVERAGE_HREFS[4], label: d.coverageLabels.videoReports },
    { ...COVERAGE_HREFS[5], label: d.coverageLabels.specialReports },
    { ...COVERAGE_HREFS[6], label: d.coverageLabels.publicIssues },
    { ...COVERAGE_HREFS[7], label: d.coverageLabels.localStories },
    { ...COVERAGE_HREFS[8], label: d.coverageLabels.education },
    { ...COVERAGE_HREFS[9], label: d.coverageLabels.business },
    { ...COVERAGE_HREFS[10], label: d.coverageLabels.sports },
    { ...COVERAGE_HREFS[11], label: d.coverageLabels.entertainment },
  ];

  const GROUND_JOURNEY = [
    { icon: MapPin, label: d.journeySteps.location },
    { icon: Search, label: d.journeySteps.investigation },
    { icon: Mic, label: d.journeySteps.interviews },
    { icon: Video, label: d.journeySteps.video },
    { icon: BookOpen, label: d.journeySteps.story },
  ];

  const EDITORIAL_VALUES = [
    { icon: FileCheck2, title: d.values.accuracyTitle, body: d.values.accuracyBody },
    { icon: ShieldCheck, title: d.values.transparencyTitle, body: d.values.transparencyBody },
    { icon: Users2, title: d.values.peopleFirstTitle, body: d.values.peopleFirstBody },
    { icon: Eye, title: d.values.responsibleTitle, body: d.values.responsibleBody },
  ];

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
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-brand-light">{d.eyebrow}</span>
          <h1 className="font-serif text-3xl font-extrabold leading-tight sm:text-5xl">{d.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-white/85 sm:text-xl">
            &ldquo;{SITE.tagline}&rdquo;
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-white/80 sm:text-base">{d.intro}</p>
        </Container>
      </section>

      {/* Who We Are */}
      <Container className="mt-14 max-w-4xl">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">{d.whoWeAreEyebrow}</span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{d.whoWeAreHeading}</h2>
        <p className="mt-4 text-muted">{d.whoWeAreP1}</p>
        <p className="mt-4 text-muted">{d.whoWeAreP2}</p>
      </Container>

      {/* Mission */}
      <Container className="mt-14">
        <div className="rounded-lg border-l-4 border-brand bg-surface-muted p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
            <Target size={14} /> {d.missionEyebrow}
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
          <Eye size={14} /> {d.visionEyebrow}
        </span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{d.visionHeading}</h2>
        <p className="mt-4 text-muted">{d.visionBody}</p>
      </Container>

      {/* What We Cover */}
      <Container className="mt-14">
        <SectionHeading eyebrow={d.coverageEyebrow} title={d.coverageHeading} />
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
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand-light">{d.groundReportingEyebrow}</span>
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">{d.groundReportingHeading}</h2>
          <p className="mt-3 max-w-2xl text-white/80">{d.groundReportingBody}</p>

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
            {d.exploreGroundReports} <ArrowRight size={16} />
          </Link>
        </Container>
      </section>

      {/* Interviews */}
      <Container className="mt-14">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">{d.interviewsEyebrow}</span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{d.interviewsHeading}</h2>
        <p className="mt-3 max-w-2xl text-muted">{d.interviewsBody}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {d.guestTypes.map((g) => (
            <span key={g} className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium">
              {g}
            </span>
          ))}
        </div>
        <Link href="/interviews" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3">
          {d.watchInterviews} <ArrowRight size={16} />
        </Link>
      </Container>

      {/* Podcast */}
      <Container className="mt-14">
        <div className="rounded-lg border border-border bg-surface-muted p-6 sm:p-8">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">{d.podcastEyebrow}</span>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{SITE.podcastBrand.toUpperCase()}</h2>
          <p className="mt-3 max-w-2xl text-muted">{d.podcastBody}</p>
          <Link
            href="/podcasts"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            {d.explorePodcasts} <ArrowRight size={16} />
          </Link>
        </div>
      </Container>

      {/* Editorial Values */}
      <Container className="mt-14">
        <SectionHeading eyebrow={d.editorialValuesEyebrow} title={d.editorialValuesHeading} />
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
      {teamMembers.length > 0 && (
        <Container id="team" className="mt-14 scroll-mt-20">
          <SectionHeading eyebrow={d.teamEyebrow} title={d.teamHeading} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-base font-bold">{m.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand">{m.designation}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted">{m.bio}</p>
                <div className="mt-3 flex items-center gap-2">
                  {m.twitter && (
                    <a href={m.twitter} target="_blank" rel="noreferrer" aria-label={`${m.name} on X`} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                      <FaXTwitter size={13} />
                    </a>
                  )}
                  {m.instagram && (
                    <a href={m.instagram} target="_blank" rel="noreferrer" aria-label={`${m.name} on Instagram`} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                      <FaInstagram size={13} />
                    </a>
                  )}
                  {m.facebook && (
                    <a href={m.facebook} target="_blank" rel="noreferrer" aria-label={`${m.name} on Facebook`} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                      <FaFacebook size={13} />
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                      <FaLinkedinIn size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* CTA */}
      <section className="mt-16 bg-brand text-white">
        <Container className="flex flex-col items-center gap-4 py-12 text-center sm:py-14">
          <Megaphone size={32} />
          <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">{d.ctaHeading}</h2>
          <p className="max-w-xl text-white/85">{d.ctaBody}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/public-voice"
              className="rounded-sm bg-charcoal px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-black"
            >
              {d.sendNewsTip}
            </Link>
            <Link
              href="/contact"
              className="rounded-sm border-2 border-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-white hover:text-brand"
            >
              {d.contactUs}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
