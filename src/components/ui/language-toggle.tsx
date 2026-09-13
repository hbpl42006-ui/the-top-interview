"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, dict, setLocale } = useLanguage();

  return (
    <div className={cn("flex items-center rounded-full border border-border p-0.5 text-xs font-bold", className)}>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          locale === "en" ? "bg-brand text-white" : "text-muted hover:text-foreground"
        )}
      >
        {dict.languageToggle.english}
      </button>
      <button
        type="button"
        onClick={() => setLocale("hi")}
        aria-pressed={locale === "hi"}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          locale === "hi" ? "bg-brand text-white" : "text-muted hover:text-foreground"
        )}
      >
        {dict.languageToggle.hindi}
      </button>
    </div>
  );
}
