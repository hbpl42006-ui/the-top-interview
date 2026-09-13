import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GroundReportCard } from "@/components/cards/ground-report-card";
import { getLatestGroundReports } from "@/lib/data/groundReports";
import { getLocale, getDictionary } from "@/lib/i18n";

export async function GroundReportsSection() {
  const dict = getDictionary(await getLocale());
  const reports = await getLatestGroundReports(3);
  if (reports.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-muted/60 py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow={dict.home.groundReportSection.eyebrow}
          title={dict.home.groundReportSection.title}
          subtitle={dict.home.groundReportSection.subtitle}
          href="/ground-reports"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <GroundReportCard key={r.slug} report={r} />
          ))}
        </div>
      </Container>
    </section>
  );
}
