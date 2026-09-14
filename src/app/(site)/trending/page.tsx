import type { Metadata } from "next";
import Link from "next/link";
import { Flame } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getTrendingNews } from "@/lib/data/news";
import { formatViews } from "@/lib/utils";
import { getLocale, getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Trending Now",
  description: "The most-read stories on The Top Interview right now.",
  keywords: ["trending news India", "latest trending news", "viral news India", "breaking stories India"],
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const items = await getTrendingNews(16);
  const dict = getDictionary(await getLocale());

  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <Flame size={14} /> {dict.home.trending.eyebrow}
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{dict.home.trending.title}</h1>

        <ol className="mt-8 divide-y divide-border">
          {items.map((item, idx) => (
            <li key={item.slug}>
              <Link
                href={`/news/${item.slug}`}
                className="group flex items-center gap-4 py-4"
              >
                <span className="w-10 shrink-0 font-serif text-3xl font-extrabold text-border transition group-hover:text-brand">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-brand">{item.category}</span>
                  <h3 className="line-clamp-1 font-semibold transition group-hover:text-brand">{item.headline}</h3>
                </div>
                <span className="hidden shrink-0 text-xs font-semibold text-muted sm:block">
                  {formatViews(item.views)} {dict.listingPages.trending.views}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
