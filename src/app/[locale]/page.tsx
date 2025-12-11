import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import articlesData from "@/data/articles.json";

interface Article {
  slug: string;
  date: string;
  [locale: string]:
    | {
        title: string;
        excerpt: string;
      }
    | string;
}

interface ArticlesData {
  [key: string]: Article;
}

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const articles = Object.entries(articlesData as ArticlesData)
    .filter(([, article]) => article[locale])
    .map(([id, article]) => ({
      id,
      title: (article[locale] as { title: string; excerpt: string }).title,
      excerpt: (article[locale] as { title: string; excerpt: string }).excerpt,
      date: article.date,
      slug: article.slug,
    }));

  const reversedArticles = [...articles].reverse();

  const titles = {
    en: "Blog Articles",
    ja: "ブログ記事",
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {titles[locale as keyof typeof titles]}
      </h1>
      <div className="grid gap-6 max-w-2xl mx-auto">
        {reversedArticles.map((article) => (
          <Link key={article.id} href={`/${locale}/articles/${article.slug}`}>
            <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.005] duration-70">
              <CardHeader className="pb-2">
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.date}</p>
                <p>{article.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
