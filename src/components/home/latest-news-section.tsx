import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsCard } from "@/components/cards/news-card";
import { getLatestNews } from "@/lib/data/news";

export async function LatestNewsSection() {
  const articles = await getLatestNews(7);
  const [main, ...rest] = articles;
  if (!main) return null;

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <SectionHeading eyebrow="Just In" title="Latest News" href="/news" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <NewsCard article={main} />
          </div>
          <div className="flex flex-col gap-6 divide-y divide-border lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6 lg:divide-y-0">
            {rest.slice(0, 6).map((a) => (
              <div key={a.slug} className="pt-6 first:pt-0 lg:pt-0">
                <NewsCard article={a} variant="horizontal" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
