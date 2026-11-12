import { useState, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import CopyButton from "@/components/CopyButton";
import PanelCard from "@/components/PanelCard";
import Seo from "@/components/Seo";
import { getPanel, panels, type Panel } from "@/data/panels";
import { statsPageUrl, useDownloadStats, type DailyDownloads } from "@/lib/stats";

// Fixed locale and time zone so the prerendered HTML matches what the browser renders.
function formatDate(isoDate: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...options,
  });
}

function readHostName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Panels sharing a category come first, then the rest, so every page links onward. */
function pickRelatedPanels(panel: Panel, count: number) {
  const otherPanels = panels.filter((other) => other.name !== panel.name);
  const sharesCategory = (other: Panel) =>
    other.categories.some((category) => panel.categories.includes(category));
  const sameCategory = otherPanels.filter(sharesCategory);
  const differentCategory = otherPanels.filter((other) => !sharesCategory(other));
  return [...sameCategory, ...differentCategory].slice(0, count);
}

const SPARKLINE_WIDTH = 280;
const SPARKLINE_HEIGHT = 64;

function DownloadsSparkline({ daily }: { daily: DailyDownloads[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (daily.length < 2) return null;

  const counts = daily.map((day) => day.downloads);
  const highest = Math.max(...counts, 1);
  const pointX = (index: number) => (index / (daily.length - 1)) * SPARKLINE_WIDTH;
  // Leave 4px at the top so the line's peak isn't clipped.
  const pointY = (count: number) => SPARKLINE_HEIGHT - (count / highest) * (SPARKLINE_HEIGHT - 4);
  const linePoints = counts.map((count, index) => `${pointX(index)},${pointY(count)}`).join(" ");
  const areaPoints = `0,${SPARKLINE_HEIGHT} ${linePoints} ${SPARKLINE_WIDTH},${SPARKLINE_HEIGHT}`;

  const hoveredDay = hoveredIndex === null ? null : daily[hoveredIndex];
  const firstDay = daily[0]!;
  const lastDay = daily[daily.length - 1]!;

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    setHoveredIndex(Math.round(fraction * (daily.length - 1)));
  };

  return (
    <div className="mt-5">
      <div
        className="relative h-16 cursor-crosshair touch-none"
        onPointerMove={trackPointer}
        onPointerDown={trackPointer}
        onPointerLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label={`Daily downloads from ${formatDate(firstDay.date, { month: "short", day: "numeric" })} to ${formatDate(lastDay.date, { month: "short", day: "numeric" })}, peaking at ${highest.toLocaleString("en-US")} in a day.`}
        >
          <polygon points={areaPoints} className="fill-primary/10" />
          <polyline
            points={linePoints}
            fill="none"
            className="stroke-primary"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {hoveredIndex !== null && hoveredDay && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-border"
              style={{ left: `${(hoveredIndex / (daily.length - 1)) * 100}%` }}
            />
            <div
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
              style={{
                left: `${(hoveredIndex / (daily.length - 1)) * 100}%`,
                top: `${(pointY(hoveredDay.downloads) / SPARKLINE_HEIGHT) * 100}%`,
              }}
            />
          </>
        )}
      </div>
      <div className="mt-2 flex h-4 items-center justify-between text-xs text-muted-foreground">
        {hoveredDay ? (
          <span className="w-full text-center text-foreground" aria-live="polite">
            {formatDate(hoveredDay.date, { month: "short", day: "numeric" })} ·{" "}
            <span className="tabular-nums">{hoveredDay.downloads.toLocaleString("en-US")}</span>{" "}
            downloads
          </span>
        ) : (
          <>
            <span>{formatDate(firstDay.date, { month: "short", day: "numeric" })}</span>
            <span>{formatDate(lastDay.date, { month: "short", day: "numeric" })}</span>
          </>
        )}
      </div>
    </div>
  );
}

function DownloadsCard({ name }: { name: string }) {
  const stats = useDownloadStats(name);

  // Not tracked on the stats site: nothing useful to show a visitor.
  if (stats === null) return null;

  if (stats === undefined) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft" aria-busy="true">
        <div className="h-3 w-32 animate-pulse rounded bg-secondary" />
        <div className="mt-4 h-9 w-28 animate-pulse rounded bg-secondary" />
        <div className="mt-5 h-16 animate-pulse rounded bg-secondary" />
        <div className="mt-6 h-3 w-40 animate-pulse rounded bg-secondary" />
      </div>
    );
  }

  const change = stats.previous30Days
    ? Math.round(((stats.last30Days - stats.previous30Days) / stats.previous30Days) * 100)
    : null;
  const TrendIcon = change !== null && change < 0 ? TrendingDown : TrendingUp;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Downloads · last 30 days
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-heading text-4xl font-bold tabular-nums tracking-tight">
          {stats.last30Days.toLocaleString("en-US")}
        </p>
        {change !== null && (
          <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <TrendIcon className="h-4 w-4" aria-hidden="true" />
            {change >= 0 ? "+" : ""}
            {change}% vs prior 30 days
          </p>
        )}
      </div>

      <DownloadsSparkline daily={stats.daily} />

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">
            {stats.allTime.toLocaleString("en-US")}
          </span>{" "}
          since tracking began
        </span>
      </div>
    </div>
  );
}

function DetailsCard({ panel }: { panel: Panel }) {
  const pypiUrl = `https://pypi.org/project/${panel.name}/`;
  const rows = [
    { term: "Maintainer", value: panel.maintainer },
    {
      term: "First release",
      value: formatDate(panel.firstRelease, { month: "long", day: "numeric", year: "numeric" }),
    },
    { term: "PyPI", value: panel.name, href: pypiUrl },
    { term: "Source", value: readHostName(panel.repository), href: panel.repository },
    ...(panel.docs ? [{ term: "Docs", value: readHostName(panel.docs), href: panel.docs }] : []),
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Details</p>
      <dl className="mt-3 divide-y divide-border text-sm">
        {rows.map((row) => (
          <div key={row.term} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">{row.term}</dt>
            <dd className="min-w-0 truncate text-right font-medium">
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary"
                >
                  <span className="truncate">{row.value}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PanelNotFound() {
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

export default function PanelDetail() {
  const { name } = useParams<{ name: string }>();
  const panel = name ? getPanel(name) : undefined;

  if (!panel) return <PanelNotFound />;

  const installCommand = `pip install ${panel.name}`;
  // shortcut: blank-line paragraphs only, no markdown rendering; add a markdown renderer if authors need links or lists
  const descriptionParagraphs = panel.description.split(/\n\s*\n/);
  const relatedPanels = pickRelatedPanels(panel, 3);

  return (
    <article>
      <Seo
        title={`${panel.name} — Django Control Room Panel Registry`}
        description={`${panel.tagline}. ${panel.label} panel for Django Control Room: what it does, how to install it, and where to find its source.`}
        image={panel.screenshot?.url}
      />

      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-dot-pattern opacity-60" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent opacity-60 blur-[100px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-10 md:pb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All panels
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-soft ring-1 ring-border">
              <Package className="h-6 w-6 text-primary" />
            </div>
            {panel.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className="mt-6 break-words font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {panel.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">{panel.tagline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card py-2 pl-4 pr-2 shadow-soft sm:min-w-80">
              <span className="select-none font-mono text-sm text-primary" aria-hidden="true">
                $
              </span>
              <code className="min-w-0 flex-1 truncate font-mono text-sm">{installCommand}</code>
              <CopyButton text={installCommand} label="Copy install command" />
            </div>
            <a
              href={panel.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
            >
              <Code2 className="h-4 w-4" />
              Source code
            </a>
            {panel.docs && (
              <a
                href={panel.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <div className="min-w-0">
          {panel.screenshot && (
            <a
              href={panel.screenshot.url}
              className="mb-12 block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-hover"
            >
              <div
                className="flex items-center gap-1.5 border-b border-border bg-secondary/60 px-4 py-2.5"
                aria-hidden="true"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              </div>
              <img
                src={panel.screenshot.url}
                alt={panel.screenshot.alt}
                decoding="async"
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </a>
          )}
          <section>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">About</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/80 md:text-lg">
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">What you get</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {panel.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <DownloadsCard name={panel.name} />
          <DetailsCard panel={panel} />
        </aside>
      </div>

      {relatedPanels.length > 0 && (
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">More panels</h2>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Browse the registry
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedPanels.map((related) => (
                <PanelCard key={related.name} panel={related} heading="h3" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
