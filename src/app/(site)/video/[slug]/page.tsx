import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlug, getAllVideos, getRelatedVideos } from "@/lib/data/videos";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ShareButtons } from "@/components/article/share-buttons";
import { VideoCard } from "@/components/cards/video-card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatViews } from "@/lib/utils";
import { JsonLd, videoObjectSchema } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const CATEGORY_LABEL: Record<string, string> = {
  "ground-report": "Ground Report",
  interview: "Interview",
  news: "News",
  podcast: "Podcast",
  "special-report": "Special Report",
};

export async function generateStaticParams() {
  const videos = await getAllVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return {};
  return {
    title: video.title,
    description: `Watch: ${video.title} — ${SITE.name}`,
    alternates: { canonical: `${SITE.url}/video/${video.slug}` },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const relatedFallback = await getRelatedVideos(video, 4);

  return (
    <div className="py-6 sm:py-10">
      <JsonLd
        data={videoObjectSchema({
          name: video.title,
          description: video.title,
          thumbnailUrl: video.thumbnail,
          uploadDate: video.publishedAt,
          embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
        })}
      />
      <Container className="max-w-4xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Videos", href: "/videos" }, { label: video.title }]} />

        <div className="relative my-4 aspect-video w-full overflow-hidden rounded-lg bg-charcoal">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{CATEGORY_LABEL[video.category]}</Badge>
        </div>
        <h1 className="mt-2 font-serif text-2xl font-extrabold leading-tight sm:text-3xl">{video.title}</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
          <p className="text-sm text-muted">
            {formatViews(video.views)} views &middot; {formatDateTime(video.publishedAt)}
          </p>
          <ShareButtons title={video.title} path={`/video/${video.slug}`} />
        </div>

        <div className="mt-10">
          <h2 className="mb-5 font-serif text-xl font-bold">More Videos</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {relatedFallback.map((v) => (
              <VideoCard key={v.slug} video={v} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
