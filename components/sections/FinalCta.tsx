"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/FadeUp";

export default function FinalCta() {
  const t = useTranslations("finalCta");
  const locale = useLocale();

  return (
    <section className="border-t border-slate-200 bg-cream-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl container-pad">
        <div className="max-w-3xl">
        <FadeUp>
          <h2 className="font-serif font-medium text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("title")}
          </h2>
        </FadeUp>
        <FadeUp delay={0.05}>
          <p className="mt-4 text-[15px] sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <a href="#contact">{t("primary")}</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`/${locale}/demo/`}>{t("secondary")}</a>
            </Button>
          </div>
        </FadeUp>
        </div>
      </div>
    </section>
  );
}
