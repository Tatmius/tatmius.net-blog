import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Select language",
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return (
    <main className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl mb-6">言語を選択 / Select your language</h1>
      <div className="flex gap-4 justify-center">
        <Link href="/ja">
          <Button>日本語</Button>
        </Link>
        <Link href="/en">
          <Button>English</Button>
        </Link>
      </div>
    </main>
  );
}
