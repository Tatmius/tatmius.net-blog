import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted mt-8">
      <div className="container mx-auto px-4 py-6 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          <Link href="/feed.xml" className="underline hover:no-underline">
            フィードを購読 (Atom)
          </Link>
          {" · "}
          <Link href="/ja/feed.xml" className="underline hover:no-underline">
            日本語フィード(Atom)
          </Link>
          {" · "}
          <Link href="/en/feed.xml" className="underline hover:no-underline">
            English Feed (Atom)
          </Link>
        </p>
        <p>&copy; 2024 tatmius.net All rights reserved.</p>
      </div>
    </footer>
  );
}
