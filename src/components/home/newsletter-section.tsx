import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { getLocale, getDictionary } from "@/lib/i18n";

export { NewsletterForm };

export async function NewsletterSection() {
  const dict = getDictionary(await getLocale());
  return (
    <section className="border-y border-border bg-ink text-white">
      <Container className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-light">{dict.newsletter.eyebrow}</span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{dict.newsletter.heading}</h2>
        <p className="max-w-xl text-sm text-white/70">{dict.newsletter.body}</p>
        <NewsletterForm />
      </Container>
    </section>
  );
}
