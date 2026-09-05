import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SearchPageClient } from "@/components/search/search-page-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search news, ground reports, interviews, podcasts and reporters on The Top Interview.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-2xl">
        <h1 className="mb-6 font-serif text-3xl font-extrabold sm:text-4xl">Search</h1>
        <SearchPageClient initialQuery={q ?? ""} />
      </Container>
    </div>
  );
}
