"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X, Megaphone } from "lucide-react";
import { PublicVoiceForm } from "@/components/public-voice/public-voice-form";
import { usePodcastPlayer } from "@/components/podcast/podcast-player-context";
import { useLanguage } from "@/components/providers/language-provider";

export function FloatingTipButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { currentEpisode } = usePodcastPlayer();
  const { dict } = useLanguage();

  if (pathname === "/public-voice") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.floatingTip.button}
        className="fixed right-4 z-40 flex min-h-11 items-center gap-2 rounded-full bg-brand px-3 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
        style={{ bottom: currentEpisode ? "calc(4.5rem + 76px)" : "5.5rem" }}
      >
        <Megaphone size={18} />
        <span>{dict.floatingTip.button}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal/60 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-background p-6 sm:rounded-xl sm:p-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand">{dict.floatingTip.eyebrow}</span>
                <h2 className="font-serif text-xl font-bold sm:text-2xl">{dict.floatingTip.heading}</h2>
                <p className="mt-1 text-sm text-muted">{dict.floatingTip.description}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={dict.floatingTip.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-surface-muted"
              >
                <X size={20} />
              </button>
            </div>
            <PublicVoiceForm onSuccess={() => setTimeout(() => setOpen(false), 2500)} />
          </div>
        </div>
      )}
    </>
  );
}
