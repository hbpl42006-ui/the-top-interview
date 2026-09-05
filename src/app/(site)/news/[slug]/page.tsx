import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Clock, RefreshCcw } from "lucide-react";
import { getArticleBySlug, getAllNews, getRelatedArticles } from "@/lib/data/news";
import { getReporterBySlug } from "@/lib/data/reporters";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ArticleBody } from "@/components/article/article-body";
import { StoryFacts } from "@/components/article/story-facts";
import { FactCheckBadge } from "@/components/article/fact-check-badge";
import { ShareButtons } from "@/components/article/share-buttons";
import { AuthorBox } from "@/components/article/author-box";
import { RelatedStories } from "@/components/article/related-stories";
import { VideoEmbed } from "@/components/article/video-embed";
import { CommentsSection } from "@/components/article/comments-section";
import { formatDateTime, formatViews, categorySlug } from "@/lib/utils";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd, newsArticleSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const articles = await getAllNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.headline,
    description: article.excerpt,
    alternates: { canonical: `${SITE.url}/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.headline,
      description: article.excerpt,
      images: [article.image],
      publishedTime: article.publishedAt,
    },
    twitter: { card: "summary_large_image", title: article.headline, description: article.excerpt },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [reporter, related] = await Promise.all([
    getReporterBySlug(article.reporter),
    getRelatedArticles(article),
  ]);

  return (
    <article className="py-6 sm:py-10">
      <JsonLd data={newsArticleSchema(article)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: article.category, href: `/category/${categorySlug(article.category)}` },
          { label: article.headline, href: `/news/${article.slug}` },
        ])}
      />
      <Container className="max-w-3xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: article.category, href: `/category/${categorySlug(article.category)}` },
            { label: article.headline },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="brand">{article.category}</Badge>
          {article.contentLabel && article.contentLabel !== "News" && (
            <Badge variant="charcoal">{article.contentLabel}</Badge>
          )}
          {article.isBreaking && <Badge variant="live">Breaking</Badge>}
          {article.factCheck && <FactCheckBadge status={article.factCheck} />}
        </div>

        <h1 className="mt-3 font-serif text-3xl font-extrabold leading-tight sm:text-4xl">{article.headline}</h1>
        <p className="mt-3 text-lg text-muted">{article.subheadline}</p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
          <div className="flex items-center gap-3">
            {reporter && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={reporter.photo} alt={reporter.name} fill className="object-cover" sizes="40px" />
              </div>
            )}
            <div className="text-sm">
              <p className="font-bold">{reporter?.name ?? article.reporter}</p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {formatDateTime(article.publishedAt)}
                </span>
                {article.updatedAt && (
                  <span className="flex items-center gap-1">
                    <RefreshCcw size={11} /> Updated {formatDateTime(article.updatedAt)}
                  </span>
                )}
                {article.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {article.location}
                  </span>
                )}
              </p>
            </div>
          </div>
          <ShareButtons title={article.headline} path={`/news/${article.slug}`} />
        </div>

        <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg bg-charcoal">
          <Image src={article.image} alt={article.headline} fill priority className="object-cover" sizes="768px" />
        </div>

        <StoryFacts
          what={article.excerpt}
          where={`${article.location ?? article.state ?? "N/A"}${article.state ? `, ${article.state}` : ""}`}
          when={formatDateTime(article.publishedAt)}
          who={reporter?.name ?? article.reporter}
          whyItMatters={article.keyPoints?.[0] ?? "This story affects the community directly involved and reflects a broader public issue worth tracking."}
        />

        {article.videoUrl && <VideoEmbed src={article.videoUrl} title={article.headline} />}

        <ArticleBody paragraphs={article.body} quote={article.quote} keyPoints={article.keyPoints} />

        <AdSlot label="Advertisement" size="banner" className="mb-8" />

        <div className="mb-8 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              #{t}
            </span>
          ))}
        </div>

        <p className="mb-8 text-xs text-muted">{formatViews(article.views)} views &middot; {article.readMinutes} min read</p>

        {reporter && <div className="mb-10"><AuthorBox reporter={reporter} /></div>}

        <div className="mb-10">
          <RelatedStories articles={related} />
        </div>

        <CommentsSection articleSlug={article.slug} />
      </Container>
    </article>
  );
}
