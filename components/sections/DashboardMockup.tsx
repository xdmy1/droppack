"use client";

import { useTranslations } from "next-intl";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Bell,
  Filter,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StatusKey =
  | "loaded"
  | "inTransit"
  | "outForDelivery"
  | "delivered"
  | "pending";

const STATUS_STYLES: Record<
  StatusKey,
  { dot: string; bg: string; text: string }
> = {
  delivered: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  inTransit: {
    dot: "bg-brand-500",
    bg: "bg-brand-50",
    text: "text-brand-600",
  },
  outForDelivery: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  loaded: {
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
  pending: {
    dot: "bg-slate-300",
    bg: "bg-slate-50",
    text: "text-slate-500",
  },
};

type Row = {
  code: string;
  sender: string;
  recipient: string;
  route: string;
  driver: string;
  status: StatusKey;
};

export function DashboardMockup() {
  const t = useTranslations("hero.mockup");
  const rows = (t.raw("rows") as Row[]) || [];
  const statuses = (t.raw("statuses") as Record<StatusKey, string>) || {};

  const totals = {
    active: rows.filter(
      (r) =>
        r.status === "inTransit" ||
        r.status === "outForDelivery" ||
        r.status === "loaded"
    ).length,
    delivered: rows.filter((r) => r.status === "delivered").length,
    pending: rows.filter((r) => r.status === "pending").length,
  };

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-6 -inset-y-6 -z-10 bg-gradient-to-tr from-brand-500/10 via-transparent to-accent-500/10 blur-2xl rounded-[2rem]"
      />
      <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white ring-1 ring-slate-200 px-3 h-6 text-xs text-slate-500 max-w-[60%] truncate">
            <span className="text-emerald-600 font-semibold">●</span>
            <span className="truncate">{t("browserUrl")}</span>
          </div>
        </div>

        {/* App content */}
        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-2 hidden md:flex flex-col gap-1 p-3 border-r border-slate-100 bg-slate-50/50">
            <SideItem icon={Package} active>
              {t("title")}
            </SideItem>
            <SideItem icon={Truck}>—</SideItem>
            <SideItem icon={CheckCircle2}>—</SideItem>
            <SideItem icon={Clock}>—</SideItem>
          </aside>

          {/* Main */}
          <div className="col-span-12 md:col-span-10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  {t("title")}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t("subtitle")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-slate-200 text-slate-500 hover:bg-slate-50">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" />
                  Excel
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              <StatCard
                label={statuses.inTransit}
                value={totals.active}
                tone="brand"
              />
              <StatCard
                label={statuses.delivered}
                value={totals.delivered}
                tone="emerald"
              />
              <StatCard
                label={statuses.pending}
                value={totals.pending}
                tone="slate"
              />
            </div>

            {/* Filters + search */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Pill active>{t("filterAll")}</Pill>
                <Pill>{t("filterActive")}</Pill>
                <Pill>{t("filterDelivered")}</Pill>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-slate-200 text-xs text-slate-400 min-w-[160px]">
                <Search className="h-3.5 w-3.5" />
                <span className="truncate">{t("search")}</span>
              </div>
              <button className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-slate-200 text-slate-500">
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Table */}
            <div className="mt-3 -mx-5 sm:mx-0 overflow-hidden sm:rounded-lg sm:ring-1 sm:ring-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                  <tr>
                    <Th className="hidden sm:table-cell">
                      {t("columns.code")}
                    </Th>
                    <Th>{t("columns.sender")}</Th>
                    <Th className="hidden md:table-cell">
                      {t("columns.route")}
                    </Th>
                    <Th className="hidden lg:table-cell">
                      {t("columns.driver")}
                    </Th>
                    <Th className="text-right">{t("columns.status")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((row, i) => (
                    <tr key={row.code} className={i === 2 ? "bg-brand-50/40" : ""}>
                      <Td className="hidden sm:table-cell font-mono text-slate-500">
                        {row.code}
                      </Td>
                      <Td>
                        <div className="font-semibold text-slate-900">
                          {row.sender}
                        </div>
                        <div className="text-slate-500 truncate md:hidden">
                          {row.route}
                        </div>
                      </Td>
                      <Td className="hidden md:table-cell text-slate-600">
                        {row.route}
                      </Td>
                      <Td className="hidden lg:table-cell text-slate-600">
                        {row.driver}
                      </Td>
                      <Td className="text-right">
                        <StatusBadge status={row.status} label={statuses[row.status]} live={i === 2} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon: Icon,
  children,
  active,
}: {
  icon: typeof Package;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-2 rounded-md text-xs",
        active
          ? "bg-white text-brand-600 font-semibold ring-1 ring-slate-200"
          : "text-slate-400"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "brand" | "emerald" | "slate";
}) {
  const styles = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
  };
  return (
    <div className={cn("rounded-lg ring-1 px-3 py-2", styles[tone])}>
      <div className="text-[10px] uppercase tracking-wide font-semibold opacity-70 truncate">
        {label}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function Pill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-7 px-3 rounded-full font-semibold transition-colors",
        active
          ? "bg-slate-900 text-white"
          : "bg-white ring-1 ring-slate-200 text-slate-600"
      )}
    >
      {children}
    </span>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left text-[10px] font-semibold",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-3 py-2.5 align-middle", className)}>{children}</td>
  );
}

function StatusBadge({
  status,
  label,
  live,
}: {
  status: StatusKey;
  label: string;
  live?: boolean;
}) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        s.bg,
        s.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot, live && "mockup-pulse")} />
      {label}
    </span>
  );
}
