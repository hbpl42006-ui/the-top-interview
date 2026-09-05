import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import { getSpecialReportBySlug, getAllSpecialReports } from "@/lib/data/specialReports";
import { Container } from "@/components/ui/container";
import { ShareButtons } from "@/components/article/share-buttons";
import { MapEmbed } from "@/components/article/map-embed";
import { formatDate, formatViews } from "@/lib/utils";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const reports = await getAllSpecialReports();
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = await getSpecialReportBySlug(slug);
  if (!report) return {};
  return {
    title: report.title,
    description: report.dek,
    alternates: { canonical: `${SITE.url}/special-report/${report.slug}` },
    openGraph: { type: "article", title: report.title, description: report.dek, images: [report.image] },
  };
}

export default async function SpecialReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getSpecialReportBySlug(slug);
  if (!report) notFound();

  return (
    <article className="bg-ink text-white">
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Special Reports", href: "/special-reports" },
          { label: report.title, href: `/special-report/${report.slug}` },
        ])}
      />
      <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image src={report.image} alt={report.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-black/30" />
        <Container className="relative flex h-full flex-col justify-end pb-10">
          <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
            Special Report &middot; Investigative
          </span>
          <h1 className="max-w-3xl font-serif text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {report.title}
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">{report.dek}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {report.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {formatDate(report.publishedAt)}
            </span>
            <span>{formatViews(report.views)} views</span>
          </div>
        </Container>
      </div>

      <Container className="max-w-3xl py-10">
        <ShareButtons title={report.title} path={`/special-report/${report.slug}`} />

        <div className="my-10">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-brand-light">Investigation Timeline</h2>
          <ol className="space-y-4 border-l-2 border-white/15 pl-5">
            {report.timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-brand" />
                <p className="text-xs font-bold uppercase tracking-wide text-brand-light">{t.date}</p>
                <p className="text-sm text-white/85">{t.event}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-10 font-serif text-lg leading-relaxed text-white/90">
          {report.chapters.map((c, i) => (
            <div key={i}>
              <h2 className="mb-3 font-sans text-xl font-extrabold text-white">{c.title}</h2>
              <p>{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-light">Reported From</h2>
          <MapEmbed query={report.location} />
        </div>
      </Container>
    </article>
  );
}
