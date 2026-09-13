"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { isImageUrl, validateImageFile } from "@/lib/image-upload";
import { uploadMedia } from "@/lib/client/media-upload";

interface ImageUploadFieldProps {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  context?: import("@/lib/image-upload").ImageUploadContext;
  required?: boolean;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageUploadField({
  name,
  value,
  onChange,
  label = "Image",
  folder = "misc",
  context,
  required = false,
  disabled = false,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const objectUrl = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [failedPreview, setFailedPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const preview = localPreview || (isImageUrl(value) ? value : "");
  const busy = disabled || uploading;

  useEffect(() => () => {
    // Closing the modal must not apply a late upload to another record.
    request.current?.abort();
    request.current = null;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    onUploadingChange?.(false);
  }, [onUploadingChange]);

  async function handleFile(file: File) {
    if (disabled || request.current) return;
    const validationError = validateImageFile(file);
    setError(validationError ?? "");
    if (validationError) return;

    const controller = new AbortController();
    request.current = controller;
    setUploading(true);
    onUploadingChange?.(true);
    setFailedPreview("");
    objectUrl.current = URL.createObjectURL(file);
    setLocalPreview(objectUrl.current);
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const uploadContext = context ?? (folder === "team" ? "team-members" : folder) as import("@/lib/image-upload").ImageUploadContext;
      const result = await uploadMedia(file, uploadContext, controller.signal);
      if (!controller.signal.aborted) onChange(result.secureUrl);
    } catch (err) {
      // Only display our own messages, never the API's raw error payload.
      const safeMessages = [
        "Your session has expired. Sign in again to upload an image.",
        "You do not have permission to upload images.",
        "Image must be smaller than 5 MB.",
        "Choose a JPEG, PNG, WebP or AVIF image.",
      ];
      if (request.current === controller) {
        setError(err instanceof Error && safeMessages.includes(err.message)
          ? err.message
          : "Failed to upload image. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
        setLocalPreview("");
        setUploading(false);
        onUploadingChange?.(false);
      }
    }
  }

  return (
    <fieldset className="min-w-0 space-y-3 rounded-sm border border-border p-3" aria-busy={uploading}>
      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-muted">
        {label} {required && <span className="text-brand">*</span>}
      </legend>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-muted">
        {preview && failedPreview !== preview ? (
          // Arbitrary external URLs are intentional in this admin-only preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={preview}
            src={preview}
            alt={`${label} preview`}
            className="h-full w-full object-contain"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailedPreview(preview)}
          />
        ) : (
          <div className="p-4 text-center text-sm text-muted">
            <ImagePlus size={28} className="mx-auto mb-2" aria-hidden="true" />
            {preview ? "Unable to load this image. Check the URL or choose another image." : "Image preview"}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/50 text-sm text-white" role="status">
            <Loader2 size={20} className="animate-spin" aria-hidden="true" /> Uploading...
          </div>
        )}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => fileInput.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (busy) return;
          if (event.dataTransfer.files.length !== 1) {
            setError("Please choose one image at a time.");
            return;
          }
          void handleFile(event.dataTransfer.files[0]);
        }}
        className={`w-full rounded-sm border border-dashed px-3 py-4 text-sm transition focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 ${dragging ? "border-brand bg-brand/5 text-brand" : "border-border text-muted hover:border-brand hover:text-brand"}`}
      >
        <span className="block font-semibold">{uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}</span>
        <span className="mt-1 block text-xs">Drag &amp; drop an image here or click to browse</span>
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        aria-label={`Choose ${label.toLowerCase()}`}
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) void handleFile(file);
        }}
      />
      <p className="text-xs text-muted">JPEG, PNG, WebP or AVIF. Smaller than 5 MB.</p>
      <div className="flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
      <div>
        <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Image URL</label>
        <input
          id={id}
          name={name}
          type="url"
          pattern="https?://.*"
          title="Enter an HTTP or HTTPS image URL."
          value={value}
          required={required}
          readOnly={busy}
          placeholder="https://example.com/image.jpg"
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            setError("");
            setFailedPreview("");
            onChange(event.target.value);
          }}
          className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-brand">{error}</p>}
    </fieldset>
  );
}
