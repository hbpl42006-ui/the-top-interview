import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllSpecialReports } from "@/lib/data/specialReports";
import { formatDate, formatViews } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Special Reports",
  description: "In-depth, long-form investigative journalism from The Top Interview.",
};

export default async function SpecialReportsPage() {
  const specialReports = await getAllSpecialReports();
  return (
    <div className="bg-ink py-10 text-white sm:py-14">
      <Container>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand-light">
          Investigative &middot; Long-Form
        </span>
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">Special Reports</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Deep investigations into public issues, backed by documents, data and months of on-ground reporting.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {specialReports.map((r) => (
            <Link key={r.slug} href={`/special-report/${r.slug}`} className="group">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                <Image src={r.image} alt={r.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-light">{r.location}</p>
                  <h2 className="font-serif text-xl font-extrabold leading-tight sm:text-2xl">{r.title}</h2>
                  <p className="mt-2 hidden text-sm text-white/80 sm:block">{r.dek}</p>
                  <p className="mt-3 text-xs text-white/60">
                    {formatDate(r.publishedAt)} &middot; {formatViews(r.views)} views
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
