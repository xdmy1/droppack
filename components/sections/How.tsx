"use client";

import { useTranslations } from "next-intl";
import { FadeUp } from "@/components/FadeUp";

type Step = { title: string; body: string };

export default function How() {
  const t = useTranslations("how");
  const steps = (t.raw("steps") as Step[]) ?? [];

  return (
    <section
      id="how"
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
          <ol className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {steps.map((s, i) => (
              <li key={i} className="py-5 flex gap-5">
                <span className="font-serif italic text-stone-500 text-xl leading-none pt-0.5 w-7 shrink-0 text-right select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-slate-900 text-base font-medium leading-snug">
                    {s.title}
                  </div>
                  <p className="mt-1 text-slate-600 leading-relaxed text-[15px]">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </FadeUp>
        </div>
      </div>
    </section>
  );
}
