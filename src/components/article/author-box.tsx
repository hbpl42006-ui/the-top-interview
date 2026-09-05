import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Reporter } from "@/lib/types";

export function AuthorBox({ reporter }: { reporter: Reporter }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-surface-muted p-5 sm:flex-row sm:items-center">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Image src={reporter.photo} alt={reporter.name} fill className="object-cover" sizes="64px" />
      </div>
      <div className="flex-1">
        <Link href={`/reporter/${reporter.slug}`} className="font-serif text-lg font-bold hover:text-brand">
          {reporter.name}
        </Link>
        <p className="text-sm text-muted">{reporter.designation}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> {reporter.location}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {reporter.twitter && (
          <a href={reporter.twitter} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
            <FaXTwitter size={14} />
          </a>
        )}
        {reporter.instagram && (
          <a href={reporter.instagram} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
            <FaInstagram size={14} />
          </a>
        )}
        {reporter.email && (
          <a href={`mailto:${reporter.email}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand">
            <Mail size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
