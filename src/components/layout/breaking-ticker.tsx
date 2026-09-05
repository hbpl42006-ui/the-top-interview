import Link from "next/link";
import { getBreakingNews, getLatestNews } from "@/lib/data/news";

export async function BreakingTicker() {
  const breaking = await getBreakingNews();
  const items = breaking.length > 0 ? breaking : await getLatestNews(4);
  const doubled = [...items, ...items];
  if (items.length === 0) return null;

  return (
    <div className="border-b border-border bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="flex shrink-0 items-center gap-1.5 bg-brand px-3 py-2 text-xs font-extrabold uppercase tracking-wide sm:px-4 sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-live-pulse rounded-full bg-white" />
          </span>
          Breaking
        </div>
        <div className="relative flex flex-1 overflow-hidden">
          <div className="animate-ticker flex shrink-0 items-center gap-10 whitespace-nowrap py-2 pl-6 pr-10 text-sm">
            {doubled.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/news/${item.slug}`}
                className="transition hover:text-brand-light"
              >
                {item.headline}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
