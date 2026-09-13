"use client";

import { useState, type FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { dict } = useLanguage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={cn("flex items-center gap-2 text-sm font-semibold text-brand", compact && "text-foreground")}>
        <CheckCircle2 size={18} /> {dict.newsletter.subscribed}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <div className="relative flex-1">
        <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={dict.newsletter.placeholder}
          className={cn(
            "w-full rounded-sm border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand",
            compact && "py-2"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-sm bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" ? dict.newsletter.subscribing : dict.newsletter.subscribe}
      </button>
    </form>
  );
}
