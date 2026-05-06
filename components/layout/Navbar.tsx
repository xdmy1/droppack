"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#top", key: "home" },
  { href: "#features", key: "features" },
  { href: "#how", key: "how" },
  { href: "#faq", key: "faq" },
  { href: "#contact", key: "contact" },
] as const;

const BRAND = "DropPack";

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const logoScale = useTransform(scrollY, [0, 140], [1, 1.12], { clamp: true });
  const brandOpacity = useTransform(scrollY, [0, 80], [1, 0], { clamp: true });
  const brandX = useTransform(scrollY, [0, 80], [0, -8], { clamp: true });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMobile = () => setOpen(false);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "shadow-sm" : "shadow-none"
      )}
    >
      <div className="mx-auto max-w-7xl container-pad flex h-16 items-center gap-4">
        <a
          href="#top"
          className="flex items-center gap-2 shrink-0"
          aria-label="DropPack"
        >
          <motion.div
            style={{ rotate, scale: logoScale }}
            className="relative z-10 h-10 w-10 will-change-transform"
          >
            <Image
              src="/logo.png"
              alt="DropPack"
              width={48}
              height={48}
              priority
              className="h-10 w-10"
            />
          </motion.div>
          <motion.span
            aria-hidden="true"
            style={{ opacity: brandOpacity, x: brandX }}
            className="font-serif italic text-slate-900 text-lg tracking-tight hidden sm:inline-block will-change-transform"
          >
            {BRAND}
          </motion.span>
        </a>

        <nav className="hidden lg:flex items-center gap-7 mx-auto">
          {NAV_LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <LanguageToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">{t("cta")}</a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="lg:hidden fixed inset-0 z-[60] bg-white"
        >
            <div className="flex flex-col h-full">
              <div className="flex h-16 items-center container-pad mx-auto max-w-7xl w-full">
                <a
                  href="#top"
                  onClick={closeMobile}
                  className="flex items-center gap-2 shrink-0"
                  aria-label="DropPack"
                >
                  <Image
                    src="/logo.png"
                    alt=""
                    width={40}
                    height={40}
                    className="h-9 w-9"
                  />
                  <span className="font-serif italic text-slate-900 text-lg tracking-tight">
                    DropPack
                  </span>
                </a>
                <button
                  type="button"
                  onClick={closeMobile}
                  aria-label={t("closeMenu")}
                  className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 container-pad mx-auto max-w-7xl w-full py-6 flex flex-col">
                {NAV_LINKS.map((l, i) => (
                  <motion.a
                    key={l.key}
                    href={l.href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: 0.04 + i * 0.04,
                      ease: "easeOut",
                    }}
                    className="font-serif text-[2rem] leading-tight text-slate-900 py-3 border-b border-slate-200 hover:text-slate-500 transition-colors"
                  >
                    {t(l.key)}
                  </motion.a>
                ))}
              </nav>

              <div className="container-pad mx-auto max-w-7xl w-full pb-8 space-y-4">
                <Button asChild size="lg" className="w-full">
                  <a href="#contact" onClick={closeMobile}>
                    {t("cta")}
                  </a>
                </Button>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <a
                    href="https://wa.me/37368327082"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-900"
                  >
                    +373 68 327 082
                  </a>
                  <a
                    href="mailto:sales@droppack.md"
                    className="hover:text-slate-900"
                  >
                    sales@droppack.md
                  </a>
                </div>
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
