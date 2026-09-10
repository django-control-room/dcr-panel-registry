import { Link } from "@tanstack/react-router";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

const MAIN_SITE = "https://djangocontrolroom.com/";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

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
          <Link to="/" activeOptions={{ exact: true }} className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            Registry
          </Link>
          <Link to="/wishlist" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            Wishlist
          </Link>
          <a href={MAIN_SITE} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            Main site
          </a>
          <a href={`${MAIN_SITE}docs/`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
            Docs
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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
          <Link to="/" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>
            Registry
          </Link>
          <Link to="/wishlist" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>
            Wishlist
          </Link>
          <a href={MAIN_SITE} className="block text-sm text-muted-foreground">
            Main site
          </a>
          <a href={`${MAIN_SITE}docs/`} className="block text-sm text-muted-foreground">
            Docs
          </a>
          <a href="https://github.com/django-control-room" className="block text-sm text-muted-foreground">
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
