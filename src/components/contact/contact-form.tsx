"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Paperclip } from "lucide-react";
import { CONTACT_DEPARTMENTS, SITE } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialDept = searchParams.get("department") ?? "General Enquiry";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const { dict } = useLanguage();
  const d = dict.contactForm;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("loading");

    const subject = String(form.get("subject") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const rawMessage = String(form.get("message") || "").trim();
    const noteLines = [
      phone && `Phone: ${phone}`,
      fileName && `Attachment mentioned: ${fileName} (please also email this file directly — it isn't uploaded here yet)`,
    ].filter(Boolean);
    const message = [rawMessage, noteLines.length ? `\n---\n${noteLines.join("\n")}` : ""].join("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          department: form.get("department"),
          message: subject ? `Subject: ${subject}\n\n${message}` : message,
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
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface-muted p-8 text-center">
        <CheckCircle2 size={32} className="text-brand" />
        <p className="font-semibold">{d.thankYou}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.fullName}</label>
          <input name="name" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.emailAddress}</label>
          <input type="email" name="email" required className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.phoneNumber}</label>
          <input type="tel" name="phone" placeholder={d.phoneOptional} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.enquiryType}</label>
          <select name="department" defaultValue={initialDept} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
            {CONTACT_DEPARTMENTS.map((dep) => (
              <option key={dep} value={dep}>
                {d.enquiryTypeLabels[dep]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.subject}</label>
        <input name="subject" required placeholder={d.subjectPlaceholder} className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">{d.message}</label>
        <textarea name="message" required rows={5} className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div>
        <label className="mb-1.5 flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border px-3 py-2.5 text-sm text-muted transition hover:border-brand hover:text-brand">
          <Paperclip size={16} />
          {fileName || d.attachFile}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <p className="text-xs text-muted">
          {d.attachHint}{" "}
          <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">{SITE.email}</a>.
        </p>
      </div>
      {status === "error" && <p className="text-sm text-brand">{d.genericError}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" ? d.sending : d.sendMessage}
      </button>
    </form>
  );
}
