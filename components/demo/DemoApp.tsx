"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArchiveRestore,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock,
  Download,
  FileSignature,
  FileSpreadsheet,
  Filter,
  HelpCircle,
  LifeBuoy,
  Mail,
  Map as MapIcon,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  Printer,
  QrCode,
  Route,
  Search,
  Settings,
  TrendingUp,
  Truck,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DRIVERS,
  PACKAGES,
  type Currency,
  type DemoDriver,
  type DemoPackage,
  type StatusKey,
} from "./data";
import { cn } from "@/lib/utils";

type ViewKey =
  | "packages"
  | "runs"
  | "drivers"
  | "routes"
  | "reports"
  | "analytics"
  | "settings"
  | "support";

type ModalKey =
  | null
  | "add"
  | "status"
  | "reassign"
  | "print"
  | "notifications"
  | "archive"
  | "export"
  | "newRun";

type TabKey = "all" | "pending" | "active" | "delivered";

const STATUS_STYLES: Record<
  StatusKey,
  { dot: string; bg: string; text: string }
> = {
  delivered: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  inTransit: { dot: "bg-brand-500", bg: "bg-brand-50", text: "text-brand-600" },
  outForDelivery: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  loaded: { dot: "bg-slate-500", bg: "bg-slate-100", text: "text-slate-700" },
  pending: { dot: "bg-stone-400", bg: "bg-stone-100", text: "text-stone-600" },
};

const STATUS_FLOW: StatusKey[] = [
  "pending",
  "loaded",
  "inTransit",
  "outForDelivery",
  "delivered",
];

export function DemoApp({ locale }: { locale: string }) {
  const t = useTranslations("demo");
  const statusLabel = (s: StatusKey) => t(`status.${s}`);

  const [packages, setPackages] = useState<DemoPackage[]>(PACKAGES);
  const [view, setView] = useState<ViewKey>("packages");
  const [modal, setModal] = useState<ModalKey>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(
    PACKAGES[2].code
  );
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [settled, setSettled] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const toastIdRef = useRef(0);

  const notify = useCallback(
    (text?: string) => {
      const id = ++toastIdRef.current;
      const message = text ?? t("toast");
      setToasts((prev) => [...prev, { id, text: message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 2800);
    },
    [t]
  );

  useEffect(() => {
    if (modal === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modal]);

  const selected = useMemo(
    () => packages.find((p) => p.code === selectedCode) ?? null,
    [packages, selectedCode]
  );

  const updatePackage = useCallback(
    (code: string, patch: Partial<DemoPackage>) => {
      setPackages((prev) =>
        prev.map((p) => (p.code === code ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const reassign = useCallback(
    (code: string, driverId: string | null) => {
      setPackages((prev) =>
        prev.map((p) =>
          p.code === code
            ? {
                ...p,
                driverId,
                status:
                  p.status === "pending" && driverId ? "loaded" : p.status,
              }
            : p
        )
      );
    },
    []
  );

  const toggleSettled = useCallback(
    (driverId: string, name: string) => {
      setSettled((prev) => {
        const next = new Set(prev);
        if (next.has(driverId)) {
          next.delete(driverId);
          notify(t("undoSettleToast"));
        } else {
          next.add(driverId);
          notify(t("settleToast", { name }));
        }
        return next;
      });
    },
    [notify, t]
  );

  return (
    <div className="min-h-dvh bg-stone-50 text-slate-900">
      {/* Top banner */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-10 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
            <AlertCircle className="h-3 w-3" />
            {t("badge")}
          </span>
          <span className="text-xs text-stone-500 hidden sm:inline">
            {t("subtitle")}
          </span>
          <a
            href={`/${locale}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("back")}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 grid grid-cols-12 gap-5">
        {/* Sidebar */}
        <aside className="hidden lg:flex col-span-2 flex-col gap-1 sticky top-5 self-start">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Image src="/logo.png" alt="DropPack" width={28} height={28} className="h-7 w-7" />
            <span className="font-serif italic text-slate-900 text-base">DropPack</span>
          </div>
          {(
            [
              { id: "packages", icon: Package, label: t("nav.packages") },
              { id: "runs", icon: Truck, label: t("nav.runs") },
              { id: "drivers", icon: Users, label: t("nav.drivers") },
              { id: "routes", icon: Route, label: t("nav.routes") },
              { id: "reports", icon: Banknote, label: t("nav.reports") },
              { id: "analytics", icon: BarChart3, label: t("nav.analytics") },
            ] as { id: ViewKey; icon: typeof Package; label: string }[]
          ).map((it) => (
            <NavItem
              key={it.id}
              icon={it.icon}
              active={view === it.id}
              onClick={() => setView(it.id)}
            >
              {it.label}
            </NavItem>
          ))}
          <div className="my-3 h-px bg-stone-200" />
          <NavItem icon={Settings} active={view === "settings"} onClick={() => setView("settings")}>
            {t("nav.settings")}
          </NavItem>
          <NavItem icon={HelpCircle} active={view === "support"} onClick={() => setView("support")}>
            {t("nav.support")}
          </NavItem>

          <div className="mt-4 rounded-xl bg-white ring-1 ring-stone-200 p-3">
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500">
              {t("liveBadge")}
            </div>
            <div className="mt-1.5 text-xs text-slate-700 leading-relaxed">
              {t("liveDescription")}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mockup-pulse" />
              {t("online")}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-10 min-w-0 space-y-5">
          {/* Top bar */}
          <div className="rounded-xl bg-white ring-1 ring-stone-200 px-4 py-3 flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <Image src="/logo.png" alt="DropPack" width={24} height={24} className="h-6 w-6" />
              <span className="font-serif italic text-slate-900 text-sm">DropPack</span>
            </div>
            <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-stone-50 text-sm text-slate-500 min-w-[260px] max-w-[420px] flex-1">
              <Search className="h-4 w-4 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="bg-transparent w-full outline-none text-slate-900 placeholder:text-stone-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[11px] uppercase tracking-wide text-stone-500 hover:text-slate-900"
                >
                  {t("clear")}
                </button>
              )}
            </div>
            <div className="lg:hidden ml-auto inline-flex items-center gap-1 rounded-lg ring-1 ring-stone-200 bg-white p-1">
              <select
                value={view}
                onChange={(e) => setView(e.target.value as ViewKey)}
                className="bg-transparent outline-none text-xs font-medium text-slate-700 px-2 py-1"
              >
                <option value="packages">{t("nav.packages")}</option>
                <option value="runs">{t("nav.runs")}</option>
                <option value="drivers">{t("nav.drivers")}</option>
                <option value="routes">{t("nav.routes")}</option>
                <option value="reports">{t("nav.reports")}</option>
                <option value="analytics">{t("nav.analytics")}</option>
                <option value="settings">{t("nav.settings")}</option>
                <option value="support">{t("nav.support")}</option>
              </select>
            </div>
            <div className="ml-auto hidden lg:flex items-center gap-2">
              <IconBtn aria-label={t("notifications")} onClick={() => setModal("notifications")}>
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
              </IconBtn>
              <IconBtn aria-label="map" onClick={() => notify()}>
                <MapIcon className="h-4 w-4" />
              </IconBtn>
              <button
                onClick={() => notify()}
                className="hidden xl:inline-flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-full ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-sm"
              >
                <span className="h-6 w-6 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center">
                  DM
                </span>
                <span className="text-slate-700 font-medium">Dispecer</span>
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </button>
            </div>
          </div>

          {view === "packages" && (
            <PackagesView
              packages={packages}
              search={search}
              tab={tab}
              setTab={setTab}
              selectedCode={selectedCode}
              setSelectedCode={setSelectedCode}
              selected={selected}
              statusLabel={statusLabel}
              onAction={notify}
              onModal={setModal}
              onReassign={reassign}
              settled={settled}
              onToggleSettled={toggleSettled}
            />
          )}

          {view === "runs" && (
            <RunsView
              packages={packages}
              statusLabel={statusLabel}
              onModal={setModal}
              onSelectPackage={(code) => {
                setSelectedCode(code);
                setView("packages");
              }}
            />
          )}

          {view === "drivers" && <DriversView packages={packages} onAction={notify} />}

          {view === "routes" && <RoutesView packages={packages} onAction={notify} />}

          {view === "reports" && (
            <ReportsView
              packages={packages}
              onAction={notify}
              settled={settled}
              onToggleSettled={toggleSettled}
            />
          )}

          {view === "analytics" && <AnalyticsView packages={packages} />}

          {view === "settings" && <SettingsView onAction={notify} />}

          {view === "support" && <SupportView />}

          <div className="text-center text-xs text-stone-400 pt-4 pb-8">
            {t("footerHint")}
          </div>
        </main>
      </div>

      {/* Modals */}
      {modal === "add" && (
        <AddPackageModal
          onClose={() => setModal(null)}
          onSubmit={(code) => {
            setModal(null);
            notify(t("addedToast", { code }));
          }}
        />
      )}
      {modal === "status" && selected && (
        <StatusModal
          pkg={selected}
          onClose={() => setModal(null)}
          onApply={(s) => {
            updatePackage(selected.code, { status: s });
            setModal(null);
          }}
          statusLabel={statusLabel}
        />
      )}
      {modal === "reassign" && selected && (
        <ReassignModal
          pkg={selected}
          onClose={() => setModal(null)}
          onApply={(driverId) => {
            reassign(selected.code, driverId);
            setModal(null);
          }}
        />
      )}
      {modal === "print" && selected && (
        <PrintModal pkg={selected} onClose={() => setModal(null)} onConfirm={() => { setModal(null); notify(t("printToast")); }} />
      )}
      {modal === "notifications" && (
        <NotificationsModal onClose={() => setModal(null)} />
      )}
      {modal === "archive" && selected && (
        <ConfirmModal
          title={t("archiveTitle")}
          body={t("archiveBody", { code: selected.code })}
          confirmLabel={t("archive")}
          tone="danger"
          onClose={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            notify(t("archiveToast"));
          }}
        />
      )}
      {modal === "export" && (
        <ExportModal
          onClose={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            notify(t("exportToast"));
          }}
        />
      )}
      {modal === "newRun" && (
        <NewRunModal
          onClose={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            notify(t("newRunToast"));
          }}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((tt) => (
          <div
            key={tt.id}
            className="demo-toast pointer-events-auto rounded-lg bg-slate-900 text-white text-sm px-4 py-2.5 shadow-lg ring-1 ring-white/10 flex items-center gap-2 max-w-sm"
          >
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="leading-snug">{tt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== Views ============================== */

function PackagesView({
  packages,
  search,
  tab,
  setTab,
  selectedCode,
  setSelectedCode,
  selected,
  statusLabel,
  onAction,
  onModal,
  onReassign,
  settled,
  onToggleSettled,
}: {
  packages: DemoPackage[];
  search: string;
  tab: TabKey;
  setTab: (t: TabKey) => void;
  selectedCode: string | null;
  setSelectedCode: (c: string) => void;
  selected: DemoPackage | null;
  statusLabel: (s: StatusKey) => string;
  onAction: (msg?: string) => void;
  onModal: (m: ModalKey) => void;
  onReassign: (code: string, driverId: string | null) => void;
  settled: Set<string>;
  onToggleSettled: (driverId: string, name: string) => void;
}) {
  const t = useTranslations("demo");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return packages.filter((p) => {
      if (tab === "pending" && p.status !== "pending") return false;
      if (
        tab === "active" &&
        !["loaded", "inTransit", "outForDelivery"].includes(p.status)
      )
        return false;
      if (tab === "delivered" && p.status !== "delivered") return false;
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.sender.toLowerCase().includes(q) ||
        p.recipient.toLowerCase().includes(q) ||
        p.route.toLowerCase().includes(q)
      );
    });
  }, [packages, tab, search]);

  const totals = useMemo(() => {
    const inTransit = packages.filter((p) =>
      ["inTransit", "outForDelivery", "loaded"].includes(p.status)
    ).length;
    const delivered = packages.filter((p) => p.status === "delivered").length;
    const pending = packages.filter((p) => p.status === "pending").length;
    const cash: Record<Currency, number> = { EUR: 0, MDL: 0, GBP: 0 };
    packages.forEach((p) => {
      if (
        p.status === "delivered" &&
        p.cod > 0 &&
        p.driverId &&
        !settled.has(p.driverId)
      ) {
        cash[p.currency] += p.cod;
      }
    });
    return { inTransit, delivered, pending, cash };
  }, [packages, settled]);

  return (
    <>
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
            {t("title")}
          </div>
          <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("heroTitle")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t("heroSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onModal("export")}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-sm font-medium text-slate-700"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {t("export")}
          </button>
          <button
            onClick={() => onModal("add")}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            {t("newPackage")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Truck}
          tone="brand"
          label={t("stats.inTransit")}
          value={totals.inTransit}
          hint={t("stats.inTransitHint")}
        />
        <StatCard
          icon={CheckCircle2}
          tone="emerald"
          label={t("stats.delivered")}
          value={totals.delivered}
          hint={t("stats.deliveredHint")}
        />
        <StatCard
          icon={Clock}
          tone="amber"
          label={t("stats.pending")}
          value={totals.pending}
          hint={t("stats.pendingHint")}
        />
        <CashCard label={t("stats.cash")} hint={t("stats.cashHint")} cash={totals.cash} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex p-1 rounded-lg bg-white ring-1 ring-stone-200 text-sm">
          {(
            [
              { k: "all", label: t("tabs.all") },
              { k: "pending", label: t("tabs.pending") },
              { k: "active", label: t("tabs.active") },
              { k: "delivered", label: t("tabs.delivered") },
            ] as { k: TabKey; label: string }[]
          ).map((x) => (
            <button
              key={x.k}
              onClick={() => setTab(x.k)}
              className={cn(
                "px-3 h-7 rounded-md font-medium transition-colors",
                tab === x.k
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onAction()}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
        >
          <Filter className="h-3.5 w-3.5" />
          {t("filters")}
        </button>
        <span className="ml-auto text-xs text-stone-500">
          {t("rowsCount", { n: filtered.length })}
        </span>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl bg-white ring-1 ring-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <Th>{t("col.code")}</Th>
                <Th>{t("col.sender")}</Th>
                <Th className="hidden md:table-cell">{t("col.recipient")}</Th>
                <Th className="hidden lg:table-cell">{t("col.route")}</Th>
                <Th>{t("col.driver")}</Th>
                <Th className="text-right">{t("col.status")}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => {
                const driver = DRIVERS.find((d) => d.id === p.driverId) ?? null;
                const isSelected = selectedCode === p.code;
                return (
                  <tr
                    key={p.code}
                    onClick={() => setSelectedCode(p.code)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected ? "bg-brand-50/50" : "hover:bg-stone-50"
                    )}
                  >
                    <Td>
                      <span className="font-mono text-[12.5px] text-slate-700">
                        {p.code}
                      </span>
                    </Td>
                    <Td>
                      <div className="font-medium text-slate-900">{p.sender}</div>
                      <div className="text-stone-500 text-xs md:hidden truncate max-w-[180px]">
                        {p.recipient}
                      </div>
                    </Td>
                    <Td className="hidden md:table-cell text-slate-600">{p.recipient}</Td>
                    <Td className="hidden lg:table-cell text-slate-600">{p.route}</Td>
                    <Td>
                      {driver ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-5 w-5 rounded-full bg-stone-200 text-[10px] font-semibold text-slate-700 flex items-center justify-center">
                            {driver.initials}
                          </span>
                          <span className="text-slate-700">
                            {driver.name.split(" ")[0]}
                          </span>
                        </span>
                      ) : (
                        <span className="text-stone-400 italic text-xs">
                          {t("unassigned")}
                        </span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <StatusBadge status={p.status} label={statusLabel(p.status)} />
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-stone-500 text-sm">
                    {t("searchEmpty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PackageDrawer
          pkg={selected}
          statusLabel={statusLabel}
          onAction={onAction}
          onModal={onModal}
        />
      </div>

      <AssignBoard
        packages={packages}
        onReassign={onReassign}
        statusLabel={statusLabel}
        onModal={onModal}
      />

      <CashReport
        packages={packages}
        onAction={onAction}
        onModal={onModal}
        settled={settled}
        onToggleSettled={onToggleSettled}
      />
    </>
  );
}

function RunsView({
  packages,
  statusLabel,
  onModal,
  onSelectPackage,
}: {
  packages: DemoPackage[];
  statusLabel: (s: StatusKey) => string;
  onModal: (m: ModalKey) => void;
  onSelectPackage: (code: string) => void;
}) {
  const t = useTranslations("demo");

  const grouped = useMemo(
    () =>
      DRIVERS.map((d) => ({
        driver: d,
        items: packages.filter((p) => p.driverId === d.id),
      })),
    [packages]
  );

  return (
    <>
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
            {t("nav.runs")}
          </div>
          <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("runs.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t("runs.subtitle")}</p>
        </div>
        <button
          onClick={() => onModal("newRun")}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          {t("addRun")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {grouped.map(({ driver, items }) => {
          const delivered = items.filter((i) => i.status === "delivered").length;
          const total = items.length;
          const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;
          return (
            <div
              key={driver.id}
              className="rounded-xl bg-white ring-1 ring-stone-200 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-slate-900 text-white text-sm font-semibold flex items-center justify-center">
                  {driver.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {driver.name}
                  </div>
                  <div className="text-xs text-stone-500 truncate">
                    {driver.route}
                  </div>
                </div>
                <div className="text-xs text-stone-500 font-medium">{pct}%</div>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-stone-500">
                {t("runs.progress", { delivered, total })}
              </div>
              <div className="space-y-1.5 mt-1">
                {items.slice(0, 4).map((p) => (
                  <button
                    key={p.code}
                    onClick={() => onSelectPackage(p.code)}
                    className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-stone-50 text-xs"
                  >
                    <span className="font-mono text-stone-500">{p.code}</span>
                    <span className="text-slate-700 truncate flex-1">
                      {p.recipient}
                    </span>
                    <StatusBadge status={p.status} label={statusLabel(p.status)} />
                  </button>
                ))}
                {items.length === 0 && (
                  <div className="text-xs text-stone-400 italic px-2 py-2">
                    {t("runs.empty")}
                  </div>
                )}
              </div>
              {items.length > 4 && (
                <div className="text-[11px] text-stone-500 px-2">
                  + {items.length - 4} {t("runs.more")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function DriversView({
  packages,
  onAction,
}: {
  packages: DemoPackage[];
  onAction: (msg?: string) => void;
}) {
  const t = useTranslations("demo");
  return (
    <>
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
            {t("nav.drivers")}
          </div>
          <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("drivers.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t("drivers.subtitle")}</p>
        </div>
        <button
          onClick={() => onAction()}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          {t("drivers.add")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {DRIVERS.map((d) => {
          const total = packages.filter((p) => p.driverId === d.id).length;
          const delivered = packages.filter((p) => p.driverId === d.id && p.status === "delivered").length;
          return (
            <div key={d.id} className="rounded-xl bg-white ring-1 ring-stone-200 p-4">
              <div className="flex items-start gap-3">
                <span className="h-12 w-12 rounded-full bg-slate-900 text-white text-base font-semibold flex items-center justify-center">
                  {d.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-slate-900 truncate">
                    {d.name}
                  </div>
                  <div className="text-xs text-stone-500 truncate">{d.route}</div>
                  <div className="text-xs text-stone-500 truncate">{d.vehicle}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 rounded-full px-2 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t("online")}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Mini label={t("drivers.assigned")}>{total}</Mini>
                <Mini label={t("drivers.delivered")}>{delivered}</Mini>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`tel:${d.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {d.phone}
                </a>
                <button
                  onClick={() => onAction()}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {t("drivers.message")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function RoutesView({
  packages,
  onAction,
}: {
  packages: DemoPackage[];
  onAction: (msg?: string) => void;
}) {
  const t = useTranslations("demo");

  const routes = useMemo(() => {
    const map = new Map<string, { count: number; delivered: number }>();
    packages.forEach((p) => {
      const cur = map.get(p.route) ?? { count: 0, delivered: 0 };
      cur.count += 1;
      if (p.status === "delivered") cur.delivered += 1;
      map.set(p.route, cur);
    });
    return [...map.entries()];
  }, [packages]);

  return (
    <>
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
            {t("nav.routes")}
          </div>
          <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
            {t("routes.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{t("routes.subtitle")}</p>
        </div>
        <button
          onClick={() => onAction()}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          {t("routes.add")}
        </button>
      </div>

      <div className="rounded-xl bg-white ring-1 ring-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <Th>{t("routes.name")}</Th>
              <Th className="text-right">{t("routes.total")}</Th>
              <Th className="text-right">{t("routes.delivered")}</Th>
              <Th className="text-right">{t("routes.progress")}</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {routes.map(([name, info]) => {
              const pct = info.count > 0 ? Math.round((info.delivered / info.count) * 100) : 0;
              return (
                <tr key={name} className="hover:bg-stone-50">
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <Route className="h-4 w-4 text-stone-400" />
                      <span className="font-medium text-slate-900">{name}</span>
                    </span>
                  </Td>
                  <Td className="text-right text-slate-700">{info.count}</Td>
                  <Td className="text-right text-emerald-700 font-medium">
                    {info.delivered}
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-500 font-medium w-9 text-right">
                        {pct}%
                      </span>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ReportsView({
  packages,
  onAction,
  settled,
  onToggleSettled,
}: {
  packages: DemoPackage[];
  onAction: (msg?: string) => void;
  settled: Set<string>;
  onToggleSettled: (driverId: string, name: string) => void;
}) {
  const t = useTranslations("demo");
  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
          {t("nav.reports")}
        </div>
        <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
          {t("reports.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t("reports.subtitle")}</p>
      </div>
      <CashReport
        packages={packages}
        onAction={onAction}
        onModal={() => onAction()}
        settled={settled}
        onToggleSettled={onToggleSettled}
      />
    </>
  );
}

function AnalyticsView({ packages }: { packages: DemoPackage[] }) {
  const t = useTranslations("demo");

  const byStatus = useMemo(() => {
    const counts: Record<StatusKey, number> = {
      pending: 0,
      loaded: 0,
      inTransit: 0,
      outForDelivery: 0,
      delivered: 0,
    };
    packages.forEach((p) => {
      counts[p.status] += 1;
    });
    return counts;
  }, [packages]);

  const max = Math.max(...Object.values(byStatus), 1);

  const series = [4, 6, 3, 8, 7, 9, 5, 10, 12, 9, 11, 14];
  const seriesMax = Math.max(...series);

  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
          {t("nav.analytics")}
        </div>
        <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
          {t("analytics.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t("analytics.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-stone-500" />
            <h2 className="text-sm font-semibold text-slate-900">
              {t("analytics.weekTitle")}
            </h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {series.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-brand-500/80 hover:bg-brand-500 transition-colors"
                style={{ height: `${(v / seriesMax) * 100}%` }}
                title={`${v}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-wide mt-2">
            <span>L</span><span>M</span><span>M</span><span>J</span>
            <span>V</span><span>S</span><span>D</span>
            <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span>
          </div>
        </div>

        <div className="rounded-xl bg-white ring-1 ring-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CircleDot className="h-4 w-4 text-stone-500" />
            <h2 className="text-sm font-semibold text-slate-900">
              {t("analytics.statusTitle")}
            </h2>
          </div>
          <div className="space-y-3">
            {(Object.keys(byStatus) as StatusKey[]).map((s) => {
              const v = byStatus[s];
              const pct = (v / max) * 100;
              const style = STATUS_STYLES[s];
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-xs text-slate-700 w-28 truncate capitalize">
                    {s === "outForDelivery" ? "out for delivery" : s}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div className={cn("h-full", style.dot)} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-700 w-6 text-right font-medium">
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsView({ onAction }: { onAction: (msg?: string) => void }) {
  const t = useTranslations("demo");

  const items = [
    { icon: Building2, key: "company" },
    { icon: Users, key: "team" },
    { icon: Wallet, key: "billing" },
    { icon: Bell, key: "notifications" },
    { icon: QrCode, key: "branding" },
    { icon: User, key: "profile" },
  ] as const;

  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
          {t("nav.settings")}
        </div>
        <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t("settings.subtitle")}</p>
      </div>

      <div className="rounded-xl bg-white ring-1 ring-stone-200 divide-y divide-stone-100">
        {items.map(({ icon: Icon, key }) => (
          <button
            key={key}
            onClick={() => onAction()}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone-50 transition-colors"
          >
            <span className="h-9 w-9 rounded-lg bg-stone-100 text-slate-700 flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">
                {t(`settings.items.${key}.title`)}
              </div>
              <div className="text-xs text-stone-500 truncate">
                {t(`settings.items.${key}.body`)}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-stone-400" />
          </button>
        ))}
      </div>
    </>
  );
}

function SupportView() {
  const t = useTranslations("demo");
  return (
    <>
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-500">
          {t("nav.support")}
        </div>
        <h1 className="mt-1 font-serif font-medium text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] tracking-[-0.015em] leading-[1.1] text-slate-900">
          {t("support.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{t("support.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <a
          href="https://wa.me/37368327082"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white ring-1 ring-stone-200 p-5 flex items-start gap-3 hover:bg-stone-50"
        >
          <span className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 flex items-center justify-center">
            <Phone className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900">WhatsApp</div>
            <div className="text-xs text-stone-500">+373 68 327 082</div>
            <div className="text-xs text-stone-500 mt-1">{t("support.fast")}</div>
          </div>
        </a>
        <a
          href="mailto:sales@droppack.md"
          className="rounded-xl bg-white ring-1 ring-stone-200 p-5 flex items-start gap-3 hover:bg-stone-50"
        >
          <span className="h-10 w-10 rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 flex items-center justify-center">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900">Email</div>
            <div className="text-xs text-stone-500">sales@droppack.md</div>
            <div className="text-xs text-stone-500 mt-1">{t("support.email")}</div>
          </div>
        </a>
      </div>

      <div className="rounded-xl bg-white ring-1 ring-stone-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <LifeBuoy className="h-4 w-4 text-stone-500" />
          <h2 className="text-sm font-semibold text-slate-900">{t("support.docsTitle")}</h2>
        </div>
        <ul className="space-y-1.5 text-sm text-slate-700">
          {(["item1", "item2", "item3", "item4"] as const).map((k) => (
            <li key={k} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{t(`support.${k}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ============================== Shared bits ============================== */

function NavItem({
  icon: Icon,
  active,
  children,
  onClick,
}: {
  icon: typeof Package;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm transition-colors text-left",
        active
          ? "bg-white ring-1 ring-stone-200 text-slate-900 font-semibold shadow-sm"
          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-slate-600"
    >
      {children}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  hint: string;
  tone: "brand" | "emerald" | "amber";
}) {
  const tones = {
    brand: { bg: "bg-brand-50", text: "text-brand-600", ring: "ring-brand-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  }[tone];
  return (
    <div className="rounded-xl bg-white ring-1 ring-stone-200 p-4 flex items-start gap-3">
      <div className={cn("h-9 w-9 rounded-lg ring-1 flex items-center justify-center", tones.bg, tones.ring, tones.text)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-stone-500">{label}</div>
        <div className="text-2xl font-semibold text-slate-900 leading-tight mt-0.5">
          {value}
        </div>
        <div className="text-[11px] text-stone-400 mt-0.5 truncate">{hint}</div>
      </div>
    </div>
  );
}

function CashCard({
  label,
  hint,
  cash,
}: {
  label: string;
  hint?: string;
  cash: Record<Currency, number>;
}) {
  const formatters: Record<Currency, Intl.NumberFormat> = {
    EUR: new Intl.NumberFormat("ro-MD", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    MDL: new Intl.NumberFormat("ro-MD", { style: "currency", currency: "MDL", maximumFractionDigits: 0 }),
    GBP: new Intl.NumberFormat("ro-MD", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }),
  };
  const entries = (Object.keys(cash) as Currency[])
    .map((c) => [c, cash[c]] as const)
    .filter(([, v]) => v > 0);
  return (
    <div className="rounded-xl bg-slate-900 text-white p-4 flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
        <Banknote className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-white/70">{label}</div>
        <div className="text-2xl font-semibold leading-tight mt-0.5 truncate">
          {entries.length > 0 ? formatters[entries[0][0]].format(entries[0][1]) : "—"}
        </div>
        <div className="text-[11px] text-white/60 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
          {entries.slice(1).length > 0 ? (
            entries.slice(1).map(([c, v]) => (
              <span key={c} className="font-medium">
                {formatters[c].format(v)}
              </span>
            ))
          ) : hint ? (
            <span>{hint}</span>
          ) : (
            <span>—</span>
          )}
        </div>
      </div>
    </div>
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
        "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em]",
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
    <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>
  );
}

function StatusBadge({ status, label }: { status: StatusKey; label: string }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        s.bg,
        s.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {label}
    </span>
  );
}

function PackageDrawer({
  pkg,
  statusLabel,
  onAction,
  onModal,
}: {
  pkg: DemoPackage | null;
  statusLabel: (s: StatusKey) => string;
  onAction: (msg?: string) => void;
  onModal: (m: ModalKey) => void;
}) {
  const t = useTranslations("demo");
  if (!pkg) {
    return (
      <div className="rounded-xl bg-white ring-1 ring-stone-200 p-6 text-sm text-stone-500 flex items-center justify-center min-h-[260px]">
        {t("emptyDrawer")}
      </div>
    );
  }
  const driver = DRIVERS.find((d) => d.id === pkg.driverId) ?? null;
  const moneyFmt = new Intl.NumberFormat("ro-MD", {
    style: "currency",
    currency: pkg.currency,
    maximumFractionDigits: 0,
  });

  return (
    <div className="rounded-xl bg-white ring-1 ring-stone-200 overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-stone-200 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500">
            {t("packageDetail")}
          </div>
          <div className="mt-0.5 font-mono text-base text-slate-900">
            {pkg.code}
          </div>
        </div>
        <StatusBadge status={pkg.status} label={statusLabel(pkg.status)} />
        <button
          onClick={() => onAction()}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg ring-1 ring-stone-200 text-slate-500 hover:bg-stone-50"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-4 text-sm">
        <DetailRow label={t("pickup")}>
          <div className="font-medium text-slate-900">{pkg.sender}</div>
          <div className="text-stone-500 text-xs">{pkg.pickupAddr}</div>
        </DetailRow>
        <DetailRow label={t("delivery")}>
          <div className="font-medium text-slate-900">{pkg.recipient}</div>
          <div className="text-stone-500 text-xs">{pkg.deliveryAddr}</div>
          <div className="text-stone-500 text-xs mt-0.5">{pkg.recipientPhone}</div>
        </DetailRow>

        <div className="grid grid-cols-3 gap-3 pt-1">
          <Mini label={t("weight")}>{pkg.weightKg.toFixed(1)} kg</Mini>
          <Mini label={t("cod")}>
            {pkg.cod > 0 ? moneyFmt.format(pkg.cod) : "—"}
          </Mini>
          <Mini label={t("driverShort")}>
            {driver ? driver.name.split(" ")[0] : "—"}
          </Mini>
        </div>

        <div className="pt-1">
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500 mb-2">
            {t("proof")}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ProofTile icon={Camera} ok={pkg.proofPhoto} label={t("photoProof")} />
            <ProofTile icon={FileSignature} ok={pkg.signature} label={t("signature")} />
          </div>
          {pkg.notes && (
            <p className="mt-3 text-xs text-slate-700 bg-stone-50 ring-1 ring-stone-200 rounded-lg px-3 py-2">
              <span className="font-serif italic">{t("notes")}:</span> {pkg.notes}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <DrawerBtn icon={ArrowRight} onClick={() => onModal("status")}>
            {t("changeStatus")}
          </DrawerBtn>
          <DrawerBtn
            icon={Phone}
            onClick={() => {
              window.location.href = `tel:${pkg.recipientPhone.replace(/\s+/g, "")}`;
            }}
          >
            {t("callRecipient")}
          </DrawerBtn>
          <DrawerBtn icon={Users} onClick={() => onModal("reassign")}>
            {t("reassign")}
          </DrawerBtn>
          <DrawerBtn icon={Printer} onClick={() => onModal("print")}>
            {t("print")}
          </DrawerBtn>
        </div>

        <button
          onClick={() => onModal("archive")}
          className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-medium text-stone-600 hover:text-slate-900 hover:bg-stone-50"
        >
          <ArchiveRestore className="h-4 w-4" />
          {t("archive")}
        </button>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500 mb-1">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-stone-50 ring-1 ring-stone-200 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-stone-500">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
        {children}
      </div>
    </div>
  );
}

function ProofTile({
  icon: Icon,
  ok,
  label,
}: {
  icon: typeof Camera;
  ok?: boolean;
  label: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg ring-1 px-3 py-2.5 flex items-center gap-2",
        ok
          ? "bg-emerald-50 ring-emerald-200 text-emerald-800"
          : "bg-stone-50 ring-stone-200 text-stone-500"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate">{label}</div>
        <div className={cn("text-[10px]", ok ? "text-emerald-700" : "text-stone-400")}>
          {ok ? "OK" : "—"}
        </div>
      </div>
    </div>
  );
}

function DrawerBtn({
  icon: Icon,
  children,
  onClick,
}: {
  icon: typeof Phone;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function AssignBoard({
  packages,
  onReassign,
  statusLabel,
  onModal,
}: {
  packages: DemoPackage[];
  onReassign: (code: string, driverId: string | null) => void;
  statusLabel: (s: StatusKey) => string;
  onModal: (m: ModalKey) => void;
}) {
  const t = useTranslations("demo");
  const [dragCode, setDragCode] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const cols: { id: string; title: string; sub?: string; driverId: string | null }[] = [
    { id: "unassigned", title: t("unassigned"), driverId: null },
    ...DRIVERS.map((d) => ({
      id: d.id,
      title: d.name,
      sub: d.route,
      driverId: d.id,
    })),
  ];

  return (
    <section className="rounded-xl bg-white ring-1 ring-stone-200">
      <div className="px-5 py-4 border-b border-stone-200 flex items-start gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500">
            {t("assignBoard")}
          </div>
          <h2 className="mt-1 font-serif font-medium text-lg text-slate-900">
            {t("assignBoardTitle")}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">{t("assignBoardSubtitle")}</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <button
            onClick={() => onModal("newRun")}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
          >
            <Truck className="h-3.5 w-3.5" />
            {t("addRun")}
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {cols.map((col) => {
          const items = packages.filter((p) => p.driverId === col.driverId);
          const isOver = dragOver === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.id);
              }}
              onDragLeave={() => setDragOver((x) => (x === col.id ? null : x))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragCode) onReassign(dragCode, col.driverId);
                setDragCode(null);
                setDragOver(null);
              }}
              className={cn(
                "rounded-lg ring-1 p-3 min-h-[180px] transition-colors",
                isOver ? "ring-brand-400 bg-brand-50/40" : "ring-stone-200 bg-stone-50/60"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                {col.driverId ? (
                  <span className="h-7 w-7 rounded-full bg-stone-900 text-white text-[11px] font-semibold flex items-center justify-center">
                    {DRIVERS.find((d) => d.id === col.driverId)?.initials}
                  </span>
                ) : (
                  <span className="h-7 w-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {col.title}
                  </div>
                  {col.sub && (
                    <div className="text-[11px] text-stone-500 truncate">{col.sub}</div>
                  )}
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  {items.length}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((p) => (
                  <div
                    key={p.code}
                    draggable
                    onDragStart={() => setDragCode(p.code)}
                    onDragEnd={() => {
                      setDragCode(null);
                      setDragOver(null);
                    }}
                    className={cn(
                      "rounded-lg bg-white ring-1 ring-stone-200 p-2.5 cursor-grab active:cursor-grabbing select-none transition-shadow",
                      dragCode === p.code && "opacity-50",
                      "hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11.5px] text-stone-500">
                        {p.code}
                      </span>
                      <StatusBadge status={p.status} label={statusLabel(p.status)} />
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-900 truncate">
                      {p.recipient}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {p.deliveryAddr}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-[11px] text-stone-400 italic text-center py-6">
                    {t("dropHere")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CashReport({
  packages,
  onModal,
  settled,
  onToggleSettled,
}: {
  packages: DemoPackage[];
  onAction: (msg?: string) => void;
  onModal: (m: ModalKey) => void;
  settled: Set<string>;
  onToggleSettled: (driverId: string, name: string) => void;
}) {
  const t = useTranslations("demo");

  const rows = useMemo(() => {
    return DRIVERS.map((d) => {
      const totals: Record<Currency, number> = { EUR: 0, MDL: 0, GBP: 0 };
      let count = 0;
      packages
        .filter((p) => p.driverId === d.id && p.status === "delivered" && p.cod > 0)
        .forEach((p) => {
          totals[p.currency] += p.cod;
          count += 1;
        });
      return { driver: d, totals, count, isSettled: settled.has(d.id) };
    });
  }, [packages, settled]);

  const grandTotals = useMemo(() => {
    const t: Record<Currency, number> = { EUR: 0, MDL: 0, GBP: 0 };
    rows.forEach((r) => {
      if (r.isSettled) return;
      (Object.keys(r.totals) as Currency[]).forEach((c) => {
        t[c] += r.totals[c];
      });
    });
    return t;
  }, [rows]);

  const grandEntries = (Object.keys(grandTotals) as Currency[])
    .map((c) => [c, grandTotals[c]] as const)
    .filter(([, v]) => v > 0);

  const fmt = (currency: Currency, value: number) =>
    new Intl.NumberFormat("ro-MD", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="rounded-xl bg-white ring-1 ring-stone-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-200 flex items-start gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500">
            {t("cashReport")}
          </div>
          <h2 className="mt-1 font-serif font-medium text-lg text-slate-900">
            {t("cashReportTitle")}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5 max-w-2xl">
            {t("cashReportSubtitle")}
          </p>
        </div>
        <button
          onClick={() => onModal("export")}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-slate-700"
        >
          <Download className="h-3.5 w-3.5" />
          {t("exportAccounting")}
        </button>
      </div>

      <div className="bg-slate-900 text-white px-5 py-5 flex items-baseline gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/60">
            {t("totalOwed")}
          </div>
          <div className="mt-1 font-serif font-medium text-2xl sm:text-3xl leading-none">
            {grandEntries.length > 0 ? fmt(grandEntries[0][0], grandEntries[0][1]) : "—"}
          </div>
        </div>
        {grandEntries.slice(1).length > 0 && (
          <div className="flex items-baseline gap-3 text-white/80">
            {grandEntries.slice(1).map(([c, v]) => (
              <span key={c} className="font-serif text-xl">
                +{" "}
                <span className="font-medium">{fmt(c, v)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <ul className="divide-y divide-stone-100">
        {rows.map((r) => {
          const entries = (Object.keys(r.totals) as Currency[])
            .map((c) => [c, r.totals[c]] as const)
            .filter(([, v]) => v > 0);
          const hasOwed = entries.length > 0;
          return (
            <li key={r.driver.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
              <span
                className={cn(
                  "h-10 w-10 rounded-full text-white text-sm font-semibold flex items-center justify-center shrink-0",
                  r.isSettled ? "bg-emerald-600" : "bg-slate-900"
                )}
              >
                {r.isSettled ? <Check className="h-4 w-4" /> : r.driver.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {r.driver.name}
                </div>
                <div className="text-[11px] text-stone-500 truncate">
                  {r.driver.route} · {r.count} {t("col.deliveries").toLowerCase()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-stone-500">
                  {r.isSettled ? t("settled") : t("owesYou")}
                </div>
                {r.isSettled ? (
                  <div className="text-base font-semibold text-emerald-700 mt-0.5">
                    {t("settledHint")}
                  </div>
                ) : hasOwed ? (
                  <div className="mt-0.5 flex items-baseline gap-2 justify-end flex-wrap">
                    {entries.map(([c, v], i) => (
                      <span
                        key={c}
                        className={cn(
                          "font-serif font-medium",
                          i === 0
                            ? "text-2xl text-slate-900 leading-none"
                            : "text-sm text-stone-500"
                        )}
                      >
                        {i > 0 && <span className="mr-1 text-stone-400">+</span>}
                        {fmt(c, v)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-stone-400 italic mt-0.5">
                    {t("noOwed")}
                  </div>
                )}
              </div>

              <button
                onClick={() => onToggleSettled(r.driver.id, r.driver.name)}
                disabled={!hasOwed && !r.isSettled}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed",
                  r.isSettled
                    ? "ring-1 ring-stone-200 bg-white hover:bg-stone-50 text-slate-700"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                )}
              >
                {r.isSettled ? (
                  <>
                    <ArchiveRestore className="h-3.5 w-3.5" />
                    {t("undoSettle")}
                  </>
                ) : (
                  <>
                    <Wallet className="h-3.5 w-3.5" />
                    {t("markSettled")}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ============================== Modals ============================== */

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  size = "md",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  } as const;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "demo-modal w-full bg-white rounded-2xl ring-1 ring-stone-200 shadow-xl overflow-hidden",
          sizes[size]
        )}
      >
        <div className="flex items-start gap-3 px-6 py-4 border-b border-stone-200">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-medium text-lg text-slate-900 leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-stone-500 mb-1.5 flex items-baseline gap-2">
      <span>{children}</span>
      {hint && <span className="text-[10px] text-stone-400 normal-case tracking-normal">{hint}</span>}
    </div>
  );
}

function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full h-10 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm text-slate-900 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 transition",
        className
      )}
    />
  );
}

function Select({
  children,
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={cn(
        "w-full h-10 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition",
        className
      )}
    >
      {children}
    </select>
  );
}

function AddPackageModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (code: string) => void;
}) {
  const t = useTranslations("demo");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pickupAddr, setPickupAddr] = useState("");
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [phone, setPhone] = useState("");
  const [route, setRoute] = useState("Chișinău → Berlin");
  const [driver, setDriver] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [cod, setCod] = useState("");
  const [weight, setWeight] = useState("");
  const code = useMemo(() => `DP-${Math.floor(2900 + Math.random() * 99)}`, []);

  return (
    <ModalShell
      title={t("modals.add.title")}
      subtitle={t("modals.add.subtitle")}
      onClose={onClose}
      size="lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(code);
        }}
        className="px-6 py-5 space-y-5"
      >
        <div className="flex items-center gap-3 rounded-lg bg-stone-50 ring-1 ring-stone-200 px-4 py-3">
          <span className="font-mono text-sm text-stone-500">{code}</span>
          <span className="text-xs text-stone-500">{t("modals.add.codeHint")}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>{t("modals.add.sender")}</FieldLabel>
            <Input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Maria Cebotari" required />
          </div>
          <div>
            <FieldLabel>{t("modals.add.recipient")}</FieldLabel>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Andrei Roșca" required />
          </div>
          <div>
            <FieldLabel>{t("modals.add.pickup")}</FieldLabel>
            <Input value={pickupAddr} onChange={(e) => setPickupAddr(e.target.value)} placeholder="Str. Albișoara 14, Chișinău" />
          </div>
          <div>
            <FieldLabel>{t("modals.add.delivery")}</FieldLabel>
            <Input value={deliveryAddr} onChange={(e) => setDeliveryAddr(e.target.value)} placeholder="Hauptstr. 12, Berlin" />
          </div>
          <div>
            <FieldLabel>{t("modals.add.phone")}</FieldLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 30 12345678" />
          </div>
          <div>
            <FieldLabel>{t("modals.add.route")}</FieldLabel>
            <Select value={route} onChange={(e) => setRoute(e.target.value)}>
              <option>Chișinău → Berlin</option>
              <option>Bălți → Roma</option>
              <option>Chișinău → Amsterdam</option>
              <option>Chișinău → Bruxelles</option>
              <option>Chișinău → Londra</option>
              <option>Chișinău → München</option>
              <option>Intern · Chișinău</option>
            </Select>
          </div>
          <div>
            <FieldLabel>{t("modals.add.driver")}</FieldLabel>
            <Select value={driver} onChange={(e) => setDriver(e.target.value)}>
              <option value="">{t("modals.add.driverEmpty")}</option>
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel>{t("modals.add.weight")}</FieldLabel>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="4.2" />
          </div>
          <div>
            <FieldLabel>{t("modals.add.currency")}</FieldLabel>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              <option value="EUR">EUR</option>
              <option value="MDL">MDL</option>
              <option value="GBP">GBP</option>
            </Select>
          </div>
          <div>
            <FieldLabel>{t("modals.add.cod")}</FieldLabel>
            <Input value={cod} onChange={(e) => setCod(e.target.value)} placeholder="0" inputMode="numeric" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-xs text-amber-900">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{t("modals.add.demoNote")}</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
          >
            {t("modals.cancel")}
          </button>
          <button
            type="submit"
            className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
          >
            {t("modals.add.submit")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function StatusModal({
  pkg,
  onClose,
  onApply,
  statusLabel,
}: {
  pkg: DemoPackage;
  onClose: () => void;
  onApply: (s: StatusKey) => void;
  statusLabel: (s: StatusKey) => string;
}) {
  const t = useTranslations("demo");
  const [pick, setPick] = useState<StatusKey>(pkg.status);
  return (
    <ModalShell
      title={t("modals.status.title")}
      subtitle={t("modals.status.subtitle", { code: pkg.code })}
      onClose={onClose}
      size="sm"
    >
      <div className="px-6 py-5 space-y-2">
        {STATUS_FLOW.map((s) => {
          const active = pick === s;
          const style = STATUS_STYLES[s];
          return (
            <button
              key={s}
              onClick={() => setPick(s)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ring-1 transition-colors text-left",
                active
                  ? "ring-slate-900 bg-stone-50"
                  : "ring-stone-200 hover:bg-stone-50"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              <span className="text-sm font-medium text-slate-900 flex-1">
                {statusLabel(s)}
              </span>
              {active && <Check className="h-4 w-4 text-slate-900" />}
            </button>
          );
        })}
      </div>
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.cancel")}
        </button>
        <button
          onClick={() => onApply(pick)}
          className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          {t("modals.status.apply")}
        </button>
      </div>
    </ModalShell>
  );
}

function ReassignModal({
  pkg,
  onClose,
  onApply,
}: {
  pkg: DemoPackage;
  onClose: () => void;
  onApply: (driverId: string | null) => void;
}) {
  const t = useTranslations("demo");
  const [pick, setPick] = useState<string | null>(pkg.driverId);
  return (
    <ModalShell
      title={t("modals.reassign.title")}
      subtitle={t("modals.reassign.subtitle", { code: pkg.code })}
      onClose={onClose}
      size="sm"
    >
      <div className="px-6 py-5 space-y-2">
        <DriverPick driver={null} active={pick === null} onClick={() => setPick(null)} />
        {DRIVERS.map((d) => (
          <DriverPick
            key={d.id}
            driver={d}
            active={pick === d.id}
            onClick={() => setPick(d.id)}
          />
        ))}
      </div>
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.cancel")}
        </button>
        <button
          onClick={() => onApply(pick)}
          className="h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          {t("modals.reassign.apply")}
        </button>
      </div>
    </ModalShell>
  );
}

function DriverPick({
  driver,
  active,
  onClick,
}: {
  driver: DemoDriver | null;
  active: boolean;
  onClick: () => void;
}) {
  const t = useTranslations("demo");
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ring-1 transition-colors text-left",
        active ? "ring-slate-900 bg-stone-50" : "ring-stone-200 hover:bg-stone-50"
      )}
    >
      <span
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold",
          driver ? "bg-slate-900 text-white" : "bg-stone-200 text-stone-600"
        )}
      >
        {driver ? driver.initials : <Package className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-900 truncate">
          {driver ? driver.name : t("unassigned")}
        </div>
        {driver && (
          <div className="text-xs text-stone-500 truncate">{driver.route}</div>
        )}
      </div>
      {active && <Check className="h-4 w-4 text-slate-900" />}
    </button>
  );
}

function PrintModal({
  pkg,
  onClose,
  onConfirm,
}: {
  pkg: DemoPackage;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("demo");
  return (
    <ModalShell
      title={t("modals.print.title")}
      subtitle={t("modals.print.subtitle")}
      onClose={onClose}
      size="md"
    >
      <div className="px-6 py-5">
        <div className="rounded-xl ring-2 ring-dashed ring-stone-300 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 rounded bg-slate-900 text-white flex items-center justify-center">
              <QrCode className="h-12 w-12" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-stone-500">
                DropPack
              </div>
              <div className="font-mono text-2xl text-slate-900 leading-none">
                {pkg.code}
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-2">
                {pkg.recipient}
              </div>
              <div className="text-xs text-stone-600">{pkg.deliveryAddr}</div>
              <div className="text-xs text-stone-600">{pkg.recipientPhone}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded bg-stone-50 px-2 py-1">
              <div className="text-[10px] uppercase text-stone-500">{t("weight")}</div>
              <div className="font-semibold">{pkg.weightKg.toFixed(1)} kg</div>
            </div>
            <div className="rounded bg-stone-50 px-2 py-1">
              <div className="text-[10px] uppercase text-stone-500">{t("col.route")}</div>
              <div className="font-semibold truncate">{pkg.route}</div>
            </div>
            <div className="rounded bg-stone-50 px-2 py-1">
              <div className="text-[10px] uppercase text-stone-500">{t("cod")}</div>
              <div className="font-semibold">
                {pkg.cod > 0 ? `${pkg.cod} ${pkg.currency}` : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          <Printer className="h-3.5 w-3.5" />
          {t("modals.print.confirm")}
        </button>
      </div>
    </ModalShell>
  );
}

function NotificationsModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("demo");
  const items = (t.raw("modals.notifications.items") as { title: string; body: string; tone: "info" | "success" | "warn"; time: string }[]) ?? [];
  const tones = {
    info: "bg-brand-50 text-brand-600 ring-brand-100",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warn: "bg-amber-50 text-amber-700 ring-amber-100",
  } as const;
  return (
    <ModalShell
      title={t("modals.notifications.title")}
      subtitle={t("modals.notifications.subtitle")}
      onClose={onClose}
      size="md"
    >
      <ul className="divide-y divide-stone-100 max-h-[60vh] overflow-y-auto">
        {items.map((it, i) => (
          <li key={i} className="px-6 py-4 flex items-start gap-3">
            <span className={cn("h-8 w-8 rounded-lg ring-1 flex items-center justify-center shrink-0", tones[it.tone])}>
              <Bell className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">{it.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{it.body}</div>
              <div className="text-[11px] text-stone-400 mt-1">{it.time}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-3 border-t border-stone-200 text-right">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.close")}
        </button>
      </div>
    </ModalShell>
  );
}

function ConfirmModal({
  title,
  body,
  confirmLabel,
  tone = "neutral",
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "neutral" | "danger";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("demo");
  return (
    <ModalShell title={title} onClose={onClose} size="sm">
      <div className="px-6 py-5 text-sm text-slate-700 leading-relaxed">{body}</div>
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "h-9 px-3 rounded-lg text-white text-sm font-semibold",
            tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}

function ExportModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("demo");
  return (
    <ModalShell
      title={t("modals.export.title")}
      subtitle={t("modals.export.subtitle")}
      onClose={onClose}
      size="sm"
    >
      <div className="px-6 py-5 space-y-3">
        {(["allToday", "deliveredOnly", "byDriver", "cashOnly"] as const).map(
          (k, i) => (
            <label
              key={k}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg ring-1 ring-stone-200 hover:bg-stone-50 cursor-pointer"
            >
              <input
                type="radio"
                name="export"
                defaultChecked={i === 0}
                className="h-4 w-4 accent-slate-900"
              />
              <span className="text-sm font-medium text-slate-900">
                {t(`modals.export.options.${k}`)}
              </span>
            </label>
          )
        )}
      </div>
      <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-2">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
        >
          {t("modals.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          <Download className="h-3.5 w-3.5" />
          {t("modals.export.confirm")}
        </button>
      </div>
    </ModalShell>
  );
}

function NewRunModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("demo");
  return (
    <ModalShell
      title={t("modals.newRun.title")}
      subtitle={t("modals.newRun.subtitle")}
      onClose={onClose}
      size="md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm();
        }}
        className="px-6 py-5 space-y-4"
      >
        <div>
          <FieldLabel>{t("modals.newRun.driver")}</FieldLabel>
          <Select defaultValue={DRIVERS[0].id}>
            {DRIVERS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>{t("modals.newRun.route")}</FieldLabel>
          <Select defaultValue="Chișinău → Berlin">
            <option>Chișinău → Berlin</option>
            <option>Bălți → Roma</option>
            <option>Chișinău → Amsterdam</option>
            <option>Chișinău → Bruxelles</option>
            <option>Chișinău → München</option>
          </Select>
        </div>
        <div>
          <FieldLabel>{t("modals.newRun.date")}</FieldLabel>
          <Input type="date" defaultValue="2026-05-07" />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-xs text-amber-900">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{t("modals.newRun.demoNote")}</span>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg ring-1 ring-stone-200 bg-white text-sm font-medium text-slate-700 hover:bg-stone-50"
          >
            {t("modals.cancel")}
          </button>
          <button
            type="submit"
            className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
          >
            {t("modals.newRun.confirm")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
