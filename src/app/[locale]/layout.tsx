import "./globals.css";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
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

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} ${notoSansJP.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Header />

              <div className="flex-grow">{children}</div>

              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
