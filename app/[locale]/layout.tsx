import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Locale = (typeof routing.locales)[number];
const hasLocale = (locale: string): locale is Locale =>
  (routing.locales as readonly string[]).includes(locale);
import { Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://droppack.md"),
  title: "DropPack — Software pentru companii de transport colete | Moldova",
  description:
    "Aplicație completă pentru gestionarea coletelor și pasagerilor pe rute Moldova–Europa. Panou pentru birou, aplicație pentru șoferi, totul într-un singur loc. Cere ofertă personalizată.",
  alternates: {
    canonical: "https://droppack.md",
    languages: {
      ro: "https://droppack.md/ro",
      ru: "https://droppack.md/ru",
    },
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "https://droppack.md",
    siteName: "DropPack",
    title: "DropPack — Software pentru companii de transport colete",
    description:
      "Gestionați coletele profesionist. Panou pentru birou + aplicație pentru șoferi. Pentru rute Moldova–Europa.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DropPack",
      },
    ],
    locale: "ro_MD",
    alternateLocale: ["ru_MD"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DropPack — Software pentru companii de transport colete",
    description:
      "Gestionați coletele profesionist. Panou pentru birou + aplicație pentru șoferi.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
