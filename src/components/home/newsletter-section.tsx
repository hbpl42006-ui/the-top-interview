"use client";

import { useState, type FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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
        <CheckCircle2 size={18} /> You&apos;re subscribed. Watch your inbox.
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
          placeholder="Your email address"
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
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="border-y border-border bg-ink text-white">
      <Container className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-light">
          The Top Interview Newsletter
        </span>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          Get important stories directly in your inbox.
        </h2>
        <p className="max-w-xl text-sm text-white/70">
          Ground reports, interviews and public-interest stories — curated once a day, no spam.
        </p>
        <NewsletterForm />
      </Container>
    </section>
  );
}
