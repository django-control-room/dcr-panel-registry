export const ALL_CATEGORIES = "All";

const chipClass = (selected: boolean) =>
  selected
    ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground"
    : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground";

/** Category chips with counts; swipes sideways on phones and wraps from md up. */
export default function CategoryFilter({
  counts,
  total,
  selected,
  onSelect,
}: {
  counts: Map<string, number>;
  total: number;
  selected: string;
  onSelect: (category: string) => void;
}) {
  const categories = [...counts.keys()].sort();
  return (
    <div
      className="-mx-6 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter by category"
    >
      {[ALL_CATEGORIES, ...categories].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          aria-pressed={item === selected}
          className={chipClass(item === selected)}
        >
          {item}
          <span className="text-xs tabular-nums opacity-70">
            {item === ALL_CATEGORIES ? total : counts.get(item)}
          </span>
        </button>
      ))}
    </div>
  );
}
