import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import type { Panel } from "@/data/panels";

export default function PanelCard({
  panel,
  heading: Heading = "h2",
}: {
  panel: Panel;
  heading?: "h2" | "h3";
}) {
  return (
    <Link
      to={`/${panel.name}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <Heading className="min-w-0 break-words font-heading text-lg font-semibold">
          {panel.name}
        </Heading>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <p className="mt-1 text-sm font-medium text-primary">{panel.tagline}</p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {panel.description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
        {panel.categories.map((item) => (
          <span
            key={item}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
