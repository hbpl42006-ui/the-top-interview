import { NewsArticle } from "@/lib/types";
import { NewsCard } from "@/components/cards/news-card";

export function RelatedStories({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <div className="border-t border-border pt-8">
      <h2 className="mb-5 font-serif text-xl font-bold">Related Stories</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {articles.map((a) => (
          <NewsCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
