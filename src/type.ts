export interface Article {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

export interface Articles {
  [key: string]: Article;
}
