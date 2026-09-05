import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-10 sm:py-14">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <div className="prose-tti mt-8 space-y-5 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
        <p className="mt-10 text-sm text-muted">
          Questions about this policy? Contact us at{" "}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-brand hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
