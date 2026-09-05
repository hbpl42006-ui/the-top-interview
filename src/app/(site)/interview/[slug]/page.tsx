import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getInterviewBySlug, getAllInterviews, getRelatedInterviews } from "@/lib/data/interviews";
import { getReporterBySlug } from "@/lib/data/reporters";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ArticleBody } from "@/components/article/article-body";
import { ShareButtons } from "@/components/article/share-buttons";
import { VideoEmbed } from "@/components/article/video-embed";
import { CommentsSection } from "@/components/article/comments-section";
import { InterviewCard } from "@/components/cards/interview-card";
import { formatDateTime, formatViews } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, videoObjectSchema } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const items = await getAllInterviews();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);
  if (!interview) return {};
  return {
    title: `${interview.guest}: ${interview.topic}`,
    description: interview.excerpt,
    alternates: { canonical: `${SITE.url}/interview/${interview.slug}` },
    openGraph: { type: "article", title: interview.guest, description: interview.excerpt, images: [interview.thumbnail] },
  };
}

export default async function InterviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);
  if (!interview) notFound();

  const [reporter, relatedFallback] = await Promise.all([
    getReporterBySlug(interview.reporter),
    getRelatedInterviews(interview),
  ]);

  return (
    <article className="py-6 sm:py-10">
      {interview.videoUrl && (
        <JsonLd
          data={videoObjectSchema({
            name: `${interview.guest}: ${interview.topic}`,
            description: interview.excerpt,
            thumbnailUrl: interview.thumbnail,
            uploadDate: interview.publishedAt,
            embedUrl: interview.videoUrl,
          })}
        />
      )}
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Interviews", href: "/interviews" },
          { label: interview.guest, href: `/interview/${interview.slug}` },
        ])}
      />
      <Container className="max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Interviews", href: "/interviews" }, { label: interview.guest }]} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="brand">The Top Interview</Badge>
          <Badge variant="outline">{interview.category}</Badge>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-extrabold leading-tight sm:text-4xl">{interview.topic}</h1>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-brand">
              <Image src={interview.guestPhoto} alt={interview.guest} fill className="object-cover" sizes="48px" />
            </div>
            <div className="text-sm">
              <p className="font-bold">{interview.guest}</p>
              <p className="text-xs text-muted">{interview.guestDesignation}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <Clock size={11} /> {formatDateTime(interview.publishedAt)} &middot; {interview.duration}
              </p>
            </div>
          </div>
          <ShareButtons title={interview.topic} path={`/interview/${interview.slug}`} />
        </div>

        {interview.videoUrl && <VideoEmbed src={interview.videoUrl} title={interview.topic} />}

        <ArticleBody paragraphs={interview.body} />

        <div className="mb-8 flex flex-wrap gap-2">
          {interview.tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              #{t}
            </span>
          ))}
        </div>

        <p className="mb-8 text-xs text-muted">
          Interviewed by {reporter?.name ?? interview.reporter} &middot; {formatViews(interview.views)} views
        </p>

        <div className="mb-10 border-t border-border pt-8">
          <h2 className="mb-5 font-serif text-xl font-bold">More Interviews</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedFallback.map((i) => (
              <InterviewCard key={i.slug} interview={i} />
            ))}
          </div>
        </div>

        <CommentsSection articleSlug={interview.slug} />
      </Container>
    </article>
  );
}
