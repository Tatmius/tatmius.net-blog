import "@/app/globals.css";
import { HtmlLangSetter } from "@/components/html-lang-setter";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        en: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/en/`,
        ja: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/ja/`,
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <HtmlLangSetter lang={params?.locale} />
      {children}
    </>
  );
}
