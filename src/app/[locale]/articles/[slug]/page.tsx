import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MdxWrapper } from "@/components/MdxWrapper";
import { ArticleLayout } from "@/components/articleLayout";
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

async function getArticles(locale: string) {
  return Object.entries(articlesData as ArticlesData)
    .filter(([, article]) => article[locale])
    .map(([id, article]) => ({
      id,
      slug: article.slug,
      title: (article[locale] as { title: string; excerpt: string }).title,
      date: article.date,
      excerpt: (article[locale] as { title: string; excerpt: string }).excerpt,
    }));
}

export async function generateStaticParams() {
  const articles = Object.entries(articlesData as ArticlesData);
  const locales = ["en", "ja"];

  return articles.flatMap(([slug, articleData]) =>
    locales
      .filter((locale) => articleData[locale])
      .map((locale) => ({
        slug,
        locale,
      }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const articles = await getArticles(params.locale);
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    return {
      title: "Article Not Found",
    };
  }
  const record = (articlesData as ArticlesData)[params.slug] as
    | Article
    | undefined;
  const localeKeys = record
    ? Object.keys(record).filter((k) => k !== "slug" && k !== "date")
    : [];
  const languages = Object.fromEntries(
    localeKeys.map((l) => [
      l,
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/${l}/articles/${params.slug}`,
    ])
  );
  return {
    title: article.title,
    description: `Read about ${article.title} on our blog.`,
    alternates: {
      languages,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const articles = await getArticles(params.locale);
  const article = articles.find((a) => a.slug === params.slug);
  const Content = (await import(`../${params.slug}/${params.locale}.mdx`))
    .default;
  if (!article) {
    console.log(`not found: ${params.slug}`);
    notFound();
  }

  return (
    <ArticleLayout
      title={article.title}
      date={article.date}
      locale={params.locale}
      slug={params.slug}
    >
      <MdxWrapper>
        <Content />
      </MdxWrapper>
    </ArticleLayout>
  );
}
