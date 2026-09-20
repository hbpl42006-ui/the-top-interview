"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  CheckCircle2,
  Paperclip,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

import { TIP_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

function validateMedia(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Choose a JPEG, PNG, WebP, AVIF image or MP4 video.";
  }

  if (file.size === 0) {
    return "The selected file is empty.";
  }

  const isVideo = file.type === "video/mp4";

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return "Video must be 20 MB or smaller.";
  }

  if (!isVideo && file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }

  return null;
}

async function readJsonSafely(response: Response) {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function errorMessage(data: any, fallback: string) {
  if (typeof data?.error === "string") {
    return data.error;
  }

  if (data?.error?.message) {
    return data.error.message;
  }

  return fallback;
}

export function PublicVoiceForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");

  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);

  const { dict } = useLanguage();
  const d = dict.publicVoiceForm;

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      setFile(null);
      return;
    }

    const validationError = validateMedia(selected);

    if (validationError) {
      setError(validationError);
      setFile(null);
      event.target.value = "";
      return;
    }

    setError("");
    setFile(selected);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!consent) {
      setStatus("error");
      setError(d.consentRequired);
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setStatus("loading");
    setError("");

    try {
      const payload = new FormData();
      payload.append("name", String(form.get("name") || ""));
      payload.append("contact", String(form.get("contact") || ""));
      payload.append("location", String(form.get("location") || ""));
      payload.append("category", String(form.get("category") || ""));
      payload.append("description", String(form.get("description") || ""));
      payload.append("consent", String(consent));
      if (file) payload.append("media", file, file.name);

      const response = await fetch("/api/public-voice", {
        method: "POST",
        body: payload,
      });

      const data = await readJsonSafely(response);

      if (!response.ok || !data?.success) {
        throw new Error(
          errorMessage(data, d.genericError)
        );
      }

      setStatus("done");
      setFile(null);

      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : d.genericError
      );
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-muted p-8 text-center">
        <CheckCircle2 size={40} className="text-brand" />

        <h3 className="text-lg font-bold">
          {d.thankYouTitle}
        </h3>

        <p className="max-w-sm text-sm text-muted">
          {d.thankYouBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={d.fullName}
          name="name"
          required
          placeholder={d.fullNamePlaceholder}
        />

        <Field
          label={d.contact}
          name="contact"
          required
          placeholder={d.contactPlaceholder}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={d.location}
          name="location"
          required
          placeholder={d.locationPlaceholder}
        />

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            {d.category} <span className="text-brand">*</span>
          </label>

          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
          >
            <option value="" disabled>
              {d.selectCategory}
            </option>

            {TIP_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
          {d.description} <span className="text-brand">*</span>
        </label>

        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          placeholder={d.descriptionPlaceholder}
          className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        {!file ? (
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border px-3 py-2.5 text-sm text-muted transition hover:border-brand hover:text-brand">
            <Paperclip size={16} />
            {d.uploadOptional}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4"
              className="hidden"
              onChange={handleFileChange}
              disabled={status === "loading"}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-border bg-surface-muted p-3">
            <Paperclip size={17} className="text-brand" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {file.name}
              </p>

              <p className="text-xs text-muted">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              disabled={status === "loading"}
              onClick={() => setFile(null)}
              className="rounded p-1 text-muted hover:text-foreground"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <p className="mt-1 text-xs text-muted">
          JPEG, PNG, WebP or AVIF up to 5 MB. MP4 video up to 20 MB.
        </p>
      </div>

      <label className="flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) =>
            setConsent(event.target.checked)
          }
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />

        <span>
          {d.consent}{" "}
          <a
            href="/privacy-policy"
            className="text-brand hover:underline"
          >
            {d.consentLinkText}
          </a>
          {d.consentSuffix}
        </span>
      </label>

      {error && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-brand">
          <AlertTriangle size={15} />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" && (
          <Loader2 size={16} className="animate-spin" />
        )}

        {status === "loading"
          ? file
            ? "Uploading & submitting..."
            : d.submitting
          : d.submit}
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
        {label}{" "}
        {required && <span className="text-brand">*</span>}
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
