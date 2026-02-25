import "./globals.css";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata = {
  title: "tatmius's blog",
  description: "A blog about what I'm interested in",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Get the latest one from: https://katex.org/docs/browser */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        />
        {/* Atom feed auto-discovery (browser RSS icon + feed readers) */}
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/feed.xml`}
          title="tatmius.net Blog (all)"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/ja/feed.xml`}
          title="tatmius.net ブログ (日本語)"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.tatmius.net"}/en/feed.xml`}
          title="tatmius.net Blog (English)"
        />
      </head>
      <body className={`${inter.className} ${notoSansJP.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-grow">{children}</div>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
