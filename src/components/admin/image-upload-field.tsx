"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
  required,
  onUploadingChange,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string;
  required?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed.");
      }
      setUrl(json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input type="hidden" name={name} value={url} required={required} />
      <div className="flex items-center gap-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted">
          {url ? (
            <Image src={url} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <ImagePlus size={20} className="text-muted" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
              <Loader2 size={18} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border px-3 py-2.5 text-sm text-muted transition hover:border-brand hover:text-brand">
          {uploading ? "Uploading..." : url ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-brand">{error}</p>}
    </div>
  );
}
