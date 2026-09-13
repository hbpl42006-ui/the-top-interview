import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/types";
import { LOCALE_COOKIE, DEFAULT_LOCALE, getDictionary } from "@/lib/i18n/dictionary";

export { LOCALE_COOKIE, DEFAULT_LOCALE, getDictionary };
export type { Locale, Dictionary } from "@/lib/i18n/types";

/**
 * Server-only: reads the visitor's saved language preference from cookies.
 * Never import this file from a "use client" module — it pulls in
 * next/headers. Client components should import getDictionary/LOCALE_COOKIE
 * from "@/lib/i18n/dictionary" instead.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "hi" ? "hi" : DEFAULT_LOCALE;
}
