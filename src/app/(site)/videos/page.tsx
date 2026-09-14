import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { VideoFilterGrid } from "@/components/video/video-filter-grid";
import { getAllVideos } from "@/lib/data/videos";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Top Videos",
  description: "Ground reports, interviews, news and special reports in video from The Top Interview.",
  keywords: ["news videos India", "video interviews India", "breaking news videos", "latest news videos India", "political videos India"],
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const videos = await getAllVideos();
  const dict = getDictionary(await getLocale());
  const d = dict.listingPages.videos;

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{d.heading}</h1>
        <p className="mt-2 max-w-2xl text-muted">{d.intro}</p>
        <VideoFilterGrid videos={videos} />
      </Container>
    </div>
  );
}
