"use client";

import { useTranslations } from "next-intl";
import { FadeUp } from "@/components/FadeUp";

type Item = { title: string; body: string };

export default function Solution() {
  const t = useTranslations("solution");
  const items = (t.raw("items") as Item[]) ?? [];

  return (
    <section
      id="features"
      className="border-t border-slate-200 bg-cream-50 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-6xl container-pad">
        <FadeUp className="max-w-2xl">
          <h2 className="font-serif font-medium text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t("subtitle")}
          </p>
        </FadeUp>

        <FadeUp delay={0.05} className="mt-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {items.map((it, i) => (
              <div key={i} className="border-t border-slate-300 pt-4">
                <h3 className="text-slate-900 text-base font-medium leading-snug">
                  {it.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed text-[15px]">
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
