import Link from "next/link";
import articlesData from "@/data/articles.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LocaleInfo = { title: string; excerpt: string };
type ArticleRecord = {
  slug: string;
  date: string;
  [locale: string]: LocaleInfo | string;
};

type LanguageDisplay = {
  of(code: string): string | undefined;
};
type DisplayNamesCtor = new (
  locales: string | string[],
  options: { type: "language" }
) => LanguageDisplay;

interface ArticleTranslationsCardProps {
  slug: string;
  currentLocale: string;
}

export function ArticleTranslationsCard({
  slug,
  currentLocale,
}: ArticleTranslationsCardProps) {
  const data = (articlesData as Record<string, ArticleRecord>)[slug];
  if (!data) return null;

  const locales = Object.keys(data).filter((k) => k !== "slug" && k !== "date");
  if (locales.length <= 1) return null;
  const otherLocales = locales.filter((l) => l !== currentLocale);
  if (otherLocales.length === 0) return null;

  const DisplayNamesCtor: DisplayNamesCtor | undefined =
    typeof Intl !== "undefined" &&
    (Intl as unknown as { DisplayNames?: DisplayNamesCtor }).DisplayNames
      ? (Intl as unknown as { DisplayNames: DisplayNamesCtor }).DisplayNames
      : undefined;

  const displayNames: LanguageDisplay | null = DisplayNamesCtor
    ? new DisplayNamesCtor(["en"], { type: "language" })
    : null;

  const getLocaleLabel = (locale: string) => {
    if (displayNames) {
      try {
        return displayNames.of(locale) ?? locale;
      } catch {
        // fallthrough
      }
    }
    if (locale === "en") return "English";
    if (locale === "ja") return "Japanese";
    return locale;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Other languages</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="flex flex-wrap gap-3">
          {otherLocales.map((locale) => {
            const info = data[locale] as LocaleInfo;
            return (
              <li key={locale}>
                <Link
                  href={`/${locale}/articles/${slug}`}
                  aria-label={`${getLocaleLabel(locale)}: ${info.title}`}
                  className="text-sm hover:underline"
                >
                  <span className="font-medium">{getLocaleLabel(locale)}</span>
                  ：{info.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
