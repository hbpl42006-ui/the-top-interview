"use client";

import { useState } from "react";
import { MessageCircle, Link2, Printer, Bookmark, Check, Flag } from "lucide-react";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { SITE } from "@/lib/constants";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const url = `${SITE.url}${path}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        <FaFacebook size={16} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        <FaXTwitter size={16} />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        <MessageCircle size={16} />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
      <button
        onClick={() => window.print()}
        aria-label="Print article"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        <Printer size={16} />
      </button>
      <button
        onClick={() => setSaved((v) => !v)}
        aria-label="Bookmark article"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-brand hover:text-brand"
      >
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      </button>
      <a
        href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Error report: ${title}`)}`}
        className="ml-1 flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-brand"
      >
        <Flag size={13} /> Report an Error
      </a>
    </div>
  );
}
