import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { VideoFilterGrid } from "@/components/video/video-filter-grid";
import { getAllVideos } from "@/lib/data/videos";

export const metadata: Metadata = {
  title: "Top Videos",
  description: "Ground reports, interviews, news and special reports in video from The Top Interview.",
};

export default async function VideosPage() {
  const videos = await getAllVideos();

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Top Videos</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Watch our ground reports, interviews, breaking news and special reports.
        </p>
        <VideoFilterGrid videos={videos} />
      </Container>
    </div>
  );
}
