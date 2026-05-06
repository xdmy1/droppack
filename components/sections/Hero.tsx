"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { DashboardMockup } from "@/components/sections/DashboardMockup";
import { FadeUp } from "@/components/FadeUp";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      id="top"
      className="relative bg-white pt-10 lg:pt-16 pb-14 lg:pb-20"
    >
      <div className="mx-auto max-w-7xl container-pad grid md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-6 min-w-0">
          <FadeUp>
            <h1 className="font-serif font-medium text-[1.75rem] sm:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.875rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
              {t.rich("titleRich", {
                accent: (chunks) => (
                  <em className="italic font-normal">{chunks}</em>
                ),
              })}
            </h1>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              {t("subtitle")}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href="#contact">{t("primaryCta")}</a>
              </Button>
              <Button asChild variant="secondary">
                <a href={`/${locale}/demo/`}>{t("secondaryCta")}</a>
              </Button>
            </div>
          </FadeUp>
        </div>

        <div className="lg:col-span-6 min-w-0">
          <FadeUp delay={0.1}>
            <DashboardMockup />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
