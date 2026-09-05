import { Quote } from "lucide-react";

export function ArticleBody({
  paragraphs,
  quote,
  keyPoints,
}: {
  paragraphs: string[];
  quote?: { text: string; attribution: string };
  keyPoints?: string[];
}) {
  const midpoint = Math.ceil(paragraphs.length / 2);

  return (
    <div className="prose-tti max-w-none font-serif text-[1.05rem] leading-[1.85] text-foreground">
      {keyPoints && keyPoints.length > 0 && (
        <div className="mb-6 rounded-lg border border-border bg-surface-muted p-5 font-sans">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-brand">Key Points</p>
          <ul className="space-y-1.5">
            {keyPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {paragraphs.slice(0, midpoint).map((p, i) => (
        <p key={i} className="mb-5">
          {p}
        </p>
      ))}

      {quote && (
        <blockquote className="my-8 border-l-4 border-brand bg-surface-muted py-4 pl-6 pr-4 font-sans">
          <Quote size={22} className="mb-2 text-brand" />
          <p className="font-serif text-xl font-semibold italic leading-snug text-foreground">&ldquo;{quote.text}&rdquo;</p>
          <cite className="mt-2 block text-sm not-italic text-muted">&mdash; {quote.attribution}</cite>
        </blockquote>
      )}

      {paragraphs.slice(midpoint).map((p, i) => (
        <p key={i + midpoint} className="mb-5">
          {p}
        </p>
      ))}
    </div>
  );
}
