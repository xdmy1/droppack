"use client";

import { useTranslations } from "next-intl";
import { Camera, Check, MapPin } from "lucide-react";

export function PhoneMockup() {
  const t = useTranslations("hero.mockupPhone");

  return (
    <div className="relative">
      <div className="rounded-[2rem] bg-slate-900 p-2 shadow-2xl ring-1 ring-black/30">
        <div className="rounded-[1.5rem] bg-white overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[9px] font-bold text-slate-700">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
              <span className="inline-block h-1 w-1 rounded-full bg-slate-700" />
            </span>
          </div>

          {/* App content */}
          <div className="px-3.5 pb-5 pt-2">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-brand-500">
              {t("driver")}
            </div>
            <div className="text-base font-bold text-slate-900 leading-tight mt-0.5">
              {t("title")}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {t("subtitle")}
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Card
                name={t("items.0.name")}
                addr={t("items.0.addr")}
                state="done"
                actionLabel={t("done")}
              />
              <Card
                name={t("items.1.name")}
                addr={t("items.1.addr")}
                state="active"
                actionLabel={t("markDelivered")}
              />
              <Card
                name={t("items.2.name")}
                addr={t("items.2.addr")}
                state="next"
                actionLabel={t("next")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  name,
  addr,
  state,
  actionLabel,
}: {
  name: string;
  addr: string;
  state: "done" | "active" | "next";
  actionLabel: string;
}) {
  return (
    <div
      className={
        state === "active"
          ? "rounded-xl bg-white ring-2 ring-brand-500 p-2.5 shadow-sm"
          : "rounded-xl bg-white ring-1 ring-slate-200 p-2.5"
      }
    >
      <div className="flex items-start gap-2">
        <span
          className={
            state === "done"
              ? "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0"
              : state === "active"
              ? "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white shrink-0"
              : "mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-500 shrink-0"
          }
        >
          {state === "done" ? (
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          ) : (
            <MapPin className="h-2.5 w-2.5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={
              state === "done"
                ? "text-[11px] font-semibold text-slate-400 line-through truncate"
                : "text-[11px] font-bold text-slate-900 truncate"
            }
          >
            {name}
          </div>
          <div className="text-[9px] text-slate-500 truncate">{addr}</div>
        </div>
      </div>
      {state === "active" && (
        <button className="mt-2 w-full inline-flex items-center justify-center gap-1.5 h-7 rounded-md bg-brand-500 text-white text-[10px] font-bold">
          <Camera className="h-3 w-3" />
          {actionLabel}
        </button>
      )}
      {state !== "active" && (
        <div
          className={
            state === "done"
              ? "mt-1.5 text-[9px] font-semibold text-emerald-600"
              : "mt-1.5 text-[9px] font-semibold text-slate-500"
          }
        >
          {actionLabel}
        </div>
      )}
    </div>
  );
}
