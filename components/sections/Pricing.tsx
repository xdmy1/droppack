"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/FadeUp";

export default function Pricing() {
  const t = useTranslations("pricing");

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
          <div className="mt-6 space-y-3.5 text-[15px] sm:text-base text-slate-700 leading-relaxed max-w-2xl">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
            <p>{t("body3")}</p>
          </div>
          <div className="mt-7">
            <Button asChild>
              <a href="#contact">{t("cta")}</a>
            </Button>
          </div>
        </FadeUp>
        </div>
      </div>
    </section>
  );
}
