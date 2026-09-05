import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { InterviewCard } from "@/components/cards/interview-card";
import { getAllInterviews, interviewCategories } from "@/lib/data/interviews";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Interviews",
  description: "The Top Interview — direct conversations with politicians, experts, entrepreneurs, students and everyday people.",
};

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await getAllInterviews();
  const sorted = category ? all.filter((i) => i.category === category) : all;

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">
          The Core of Our Brand
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">The Top Interview</h1>
        <p className="mt-2 max-w-2xl text-muted">
          On-record conversations with politicians, officials, entrepreneurs, teachers, doctors, students and common people shaping the news.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-6">
          <Link
            href="/interviews"
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              !category ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-brand hover:text-brand"
            )}
          >
            All
          </Link>
          {interviewCategories.map((c) => (
            <Link
              key={c}
              href={{ pathname: "/interviews", query: { category: c } }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                category === c ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-brand hover:text-brand"
              )}
            >
              {c}
            </Link>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="text-lg font-semibold">No interviews in this category yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((i) => (
              <InterviewCard key={i.slug} interview={i} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
