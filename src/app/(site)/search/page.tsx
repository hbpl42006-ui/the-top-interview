import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SearchPageClient } from "@/components/search/search-page-client";
import { getLocale, getDictionary } from "@/lib/i18n";

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
  const dict = getDictionary(await getLocale());
  return (
    <div className="py-8 sm:py-10">
      <Container className="max-w-2xl">
        <h1 className="mb-6 font-serif text-3xl font-extrabold sm:text-4xl">{dict.listingPages.search.heading}</h1>
        <SearchPageClient initialQuery={q ?? ""} />
      </Container>
    </div>
  );
}
