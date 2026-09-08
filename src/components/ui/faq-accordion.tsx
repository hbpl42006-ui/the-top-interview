import { ChevronDown } from "lucide-react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group p-4 sm:p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold marker:content-none">
            {item.question}
            <ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180" />
          </summary>
          <p className="mt-2 text-sm text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
