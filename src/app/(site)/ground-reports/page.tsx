import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { GroundReportCard } from "@/components/cards/ground-report-card";
import { getAllGroundReports } from "@/lib/data/groundReports";

export const metadata: Metadata = {
  title: "Ground Reports",
  description: "We go to the ground. We talk to the people. We show you the reality — full ground reporting archive.",
};

export default async function GroundReportsPage() {
  const reports = await getAllGroundReports();

  return (
    <div className="py-8 sm:py-10">
      <Container>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">
          Our Signature Coverage
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Ground Report</h1>
        <p className="mt-2 max-w-2xl text-muted">
          We go to the ground. We talk to the people. We show you the reality.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <GroundReportCard key={r.slug} report={r} />
          ))}
        </div>
      </Container>
    </div>
  );
}
