import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, BookOpen, Check, Code2, Package } from "lucide-react";

import Seo from "@/components/Seo";
import { getPanel } from "@/data/panels";
import { useDownloadStats, statsPageUrl } from "@/lib/stats";

function DownloadStatsCard({ name }: { name: string }) {
  const stats = useDownloadStats(name);
  if (!stats) return null;
  const change = stats.previous30Days
    ? Math.round(((stats.last30Days - stats.previous30Days) / stats.previous30Days) * 100)
    : null;
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Downloads
        </p>
        <a
          href={statsPageUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Full stats
        </a>
      </div>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Last 30 days</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.last30Days.toLocaleString()}
            {change !== null && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {change >= 0 ? "+" : ""}
                {change}% vs prior 30
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Since tracking began</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.allTime.toLocaleString()}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">PyPI data as of {stats.asOf}</p>
    </div>
  );
}

export default function PanelDetail() {
  const { name } = useParams<{ name: string }>();
  const panel = name ? getPanel(name) : undefined;

  if (!panel) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <Seo title="Panel not found — Django Control Room Panel Registry" />
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

  const descriptionParagraphs = panel.description.split(/\n\s*\n/);

  return (
    <article className="mx-auto max-w-4xl px-6 py-14">
      <Seo
        title={`${panel.name} — Django Control Room Panel Registry`}
        description={`${panel.tagline}. ${panel.label} panel for Django Control Room: what it does, how to install it, and where to find its source.`}
      />
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
            {panel.categories.map((item) => (
              <span
                key={item}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-2 text-lg font-medium text-primary">{panel.tagline}</p>
        </div>
      </header>

      {/* shortcut: blank-line paragraphs only, no markdown rendering; add a markdown renderer if authors need links or lists */}
      <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
        {descriptionParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Install</p>
        <code className="mt-2 block text-sm">pip install {panel.name}</code>
      </div>

      <DownloadStatsCard name={panel.name} />

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
        {panel.repository && (
          <a
            href={panel.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Code2 className="h-4 w-4" />
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
