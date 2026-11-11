import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, GitPullRequest, Lightbulb, Search, X } from "lucide-react";

import PanelCard from "@/components/PanelCard";
import Seo from "@/components/Seo";
import { panels, type Category } from "@/data/panels";
import wishlist from "virtual:wishlist";

const ALL = "All";
const CONTRIBUTING_URL =
  "https://github.com/django-control-room/dcr-panel-registry/blob/main/CONTRIBUTING.md";

function countPanelsPerCategory() {
  const counts = new Map<string, number>();
  for (const panel of panels) {
    for (const category of panel.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return counts;
}

/** Press "/" anywhere outside a text field to jump to the search box. */
function useSlashToFocus(input: React.RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const focusOnSlash = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing =
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, [input]);
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const searchInput = useRef<HTMLInputElement>(null);
  useSlashToFocus(searchInput);

  const categoryCounts = useMemo(countPanelsPerCategory, []);
  const categories = useMemo(() => [...categoryCounts.keys()].sort(), [categoryCounts]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return panels.filter((p) => {
      const matchesCategory = category === ALL || p.categories.includes(category as Category);
      if (!matchesCategory) return false;
      if (!q) return true;
      return [p.name, p.label, p.tagline, p.description, ...p.categories, ...p.highlights]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  const isFiltered = query.trim() !== "" || category !== ALL;
  const clearFilters = () => {
    setQuery("");
    setCategory(ALL);
  };

  const chipClass = (selected: boolean) =>
    selected
      ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground"
      : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground";

  return (
    <div>
      <Seo
        title="Django Control Room Panel Registry — find and request admin panels"
        description="Search every Django Control Room panel, read what each one does, and see the panels the community still wants built."
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-dot-pattern opacity-60" aria-hidden="true" />
        <div
          className="absolute -top-48 left-1/2 h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-accent opacity-60 blur-[100px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-14 text-center md:pb-16 md:pt-20">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            {panels.length} panels and counting
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">
            Every panel for your <span className="text-gradient-django">Django admin</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Find tools that drop straight into Django Control Room: what each one does, how to
            install it, and how widely it&apos;s used.
          </p>

          <label className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left shadow-soft transition-colors focus-within:border-primary">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search panels</span>
            <input
              ref={searchInput}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search panels: redis, queues, cache…"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:block">
                /
              </kbd>
            )}
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div
          className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setCategory(ALL)}
            aria-pressed={category === ALL}
            className={chipClass(category === ALL)}
          >
            All
            <span className="text-xs tabular-nums opacity-70">{panels.length}</span>
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={item === category}
              className={chipClass(item === category)}
            >
              {item}
              <span className="text-xs tabular-nums opacity-70">{categoryCounts.get(item)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <p aria-live="polite">
            {isFiltered
              ? `${results.length} of ${panels.length} panels`
              : `Showing all ${panels.length} panels`}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((panel) => (
              <PanelCard key={panel.name} panel={panel} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="font-heading text-lg font-semibold">No panel matches that search</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Maybe it doesn&apos;t exist yet. Check the wishlist, or suggest it: the most requested
              ideas get built first.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Clear filters
              </button>
              <Link
                to="/wishlist"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Go to the wishlist
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-14 md:grid-cols-2">
          <a
            href={CONTRIBUTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-hover"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
              <GitPullRequest className="h-5 w-5 text-primary" />
            </span>
            <span>
              <span className="flex items-center gap-1.5 font-heading text-lg font-semibold">
                Built a panel? List it here
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Open a pull request that adds one markdown file describing your panel. A check tells
                you if anything needs fixing.
              </span>
            </span>
          </a>
          <Link
            to="/wishlist"
            className="group flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-hover"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Lightbulb className="h-5 w-5 text-primary" />
            </span>
            <span>
              <span className="flex items-center gap-1.5 font-heading text-lg font-semibold">
                {wishlist.length === 0
                  ? "Panels people want"
                  : `${wishlist.length} ${wishlist.length === 1 ? "panel" : "panels"} people want`}
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Vote for the panels you&apos;d install, or suggest one that doesn&apos;t exist yet.
              </span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
