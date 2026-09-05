import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsCard } from "@/components/cards/news-card";
import { GroundReportCard } from "@/components/cards/ground-report-card";
import { MapEmbed } from "@/components/article/map-embed";
import { getStateBySlug, getAllStates } from "@/lib/data/locations";
import { getArticlesByState } from "@/lib/data/news";
import { getGroundReportsByState } from "@/lib/data/groundReports";

export async function generateStaticParams() {
  const states = await getAllStates();
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) return {};
  return { title: `${state.name} News`, description: `Ground reports, interviews and local news from ${state.name}.` };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) notFound();

  const [articles, reports] = await Promise.all([
    getArticlesByState(state.name),
    getGroundReportsByState(state.name),
  ]);

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <MapPin size={14} /> Reporting Footprint
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{state.name}</h1>
        <p className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
          {state.cities.map((c) => (
            <span key={c} className="rounded-full border border-border px-2.5 py-1">
              {c}
            </span>
          ))}
        </p>

        <div className="mt-6">
          <MapEmbed query={state.name} />
        </div>

        {reports.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 font-serif text-xl font-bold">Ground Reports</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <GroundReportCard key={r.slug} report={r} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-5 font-serif text-xl font-bold">Local News</h2>
          {articles.length === 0 ? (
            <p className="text-muted">No news articles published from {state.name} yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
