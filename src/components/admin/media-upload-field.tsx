"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileVideo, ImagePlus, Loader2 } from "lucide-react";
import { isImageUrl, validateMediaFile, type MediaUploadContext } from "@/lib/image-upload";
import { uploadMedia } from "@/lib/client/media-upload";

export function MediaUploadField({ name, value, onChange, context, label = "Creative media" }: {
  name: string;
  value: string;
  onChange: (url: string) => void;
  context: MediaUploadContext;
  label?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const objectUrl = useRef<string | null>(null);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  async function selectFile(file: File) {
    const validationError = validateMediaFile(file);
    if (validationError) { setError(validationError); return; }
    setError("");
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setPreview(objectUrl.current);
    setUploading(true);
    try {
      const result = await uploadMedia(file, context);
      onChange(result.secureUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to upload media.");
    } finally {
      setUploading(false);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
      setPreview("");
    }
  }

  const display = preview || value;
  const video = display.endsWith(".mp4") || display.includes("/video/upload/");
  return <fieldset className="space-y-3 rounded-sm border border-border p-3" aria-busy={uploading}>
    <legend className="px-1 text-xs font-bold uppercase tracking-wide text-muted">{label}</legend>
    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-border bg-surface-muted">
      {display && video ? <video src={display} controls className="h-full w-full object-contain" /> : display && isImageUrl(display) ? <img src={display} alt={`${label} preview`} className="h-full w-full object-contain" /> : video ? <FileVideo size={28} /> : <ImagePlus size={28} className="text-muted" />}
    </div>
    <button type="button" disabled={uploading} onClick={() => input.current?.click()} className="w-full rounded-sm border border-dashed border-border px-3 py-3 text-sm text-muted hover:border-brand hover:text-brand">
      {uploading ? <><Loader2 size={16} className="mr-2 inline animate-spin" />Uploading...</> : "Choose image or MP4 video"}
    </button>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4" className="hidden" onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) void selectFile(file); }} />
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-muted">Existing/external media URL</label>
    <input id={id} name={name} type="url" value={value} onChange={(event) => { setError(""); onChange(event.target.value); }} placeholder="https://..." className="w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand" />
    <p className="text-xs text-muted">Images up to 5 MB; MP4 videos up to 20 MB.</p>
    {error && <p role="alert" className="text-sm text-brand">{error}</p>}
  </fieldset>;
}
