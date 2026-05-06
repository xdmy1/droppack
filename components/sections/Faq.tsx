"use client";

import { useTranslations } from "next-intl";
import { FadeUp } from "@/components/FadeUp";

type Item = { q: string; a: string };

export default function Faq() {
  const t = useTranslations("faq");
  const items = (t.raw("items") as Item[]) ?? [];

  return (
    <section
      id="faq"
      className="border-t border-slate-200 bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl container-pad">
        <div className="max-w-3xl">
        <FadeUp>
          <h2 className="font-serif font-medium text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("title")}
          </h2>
        </FadeUp>
        <FadeUp delay={0.05}>
          <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {items.map((it, i) => (
              <div key={i} className="py-5">
                <dt className="text-slate-900 text-base font-medium leading-snug">
                  {it.q}
                </dt>
                <dd className="mt-1.5 text-slate-600 leading-relaxed text-[15px]">
                  {it.a}
                </dd>
              </div>
            ))}
          </dl>
        </FadeUp>
        </div>
      </div>
    </section>
  );
}
