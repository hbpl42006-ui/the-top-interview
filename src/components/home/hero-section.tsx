import Image from "next/image";
import Link from "next/link";
import { MapPin, User, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsCard } from "@/components/cards/news-card";
import { getFeaturedNews } from "@/lib/data/news";
import { getReporterBySlug } from "@/lib/data/reporters";
import { formatDateTime } from "@/lib/utils";

export async function HeroSection() {
  const featured = await getFeaturedNews();
  const [lead, ...rest] = featured;
  if (!lead) return null;
  const reporter = await getReporterBySlug(lead.reporter);
  const secondary = rest.slice(0, 3);

  return (
    <section className="border-b border-border bg-surface py-6 sm:py-8">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link href={`/news/${lead.slug}`} className="group block">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-charcoal sm:aspect-video">
                <Image
                  src={lead.image}
                  alt={lead.headline}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {lead.type === "ground-report" && (
                  <span className="absolute left-4 top-4 rounded-sm bg-brand px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                    🔴 Ground Report
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
                    <span className="rounded-sm bg-white/15 px-2 py-1 backdrop-blur-sm">{lead.category}</span>
                    {lead.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {lead.location}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    {lead.headline}
                  </h1>
                  <p className="mt-2 hidden max-w-2xl text-sm text-white/80 sm:block">{lead.subheadline}</p>
                </div>
              </div>
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <User size={14} /> {reporter?.name ?? lead.reporter}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {formatDateTime(lead.publishedAt)}
                </span>
              </div>
              <Link
                href={`/news/${lead.slug}`}
                className="flex items-center gap-1 text-sm font-bold text-brand transition hover:gap-2"
              >
                Read Full Story <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-1">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">More Top Stories</h2>
            <div className="flex flex-col divide-y divide-border">
              {secondary.map((article) => (
                <div key={article.slug} className="py-4 first:pt-0">
                  <NewsCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
