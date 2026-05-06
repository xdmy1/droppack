"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const LOCALES = ["ro", "ru"] as const;

export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchTo = (next: string) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-0.5 text-xs font-semibold ring-1",
        tone === "light"
          ? "bg-slate-100 ring-slate-200 text-slate-600"
          : "bg-white/10 ring-white/20 text-white/80"
      )}
      role="group"
      aria-label={t("languageLabel")}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={cn(
              "px-3 h-7 rounded-full transition-colors uppercase tracking-wide",
              active
                ? tone === "light"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "bg-white text-brand-600 shadow-sm"
                : "hover:text-slate-900"
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
