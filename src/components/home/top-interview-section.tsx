import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { InterviewCard } from "@/components/cards/interview-card";
import { getLatestInterviews } from "@/lib/data/interviews";

export async function TopInterviewSection() {
  const items = await getLatestInterviews(4);
  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow="The Core of Our Brand"
          title="The Top Interview"
          subtitle="Direct, on-record conversations with the people shaping — and living — the news."
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
