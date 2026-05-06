"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/FadeUp";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const PLACEHOLDER_KEYS = ["", "your-access-key-here"];
const KEY_CONFIGURED = !PLACEHOLDER_KEYS.includes(ACCESS_KEY);

const WHATSAPP_NUMBER = "+373 68 327 082";
const WHATSAPP_URL =
  "https://wa.me/37368327082?text=Bun%C4%83%20ziua%2C%20sunt%20interesat%20de%20DropPack";

type State = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const t = useTranslations("contact");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!KEY_CONFIGURED) {
      setState("error");
      return;
    }
    setState("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", ACCESS_KEY);
    data.append("from_name", "DropPack landing");
    data.append("subject", "Cerere ofertă DropPack");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.success !== false) {
        form.reset();
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-slate-200 bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-7xl container-pad">
        <div className="max-w-3xl">
        <FadeUp>
          <h2 className="font-serif font-medium text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("title")}
          </h2>
          <p className="mt-3 text-[15px] text-slate-600">{t("subtitle")}</p>
        </FadeUp>

        <FadeUp delay={0.05} className="mt-8">
          {state === "success" ? (
            <p className="text-base text-slate-900">
              {t("success")}{" "}
              <button
                type="button"
                onClick={() => setState("idle")}
                className="ml-2 text-sm font-medium text-slate-500 hover:text-slate-900 underline underline-offset-4"
              >
                ←
              </button>
            </p>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
              <Field
                label={t("fields.name")}
                required
                name="name"
                placeholder={t("fields.namePlaceholder")}
                autoComplete="name"
              />
              <Field
                label={t("fields.company")}
                required
                name="company"
                placeholder={t("fields.companyPlaceholder")}
                autoComplete="organization"
              />
              <Field
                label={t("fields.phone")}
                required
                name="phone"
                type="tel"
                placeholder={t("fields.phonePlaceholder")}
                autoComplete="tel"
              />
              <Field
                label={`${t("fields.email")} ${t("fields.emailOptional")}`}
                name="email"
                type="email"
                placeholder={t("fields.emailPlaceholder")}
                autoComplete="email"
              />
              <div>
                <Label>{t("fields.drivers")}</Label>
                <select
                  name="drivers"
                  required
                  defaultValue=""
                  className="mt-1 w-full h-9 border-b border-slate-300 bg-transparent text-[15px] text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
                >
                  <option value="" disabled>
                    —
                  </option>
                  <option value="1-3">{t("fields.driversOptions.small")}</option>
                  <option value="4-10">
                    {t("fields.driversOptions.medium")}
                  </option>
                  <option value="11-25">
                    {t("fields.driversOptions.large")}
                  </option>
                  <option value="25+">
                    {t("fields.driversOptions.xlarge")}
                  </option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>
                  {t("fields.message")}{" "}
                  <span className="font-normal text-slate-400">
                    {t("fields.messageOptional")}
                  </span>
                </Label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder={t("fields.messagePlaceholder")}
                  className="mt-1 w-full border-b border-slate-300 bg-transparent py-1.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors resize-none"
                />
              </div>
              {/* honeypot */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {state === "error" && (
                <p className="sm:col-span-2 text-sm text-accent-600">
                  {KEY_CONFIGURED ? t("error") : t("missingKey")}
                </p>
              )}

              <div className="sm:col-span-2 mt-2">
                <Button type="submit" disabled={state === "submitting"}>
                  {state === "submitting" ? t("submitting") : t("submit")}
                </Button>
              </div>
            </form>
          )}
        </FadeUp>

        <p className="mt-8 text-sm text-slate-500">
          {t("altLabel")}{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            {WHATSAPP_NUMBER}
          </a>
          {" · "}
          <a
            href="mailto:sales@droppack.md"
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            sales@droppack.md
          </a>
        </p>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wider text-slate-500">
      {children}
    </label>
  );
}

function Field({
  label,
  required,
  ...props
}: {
  label: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        required={required}
        {...props}
        className="mt-1 w-full h-9 border-b border-slate-300 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
      />
    </div>
  );
}
