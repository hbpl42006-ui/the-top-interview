import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import { getAllSpecialReports } from "@/lib/data/specialReports";

export async function SpecialReportsSection() {
  const specialReports = await getAllSpecialReports();
  const [main, ...rest] = specialReports;
  if (!main) return null;

  return (
    <section className="border-y border-border bg-ink py-12 text-white sm:py-16">
      <Container>
        <div className="mb-8 flex items-end justify-between border-b-2 border-brand pb-4">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
              Investigative &middot; Long-Form
            </span>
            <h2 className="font-serif text-2xl font-extrabold sm:text-3xl">Special Report</h2>
          </div>
          <Link href="/special-reports" className="text-sm font-semibold text-brand-light hover:underline">
            All Reports
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Link href={`/special-report/${main.slug}`} className="group lg:col-span-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image src={main.image} alt={main.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-light">{main.location}</p>
                <h3 className="font-serif text-2xl font-extrabold leading-tight sm:text-3xl">{main.title}</h3>
                <p className="mt-2 hidden max-w-xl text-sm text-white/80 sm:block">{main.dek}</p>
              </div>
            </div>
          </Link>
          <div className="flex flex-col gap-5">
            {rest.map((r) => (
              <Link key={r.slug} href={`/special-report/${r.slug}`} className="group flex gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md">
                  <Image src={r.image} alt={r.title} fill className="object-cover transition group-hover:scale-105" sizes="112px" />
                </div>
                <div className="min-w-0">
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug transition group-hover:text-brand-light">
                    {r.title}
                  </h4>
                  <p className="mt-1 text-xs text-white/60">{formatDate(r.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
