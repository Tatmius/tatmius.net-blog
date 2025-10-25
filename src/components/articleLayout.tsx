import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArticleActions } from "@/components/articleActions";
import { ArticleTranslationsCard } from "@/components/articleTranslationsCard";
interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
  locale: string;
  slug: string;
}

export function ArticleLayout({
  children,
  title,
  date,
  locale,
  slug,
}: ArticleLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link href={`/${locale}`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 text-primary">{title}</h1>
      <time
        dateTime={date}
        className="text-sm text-muted-foreground mb-6 block"
      >
        {date}
      </time>
      <ArticleTranslationsCard slug={slug} currentLocale={locale} />
      <div>{children}</div>
      <ArticleActions />
    </article>
  );
}
