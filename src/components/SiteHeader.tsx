import { Link, NavLink } from "react-router-dom";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const MAIN_SITE = "https://djangocontrolroom.com/";
const THEME_KEY = "dcr-panel-registry-theme";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // The inline script in index.html applies the saved theme before paint; this mirrors it after hydration.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    try {
      window.localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-foreground font-medium transition-colors"
      : "transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-xs font-bold text-primary-foreground">DCR</span>
          </div>
          <span className="font-heading text-sm font-semibold sm:text-base">Panel Registry</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Registry
          </NavLink>
          <NavLink to="/wishlist" className={navLinkClass}>
            Wishlist
          </NavLink>
          <a
            href={MAIN_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Main site
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
          <a
            href="https://github.com/django-control-room"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <Link
            to="/wishlist"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Suggest a panel
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="p-2 text-muted-foreground md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-border bg-background px-6 py-4 md:hidden">
          <Link
            to="/"
            className="block text-sm text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Registry
          </Link>
          <Link
            to="/wishlist"
            className="block text-sm text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Wishlist
          </Link>
          <a href={MAIN_SITE} className="block text-sm text-muted-foreground">
            Main site
          </a>
          <a href={`${MAIN_SITE}docs/`} className="block text-sm text-muted-foreground">
            Docs
          </a>
          <a
            href="https://github.com/django-control-room"
            className="block text-sm text-muted-foreground"
          >
            GitHub
          </a>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            onClick={toggleTheme}
          >
            {isDark ? <Sun /> : <Moon />}
            {isDark ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      )}
    </header>
  );
}
