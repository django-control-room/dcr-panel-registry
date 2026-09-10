import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, Github, Package } from "lucide-react";

import { getPanel } from "@/data/panels";

export const Route = createFileRoute("/panels/$slug")({
  head: ({ params }) => {
    const name = params.slug;
    return {
      meta: [
        { title: `${name} — Django Control Room Panel Registry` },
        {
          name: "description",
          content: `What ${name} does, how to install it, and where to find its source and documentation.`,
        },
        { property: "og:title", content: `${name} — Panel Registry` },
        {
          property: "og:description",
          content: `What ${name} does, how to install it, and where to find its source and documentation.`,
        },
      ],
    };
  },
  component: PanelDetail,
});

function PanelDetail() {
  const { slug } = Route.useParams();
  const panel = getPanel(slug);

  if (!panel) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">This panel isn&apos;t in the registry</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may have been renamed, or it may be an idea rather than a released panel.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Back to the registry
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All panels
      </Link>

      <header className="mt-8 flex flex-wrap items-start gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Package className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {panel.name}
            </h1>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              {panel.category}
            </span>
          </div>
          <p className="mt-2 text-lg font-medium text-primary">{panel.tagline}</p>
        </div>
      </header>

      <p className="mt-8 text-base leading-relaxed text-muted-foreground">{panel.description}</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Install</p>
        <code className="mt-2 block text-sm">{panel.installCmd}</code>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">What you get</h2>
        <ul className="mt-4 space-y-3">
          {panel.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <dl className="mt-10 grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Maintainer</dt>
          <dd className="mt-1 text-sm">{panel.maintainer}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">First release</dt>
          <dd className="mt-1 text-sm">{panel.firstRelease}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Package</dt>
          <dd className="mt-1 text-sm">{panel.label}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        {panel.github && (
          <a
            href={panel.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Github className="h-4 w-4" />
            Source code
          </a>
        )}
        {panel.docs && (
          <a
            href={panel.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </a>
        )}
      </div>
    </article>
  );
}
