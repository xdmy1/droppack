"use client";

import { useTranslations } from "next-intl";

const WHATSAPP_NUMBER = "+373 68 327 082";
const WHATSAPP_URL =
  "https://wa.me/37368327082?text=Bun%C4%83%20ziua%2C%20sunt%20interesat%20de%20DropPack";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl container-pad py-6 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
        <span>
          <span className="font-serif italic text-slate-700">DropPack</span>{" "}
          —{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900"
          >
            {WHATSAPP_NUMBER}
          </a>
          {" · "}
          <a
            href="mailto:sales@droppack.md"
            className="hover:text-slate-900"
          >
            sales@droppack.md
          </a>
        </span>
        <span>{t("rights")}</span>
      </div>
    </footer>
  );
}
