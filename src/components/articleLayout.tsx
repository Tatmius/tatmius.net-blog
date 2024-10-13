import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
}

export function ArticleLayout({ children, title, date }: ArticleLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        {title}
      </h1>
      <time
        dateTime={date}
        className="text-sm text-muted-foreground mb-6 block"
      >
        {date}
      </time>
      <div>{children}</div>
    </article>
  );
}
