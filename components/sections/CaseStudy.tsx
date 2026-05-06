"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { FadeUp } from "@/components/FadeUp";

type Slide = {
  index: string;
  label: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function CaseStudy() {
  const t = useTranslations("caseStudy");
  const [open, setOpen] = useState<number | null>(null);

  const slides: Slide[] = [
    {
      index: "01",
      label: t("beforeLabel"),
      title: t("beforeTitle"),
      body: t("beforeBody"),
      src: "/cases/before.jpg",
      alt: t("beforeAlt"),
      width: 1342,
      height: 976,
    },
    {
      index: "02",
      label: t("afterLabel"),
      title: t("afterTitle"),
      body: t("afterBody"),
      src: "/cases/after.png",
      alt: t("afterAlt"),
      width: 1600,
      height: 873,
    },
  ];

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % slides.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + slides.length) % slides.length));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, slides.length]);

  const active = open === null ? null : slides[open];

  return (
    <section className="border-t border-slate-200 bg-cream-50 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl container-pad">
        <FadeUp className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 mb-3">
            {t("beforeLabel")} · {t("afterLabel")}
          </div>
          <h2 className="font-serif font-medium text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t("subtitle")}
          </p>
        </FadeUp>

        <div className="mt-12 grid md:grid-cols-2 gap-8 lg:gap-12">
          {slides.map((s, i) => (
            <FadeUp key={s.index} delay={i * 0.05}>
              <figure>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-serif italic text-stone-500 text-lg leading-none select-none">
                    {s.index}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                    {s.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`${s.label} — ${s.title}`}
                  className="group relative block w-full overflow-hidden rounded-lg ring-1 ring-slate-200 bg-white aspect-[4/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-[1.015]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={i === 1}
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-stone-700 ring-1 ring-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h6v6" />
                      <path d="M9 21H3v-6" />
                      <path d="m21 3-7 7" />
                      <path d="m3 21 7-7" />
                    </svg>
                    {t("expand")}
                  </span>
                </button>

                <figcaption className="mt-4 text-sm text-slate-600 leading-relaxed">
                  <span className="font-serif italic text-slate-900">
                    {s.title}
                  </span>
                  {" — "}
                  {s.body}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? null : (i - 1 + slides.length) % slides.length));
                }}
                aria-label={t("prev")}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? null : (i + 1) % slides.length));
                }}
                aria-label={t("next")}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <figure
            className="relative max-w-[95vw] max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ height: "calc(90vh - 4rem)" }}>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/80">
              <span className="font-serif italic text-white">{active.title}</span>
              <span className="text-white/50"> · {active.label}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
