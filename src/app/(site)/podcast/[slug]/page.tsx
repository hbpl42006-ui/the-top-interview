import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Music2, Apple } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";
import { getEpisodeBySlug, getAllEpisodes, getRelatedEpisodes } from "@/lib/data/podcasts";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { ShareButtons } from "@/components/article/share-buttons";
import { PodcastPlayButton } from "@/components/podcast/podcast-play-button";
import { PodcastCard } from "@/components/cards/podcast-card";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const episodes = await getAllEpisodes();
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return {};
  return {
    title: `${episode.title} — ${SITE.podcastBrand}`,
    description: episode.description,
    alternates: { canonical: `${SITE.url}/podcast/${episode.slug}` },
    openGraph: { type: "article", title: episode.title, description: episode.description, images: [episode.cover] },
  };
}

export default async function PodcastEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) notFound();

  const relatedFallback = await getRelatedEpisodes(episode);

  return (
    <div className="bg-ink py-8 text-white sm:py-10">
      <Container className="max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Podcasts", href: "/podcasts" }, { label: episode.title }]} />

        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="relative mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-xl shadow-xl sm:mx-0">
            <Image src={episode.cover} alt={episode.title} fill className="object-cover" sizes="192px" priority />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <Badge variant="brand">Episode {episode.episodeNumber}</Badge>
            <h1 className="mt-2 font-serif text-2xl font-extrabold leading-tight sm:text-3xl">{episode.title}</h1>
            <p className="mt-1 font-semibold text-white/80">{episode.guest}</p>
            <p className="mt-1 text-sm text-white/60">
              {formatDate(episode.publishedAt)} &middot; {episode.duration}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <PodcastPlayButton episode={episode} />
              {episode.youtubeUrl && (
                <a href={episode.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-brand">
                  <FaYoutube size={14} /> YouTube
                </a>
              )}
              {episode.spotifyUrl && (
                <a href={episode.spotifyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-brand">
                  <Music2 size={14} /> Spotify
                </a>
              )}
              {episode.applePodcastsUrl && (
                <a href={episode.applePodcastsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-brand">
                  <Apple size={14} /> Apple Podcasts
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">About This Episode</h2>
          <p className="text-white/85">{episode.description}</p>
        </div>

        <div className="mt-4 text-white">
          <ShareButtons title={episode.title} path={`/podcast/${episode.slug}`} />
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <h2 className="mb-5 font-serif text-xl font-bold">More Episodes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedFallback.map((e) => (
              <PodcastCard key={e.slug} episode={e} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
