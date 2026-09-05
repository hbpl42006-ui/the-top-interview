import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getAllStates } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "News By Location",
  description: "Browse ground reports, interviews and local news by state and city across India.",
};

export default async function LocationIndexPage() {
  const states = await getAllStates();
  return (
    <div className="py-8 sm:py-10">
      <Container>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand">
          Reporting Footprint
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">News By Location</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Select a state to see ground reports, interviews, local news and videos reported from there.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted">
                  {s.cities.map((city) => (
                    <span key={city} className="rounded-full bg-surface-muted px-2 py-0.5">
                      {city}
                    </span>
                  ))}
                </p>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">
                {s.storyCount} Stories Reported
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
