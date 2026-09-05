import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllStates } from "@/lib/data/locations";

export async function LocationSection() {
  const states = await getAllStates();
  return (
    <section className="py-10 sm:py-12">
      <Container>
        <SectionHeading eyebrow="Reporting Footprint" title="News By Location" href="/location" hrefLabel="View Map" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((s) => (
            <Link
              key={s.slug}
              href={`/location/${s.slug}`}
              className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition hover:border-brand hover:shadow-md"
            >
              <div>
                <span className="flex items-center gap-2 font-serif text-lg font-bold transition group-hover:text-brand">
                  <MapPin size={17} className="text-brand" /> {s.name}
                </span>
                <p className="mt-2 text-xs text-muted">{s.cities.slice(0, 4).join(" · ")}</p>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">
                {s.storyCount} Stories Reported
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
