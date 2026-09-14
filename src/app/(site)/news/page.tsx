import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsCard } from "@/components/cards/news-card";
import { Pagination } from "@/components/ui/pagination";
import { getPaginatedNews } from "@/lib/data/news";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Latest News",
  description: "Breaking news, local reporting, politics, business and more from The Top Interview.",
  keywords: ["latest news India", "breaking news India", "Indian news", "current affairs India", "national news India", "latest headlines India"],
  alternates: { canonical: "/news" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { items, totalPages } = await getPaginatedNews({ page: currentPage, pageSize: 12, category });
  const dict = getDictionary(await getLocale());
  const d = dict.listingPages.news;

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{d.heading}</h1>
        <p className="mt-2 max-w-2xl text-muted">{d.intro}</p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-6">
          <Link
            href="/news"
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
              !category ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-brand hover:text-brand"
            )}
          >
            {dict.common.allFilter}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={{ pathname: "/news", query: { category: c } }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition",
                category === c ? "border-brand bg-brand text-white" : "border-border text-muted hover:border-brand hover:text-brand"
              )}
            >
              {c}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="text-lg font-semibold">{d.noResults}</p>
            <p className="mt-1 text-sm">{d.noResultsHint}</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} basePath="/news" query={{ category }} />
          </>
        )}
      </Container>
    </div>
  );
}
