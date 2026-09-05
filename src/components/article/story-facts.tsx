import { HelpCircle, MapPin, Clock3, UserRound, Sparkles } from "lucide-react";

export function StoryFacts({
  what,
  where,
  when,
  who,
  whyItMatters,
}: {
  what: string;
  where: string;
  when: string;
  who: string;
  whyItMatters: string;
}) {
  const rows = [
    { icon: HelpCircle, label: "What?", value: what },
    { icon: MapPin, label: "Where?", value: where },
    { icon: Clock3, label: "When?", value: when },
    { icon: UserRound, label: "Who?", value: who },
    { icon: Sparkles, label: "Why It Matters?", value: whyItMatters },
  ];

  return (
    <div className="my-6 rounded-lg border-l-4 border-brand bg-surface-muted p-5">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-brand">At a Glance</p>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2.5">
            <r.icon size={16} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">{r.label}</dt>
              <dd className="text-sm font-medium text-foreground">{r.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
