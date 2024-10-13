import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MdxWrapper } from "@/components/MdxWrapper";
import { ArticleLayout } from "@/components/articleLayout";

async function getArticles(locale: string) {
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  return Object.entries(messages.home.articles).map(
    ([id, article]: [string, any]) => ({
      id,
      slug: article.slug,
      title: article.title,
      date: article.date,
      excerpt: article.excerpt,
    })
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
  return {
    title: article.title,
    description: `Read about ${article.title} on our blog.`,
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
    <ArticleLayout title={article.title} date={article.date}>
      <MdxWrapper>
        <Content />
      </MdxWrapper>
    </ArticleLayout>
  );
}
