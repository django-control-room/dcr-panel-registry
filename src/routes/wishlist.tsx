import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import {
  fetchMyVotes,
  requestsQuery,
  statusLabels,
  submitRequest,
  toggleVote,
} from "@/lib/registry";

const CATEGORIES = [
  "Infrastructure",
  "Performance",
  "Background jobs",
  "Database",
  "Security",
  "Integrations",
  "Developer tooling",
  "other",
];

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Panel wishlist — vote on Django admin panels that don't exist yet" },
      {
        name: "description",
        content:
          "See the Django admin panels the community wants next, upvote the ones you need, and suggest your own idea.",
      },
      { property: "og:title", content: "Panel wishlist — Django Control Room Panel Registry" },
      {
        property: "og:description",
        content:
          "See the Django admin panels the community wants next, upvote the ones you need, and suggest your own idea.",
      },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    rationale: "",
    category: "other",
    author_name: "",
  });

  const requests = useQuery(requestsQuery);
  const myVotes = useQuery({ queryKey: ["my-votes"], queryFn: fetchMyVotes });

  const vote = useMutation({
    mutationFn: ({ id, hasVoted }: { id: string; hasVoted: boolean }) => toggleVote(id, hasVoted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panel_requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-votes"] });
    },
    onError: () => toast.error("Your vote couldn't be saved. Please try again."),
  });

  const create = useMutation({
    mutationFn: submitRequest,
    onSuccess: () => {
      toast.success("Thanks — your panel idea is on the wishlist.");
      setForm({ title: "", summary: "", rationale: "", category: "other", author_name: "" });
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["panel_requests"] });
    },
    onError: () => toast.error("That idea couldn't be saved. Check the fields and try again."),
  });

  const ranked = useMemo(() => {
    const q = query.trim().toLowerCase();
    const votes = requests.data?.votes ?? {};
    return (requests.data?.requests ?? [])
      .filter((r) =>
        q ? [r.title, r.summary, r.rationale ?? "", r.category].join(" ").toLowerCase().includes(q) : true,
      )
      .map((r) => ({ ...r, voteCount: votes[r.id] ?? 0 }))
      .sort((a, b) => b.voteCount - a.voteCount);
  }, [requests.data, query]);

  const votedIds = new Set(myVotes.data ?? []);

  return (
    <div>
      <section className="border-b border-border bg-dot-pattern">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
            The wishlist
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Panels that don&apos;t exist <span className="text-gradient-django">yet</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            These are the panels people keep asking for. Upvote what you&apos;d actually install —
            demand decides what gets built next.
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
            <button
              type="button"
              onClick={() => setFormOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Suggest a panel
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        {formOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.title.trim().length < 3 || form.summary.trim().length < 10) {
                toast.error("Add a name and a slightly longer description.");
                return;
              }
              create.mutate(form);
            }}
            className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h2 className="font-heading text-lg font-semibold">Suggest a panel</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm sm:col-span-1">
                <span className="text-muted-foreground">Panel name</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="dj-something-panel"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm">
                <span className="text-muted-foreground">Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === "other" ? "Other" : c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="text-muted-foreground">What should it do?</span>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  placeholder="Show every scheduled task with its next run time and last failure."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="text-muted-foreground">Why do you need it? (optional)</span>
                <textarea
                  value={form.rationale}
                  onChange={(e) => setForm({ ...form, rationale: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-muted-foreground">Your name (optional)</span>
                <input
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  placeholder="Anonymous"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={create.isPending}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {create.isPending ? "Adding…" : "Add to wishlist"}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {ranked.map((request) => {
            const hasVoted = votedIds.has(request.id);
            return (
              <div
                key={request.id}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <button
                  type="button"
                  aria-label={hasVoted ? `Remove your vote for ${request.title}` : `Vote for ${request.title}`}
                  aria-pressed={hasVoted}
                  onClick={() => vote.mutate({ id: request.id, hasVoted })}
                  className={
                    hasVoted
                      ? "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-primary bg-accent text-accent-foreground"
                      : "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  }
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="mt-0.5 text-sm font-semibold">{request.voteCount}</span>
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-heading text-lg font-semibold">{request.title}</h3>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      {request.category === "other" ? "Other" : request.category}
                    </span>
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      {statusLabels[request.status] ?? request.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {request.summary}
                  </p>
                  {request.rationale && (
                    <p className="mt-2 border-l-2 border-border pl-3 text-sm italic text-muted-foreground">
                      {request.rationale}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Suggested by {request.author_name ?? "Anonymous"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {requests.isLoading && <p className="text-sm text-muted-foreground">Loading ideas…</p>}
        {!requests.isLoading && ranked.length === 0 && (
          <p className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-soft">
            Nothing matches that search yet — be the first to suggest it.
          </p>
        )}
      </section>
    </div>
  );
}
