"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function CorrectionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { dict } = useLanguage();
  const d = dict.correctionForm;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("email"),
          email: form.get("email"),
          department: "Correction",
          message: [
            `Subject: Correction request`,
            `Article URL: ${form.get("url")}`,
            `Issue: ${form.get("issue")}`,
            `Correct information: ${form.get("correction")}`,
            form.get("supporting") ? `Supporting information: ${form.get("supporting")}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface-muted p-6 text-center">
        <CheckCircle2 size={28} className="text-brand" />
        <p className="text-sm font-semibold">{d.thankYou}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.articleUrl}</label>
        <input name="url" type="url" required placeholder="https://thetopinterview.in/news/..." className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.issue}</label>
        <input name="issue" required placeholder={d.issuePlaceholder} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.correctInfo}</label>
        <textarea name="correction" required rows={3} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.supportingInfo}</label>
        <textarea name="supporting" rows={2} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.yourEmail}</label>
        <input name="email" type="email" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      {status === "error" && <p className="text-sm text-brand sm:col-span-2">{d.genericError}</p>}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm bg-charcoal px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
        >
          {status === "loading" ? d.submitting : d.submit}
        </button>
      </div>
    </form>
  );
}
