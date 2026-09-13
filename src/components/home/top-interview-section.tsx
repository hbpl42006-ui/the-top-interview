import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { InterviewCard } from "@/components/cards/interview-card";
import { getLatestInterviews } from "@/lib/data/interviews";
import { getLocale, getDictionary } from "@/lib/i18n";

export async function TopInterviewSection() {
  const dict = getDictionary(await getLocale());
  const items = await getLatestInterviews(4);
  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow={dict.home.topInterview.eyebrow}
          title={dict.home.topInterview.title}
          subtitle={dict.home.topInterview.subtitle}
          href="/interviews"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <InterviewCard key={i.slug} interview={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
