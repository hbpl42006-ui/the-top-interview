import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NewsCard } from "@/components/cards/news-card";
import { CATEGORIES } from "@/lib/constants";
import { getArticlesByCategory } from "@/lib/data/news";
import { categorySlug } from "@/lib/utils";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: categorySlug(c) }));
}

function resolveCategory(slug: string) {
  return CATEGORIES.find((c) => categorySlug(c) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) return {};
  return { title: category, description: `Latest ${category} stories from The Top Interview.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category);

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">Category</span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{category}</h1>

        {articles.length === 0 ? (
          <div className="py-16 text-center text-muted">
            <p className="text-lg font-semibold">No stories published in {category} yet.</p>
            <p className="mt-1 text-sm">Our reporters are on it — check back soon.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <NewsCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
