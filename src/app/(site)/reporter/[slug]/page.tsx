import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Mail } from "lucide-react";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { getReporterBySlug, getAllReporters } from "@/lib/data/reporters";
import { getArticlesByReporter } from "@/lib/data/news";
import { getGroundReportsByReporter } from "@/lib/data/groundReports";
import { getInterviewsByReporter } from "@/lib/data/interviews";
import { Container } from "@/components/ui/container";
import { NewsCard } from "@/components/cards/news-card";
import { GroundReportCard } from "@/components/cards/ground-report-card";
import { InterviewCard } from "@/components/cards/interview-card";

export async function generateStaticParams() {
  const reporters = await getAllReporters();
  return reporters.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const reporter = await getReporterBySlug(slug);
  if (!reporter) return {};
  return { title: reporter.name, description: reporter.bio };
}

export default async function ReporterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reporter = await getReporterBySlug(slug);
  if (!reporter) notFound();

  const [allArticles, reports, reporterInterviews] = await Promise.all([
    getArticlesByReporter(reporter.slug),
    getGroundReportsByReporter(reporter.slug),
    getInterviewsByReporter(reporter.slug),
  ]);
  const articles = allArticles.filter((a) => a.type === "news");

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <div className="flex flex-col items-center gap-5 border-b border-border pb-8 text-center sm:flex-row sm:text-left">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-brand">
            <Image src={reporter.photo} alt={reporter.name} fill className="object-cover" sizes="112px" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold">{reporter.name}</h1>
            <p className="mt-1 text-brand font-bold">{reporter.designation}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
              <MapPin size={14} /> {reporter.location}
            </p>
            <p className="mt-3 max-w-2xl text-sm text-muted">{reporter.bio}</p>
            <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
              {reporter.twitter && (
                <a href={reporter.twitter} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                  <FaXTwitter size={15} />
                </a>
              )}
              {reporter.instagram && (
                <a href={reporter.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                  <FaInstagram size={15} />
                </a>
              )}
              {reporter.email && (
                <a href={`mailto:${reporter.email}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
                  <Mail size={15} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center sm:max-w-md">
          <Stat label="Articles" value={reporter.articleCount} />
          <Stat label="Ground Reports" value={reporter.groundReportCount} />
          <Stat label="Interviews" value={reporter.interviewCount} />
        </div>

        {reports.length > 0 && (
          <Section title="Ground Reports">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <GroundReportCard key={r.slug} report={r} />
              ))}
            </div>
          </Section>
        )}

        {reporterInterviews.length > 0 && (
          <Section title="Interviews">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reporterInterviews.map((i) => (
                <InterviewCard key={i.slug} interview={i} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Articles">
          {articles.length === 0 ? (
            <p className="text-muted">No news articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </Section>
      </Container>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted py-4">
      <p className="font-serif text-2xl font-extrabold text-brand">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="mb-5 font-serif text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
