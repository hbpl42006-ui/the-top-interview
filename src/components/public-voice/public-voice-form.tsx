"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Paperclip, AlertTriangle } from "lucide-react";
import { TIP_CATEGORIES } from "@/lib/constants";

export function PublicVoiceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      contact: String(form.get("contact") || ""),
      location: String(form.get("location") || ""),
      category: String(form.get("category") || ""),
      description: String(form.get("description") || ""),
      consent,
    };

    if (!consent) {
      setError("Please accept the privacy & consent notice to continue.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/public-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("done");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-muted p-8 text-center">
        <CheckCircle2 size={40} className="text-brand" />
        <h3 className="text-lg font-bold">Thank you. Your submission has been received.</h3>
        <p className="max-w-sm text-sm text-muted">
          Our editorial team reviews every tip before publication. If we need more details, we&apos;ll reach out using the contact you shared.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="name" required placeholder="Your name" />
        <Field label="Phone or Email" name="contact" required placeholder="+91... or you@email.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" name="location" required placeholder="Village / City, State" />
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Category <span className="text-brand">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
          >
            <option value="" disabled>
              Select a category
            </option>
            {TIP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
          Description <span className="text-brand">*</span>
        </label>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          placeholder="Tell us what's happening, where, and who is affected..."
          className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1.5 flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border px-3 py-2.5 text-sm text-muted transition hover:border-brand hover:text-brand">
          <Paperclip size={16} />
          {fileName || "Upload Photo / Video (optional)"}
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <p className="text-xs text-muted">Max 50MB. Uploads are stored securely and reviewed before publication.</p>
      </div>

      <label className="flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        I consent to The Top Interview reviewing and potentially publishing this information, in line with the{" "}
        <a href="/privacy-policy" className="text-brand hover:underline">
          Privacy Policy
        </a>
        . My identity will not be disclosed without permission.
      </label>

      {error && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-brand">
          <AlertTriangle size={15} /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-sm bg-brand py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" ? "Submitting..." : "Submit to Editorial Team"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
