import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoCard } from "@/components/cards/video-card";
import { getAllVideos } from "@/lib/data/videos";

export async function VideosSection() {
  const videos = await getAllVideos(8);
  if (videos.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-muted/60 py-10 sm:py-12">
      <Container>
        <SectionHeading eyebrow="Watch" title="Top Videos" href="/videos" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v.slug} video={v} />
          ))}
        </div>
      </Container>
    </section>
  );
}
