import Image from "next/image";
import Link from "next/link";
import { MapPin, Mic2, Video, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getLatestGroundReports } from "@/lib/data/groundReports";

export async function FromTheGroundSection() {
  const [report] = await getLatestGroundReports(1);
  if (!report) return null;

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image src={report.image} alt="" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      </div>
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-2xl">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-light">
            From The Ground
          </span>
          <h2 className="font-serif text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            &ldquo;We visited the location to understand what is really happening.&rdquo;
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-brand-light" /> {report.location}
            </span>
            <span className="flex items-center gap-2">
              <Mic2 size={16} className="text-brand-light" /> {report.reporterName}
            </span>
            <span className="flex items-center gap-2">
              <Video size={16} className="text-brand-light" /> Ground Report Video
            </span>
          </div>
          <Link
            href={`/ground-report/${report.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            <PlayCircle size={18} /> Watch The Ground Report
          </Link>
        </div>
      </Container>
    </section>
  );
}
