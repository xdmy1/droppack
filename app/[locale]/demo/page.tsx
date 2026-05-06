import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DemoApp } from "@/components/demo/DemoApp";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DemoApp locale={locale} />;
}
