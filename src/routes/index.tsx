import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Lightbulb, Package, Search } from "lucide-react";

import { panels } from "@/data/panels";
import { wishlist } from "@/data/wishlist";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Django Control Room Panel Registry — find and request admin panels" },
      {
        name: "description",
        content:
          "Search every Django Control Room panel, read what each one does, and see the panels the community still wants built.",
      },
      { property: "og:title", content: "Django Control Room Panel Registry" },
      {
        property: "og:description",
        content:
          "Search every Django Control Room panel, read what each one does, and see the panels the community still wants built.",
      },
    ],
  }),
  component: RegistryIndex,
});

function RegistryIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(panels.map((p) => p.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return panels.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [p.name, p.label, p.tagline, p.description, p.category, ...p.highlights]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  return (
    <div>
      <section className="border-b border-border bg-dot-pattern">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            The registry
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Every panel for your <span className="text-gradient-django">Django admin</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Browse the panels that already exist, see exactly what each one gives you, and add your
            voice to the ones that don&apos;t exist yet.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search panels — redis, queues, cache, urls…"
              aria-label="Search panels"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={
                  item === category
                    ? "rounded-full border border-primary bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground"
                    : "rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">Available panels</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length} of {panels.length} panels
            </p>
          </div>
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Lightbulb className="h-4 w-4 text-primary" />
            {wishlist.length} panels people want
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((panel) => (
            <Link
              key={panel.slug}
              to="/panels/$slug"
              params={{ slug: panel.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-hover"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  {panel.category}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold">{panel.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{panel.tagline}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {panel.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <code className="text-xs text-muted-foreground">{panel.installCmd}</code>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
            <h3 className="font-heading text-lg font-semibold">No panel matches that search</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Maybe it doesn&apos;t exist yet. Check the wishlist, or suggest it — the most requested
              ideas get built first.
            </p>
            <Link
              to="/wishlist"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to the wishlist
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
