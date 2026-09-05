import type { Metadata } from "next";
import Link from "next/link";
import { Mic2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PodcastCard } from "@/components/cards/podcast-card";
import { getAllEpisodes, getFeaturedEpisodes, podcastCategories } from "@/lib/data/podcasts";
import { PODCAST_PLATFORMS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: SITE.podcastBrand,
  description: "Long-form conversations, expert interviews and ground-report debriefs from The Top Interview Podcasts.",
};

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [all, featured] = await Promise.all([getAllEpisodes(), getFeaturedEpisodes()]);
  const sorted = category ? all.filter((e) => e.category === category) : all;

  return (
    <div className="bg-ink py-10 text-white sm:py-14">
      <Container>
        <div className="mb-8 text-center">
          <span className="mb-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
            <Mic2 size={14} /> Conversational &middot; Entertainment-Friendly
          </span>
          <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{SITE.podcastBrand}</h1>
          <p className="mx-auto mt-2 max-w-xl text-white/70">
            Long-form conversations, expert interviews and ground-report debriefs from The Top Interview&apos;s newsroom.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-white/80">
            {PODCAST_PLATFORMS.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 border-b border-white/10 pb-6">
          <Link
            href="/podcasts"
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              !category ? "border-brand bg-brand text-white" : "border-white/20 text-white/70 hover:border-brand"
            )}
          >
            All
          </Link>
          {podcastCategories.map((c) => (
            <Link
              key={c}
              href={{ pathname: "/podcasts", query: { category: c } }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                category === c ? "border-brand bg-brand text-white" : "border-white/20 text-white/70 hover:border-brand"
              )}
            >
              {c}
            </Link>
          ))}
        </div>

        {!category && (
          <div className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">Featured Guests</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {featured.map((e) => (
                <PodcastCard key={e.slug} episode={e} large />
              ))}
            </div>
          </div>
        )}

        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">All Episodes</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((e) => (
            <PodcastCard key={e.slug} episode={e} />
          ))}
        </div>
      </Container>
    </div>
  );
}
