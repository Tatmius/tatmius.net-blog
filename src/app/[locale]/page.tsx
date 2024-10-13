import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Articles } from "@/type";

export default function Home() {
  const t = useTranslations("home");

  const articlesObj: Articles = t.raw("articles");
  const articles = Object.entries(articlesObj).map(([id, article]) => ({
    id,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    slug: article.slug,
  }));
  console.log("articles:", articles);

  const reversedArticles = [...articles].reverse();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reversedArticles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {article.date}
              </p>
              <p>{article.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/articles/${article.slug}`} passHref>
                <Button>Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
