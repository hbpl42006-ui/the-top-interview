import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Clock, Mic2 } from "lucide-react";
import { getGroundReportBySlug, getAllGroundReports, getRelatedGroundReports } from "@/lib/data/groundReports";
import { getReporterBySlug } from "@/lib/data/reporters";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ArticleBody } from "@/components/article/article-body";
import { StoryFacts } from "@/components/article/story-facts";
import { ShareButtons } from "@/components/article/share-buttons";
import { AuthorBox } from "@/components/article/author-box";
import { VideoEmbed } from "@/components/article/video-embed";
import { MapEmbed } from "@/components/article/map-embed";
import { CommentsSection } from "@/components/article/comments-section";
import { GroundReportCard } from "@/components/cards/ground-report-card";
import { formatDateTime, formatViews } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, videoObjectSchema } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const reports = await getAllGroundReports();
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = await getGroundReportBySlug(slug);
  if (!report) return {};
  return {
    title: report.headline,
    description: report.excerpt,
    alternates: { canonical: `${SITE.url}/ground-report/${report.slug}` },
    openGraph: { type: "article", title: report.headline, description: report.excerpt, images: [report.image] },
  };
}

export default async function GroundReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getGroundReportBySlug(slug);
  if (!report) notFound();

  const [reporter, relatedFallback] = await Promise.all([
    getReporterBySlug(report.reporter),
    getRelatedGroundReports(report),
  ]);

  return (
    <article className="py-6 sm:py-10">
      {report.videoUrl && (
        <JsonLd
          data={videoObjectSchema({
            name: report.headline,
            description: report.excerpt,
            thumbnailUrl: report.image,
            uploadDate: report.publishedAt,
            embedUrl: report.videoUrl,
          })}
        />
      )}
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Ground Reports", href: "/ground-reports" },
          { label: report.headline, href: `/ground-report/${report.slug}` },
        ])}
      />
      <Container className="max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Ground Reports", href: "/ground-reports" }, { label: report.headline }]} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="brand">🔴 Ground Report</Badge>
          <Badge variant="outline">{report.state}</Badge>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-extrabold leading-tight sm:text-4xl">{report.headline}</h1>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
          <div className="flex items-center gap-3">
            {reporter && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={reporter.photo} alt={reporter.name} fill className="object-cover" sizes="40px" />
              </div>
            )}
            <div className="text-sm">
              <p className="flex items-center gap-1.5 font-bold">
                <Mic2 size={13} className="text-brand" /> {reporter?.name ?? report.reporter}
              </p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {formatDateTime(report.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {report.location}
                </span>
              </p>
            </div>
          </div>
          <ShareButtons title={report.headline} path={`/ground-report/${report.slug}`} />
        </div>

        {report.videoUrl ? (
          <VideoEmbed src={report.videoUrl} title={report.headline} />
        ) : (
          <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg bg-charcoal">
            <Image src={report.image} alt={report.headline} fill priority className="object-cover" sizes="768px" />
          </div>
        )}

        <StoryFacts
          what={report.excerpt}
          where={`${report.location}, ${report.state}`}
          when={formatDateTime(report.publishedAt)}
          who={reporter?.name ?? report.reporter}
          whyItMatters="This ground report brings first-hand, on-location testimony from the community directly affected."
        />

        <ArticleBody paragraphs={report.body} />

        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">Location</p>
        <MapEmbed query={report.mapQuery} />

        <div className="mb-8 flex flex-wrap gap-2">
          {report.tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              #{t}
            </span>
          ))}
        </div>

        <p className="mb-8 text-xs text-muted">{formatViews(report.views)} views</p>

        {reporter && <div className="mb-10"><AuthorBox reporter={reporter} /></div>}

        <div className="mb-10 border-t border-border pt-8">
          <h2 className="mb-5 font-serif text-xl font-bold">More Ground Reports</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedFallback.map((r) => (
              <GroundReportCard key={r.slug} report={r} />
            ))}
          </div>
        </div>

        <CommentsSection articleSlug={report.slug} />
      </Container>
    </article>
  );
}
