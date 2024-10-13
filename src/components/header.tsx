import { Link } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/languageToggle";

export function Header() {
  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline text-foreground">
              HOME
            </Link>
          </li>
          <li className="hidden">
            <Link href="/about" className="hover:underline text-foreground">
              ABOUT
            </Link>
          </li>
          <li className="hidden">
            <Link href="/contact" className="hover:underline text-foreground">
              CONTACT
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
