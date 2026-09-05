import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all news categories from The Top Interview.",
};

export default async function CategoryIndexPage() {
  const categories = await getAllCategories();

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Categories</h1>
        <p className="mt-2 max-w-2xl text-muted">Browse stories by topic.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-5 transition hover:border-brand hover:shadow-md"
            >
              <span className="font-serif text-lg font-bold">{c.name}</span>
              <span className="text-sm font-semibold text-muted">{c.storyCount} stories</span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
