import Link from "next/link";
import { Mic2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PodcastCard } from "@/components/cards/podcast-card";
import { getFeaturedEpisodes, getLatestEpisodes, getPopularEpisodes } from "@/lib/data/podcasts";
import { SITE } from "@/lib/constants";

export async function PodcastSection() {
  const [latest, popular, featured] = await Promise.all([
    getLatestEpisodes(3),
    getPopularEpisodes(4),
    getFeaturedEpisodes(),
  ]);
  if (latest.length === 0) return null;

  return (
    <section className="bg-ink py-12 text-white sm:py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-brand pb-4">
          <div>
            <span className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
              <Mic2 size={14} /> The Top Interview
            </span>
            <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">{SITE.podcastBrand}</h2>
          </div>
          <Link href="/podcasts" className="flex items-center gap-1 text-sm font-semibold text-brand-light transition hover:gap-2">
            All Episodes <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mb-10">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">Latest Episodes</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {latest.map((e) => (
              <PodcastCard key={e.slug} episode={e} large />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">Popular Episodes</h3>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {popular.map((e) => (
                <PodcastCard key={e.slug} episode={e} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/60">Featured Guests</h3>
            <ul className="space-y-3">
              {featured.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/podcast/${e.slug}`}
                    className="flex items-center justify-between rounded-md border border-white/10 px-4 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand-light"
                  >
                    {e.guest}
                    <span className="text-xs font-normal text-white/50">Ep. {e.episodeNumber}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
