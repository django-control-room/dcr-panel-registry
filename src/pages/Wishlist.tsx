import { useMemo, useState } from "react";
import { ArrowUpRight, Plus, Search, ThumbsUp } from "lucide-react";
import wishlist from "virtual:wishlist";

import Seo from "@/components/Seo";
import { statusLabels, SUGGEST_IDEA_URL } from "@/data/wishlist";

export default function Wishlist() {
  const [query, setQuery] = useState("");

  // Already sorted by votes at build time.
  const matchingIdeas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wishlist;
    return wishlist.filter((idea) =>
      [idea.title, idea.summary, idea.rationale ?? "", idea.category ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <div>
      <Seo
        title="Panel wishlist — vote on Django admin panels that don't exist yet"
        description="See the Django admin panels the community wants next, upvote the ones you need, and suggest your own idea."
      />
      <section className="border-b border-border bg-dot-pattern">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            The wishlist
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Panels that don&apos;t exist <span className="text-gradient-django">yet</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            These are the panels people keep asking for. Give a 👍 on GitHub to the ones you&apos;d
            actually install: demand decides what gets built next.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ideas"
                aria-label="Search panel ideas"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <a
              href={SUGGEST_IDEA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Suggest a panel
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="space-y-4">
          {matchingIdeas.map((idea) => (
            <div
              key={idea.number}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <a
                href={idea.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${idea.votes} votes. Vote for ${idea.title} with a 👍 on GitHub`}
                title="Vote with a 👍 on GitHub"
                className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="mt-0.5 text-sm font-semibold tabular-nums">{idea.votes}</span>
              </a>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="break-words font-heading text-lg font-semibold">{idea.title}</h2>
                  {idea.category && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      {idea.category}
                    </span>
                  )}
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {statusLabels[idea.status]}
                  </span>
                </div>
                {/* shortcut: issue text shown as plain text, markdown not rendered; add a renderer if ideas get long. */}
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {idea.summary}
                </p>
                {idea.rationale && (
                  <p className="mt-2 whitespace-pre-line border-l-2 border-border pl-3 text-sm italic text-muted-foreground">
                    {idea.rationale}
                  </p>
                )}
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>Suggested by @{idea.author}</span>
                  <a
                    href={idea.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                  >
                    Discuss on GitHub #{idea.number}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {matchingIdeas.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
            {wishlist.length === 0
              ? "No ideas yet. Suggest the first one."
              : "Nothing matches that search yet. Be the first to suggest it."}
          </p>
        )}
      </section>
    </div>
  );
}
