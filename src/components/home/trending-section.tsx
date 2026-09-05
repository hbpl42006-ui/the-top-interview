import Link from "next/link";
import { Flame } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getTrendingNews } from "@/lib/data/news";
import { formatViews } from "@/lib/utils";

export async function TrendingSection() {
  const items = await getTrendingNews(5);
  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <SectionHeading eyebrow="Right Now" title="Trending Now" href="/trending" />
        <ol className="divide-y divide-border">
          {items.map((item, idx) => (
            <li key={item.slug}>
              <Link
                href={`/news/${item.slug}`}
                className="group flex items-center gap-4 py-4"
              >
                <span className="w-8 shrink-0 font-serif text-3xl font-extrabold text-border transition group-hover:text-brand">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-brand">{item.category}</span>
                  <h3 className="line-clamp-1 font-semibold transition group-hover:text-brand">{item.headline}</h3>
                </div>
                <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-muted sm:flex">
                  <Flame size={13} className="text-brand" /> {formatViews(item.views)} views
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
