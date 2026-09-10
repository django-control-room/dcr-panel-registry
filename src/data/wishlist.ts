export interface WishlistIdea {
  id: string;
  title: string;
  summary: string;
  rationale: string | null;
  category: string;
  status: string;
  author: string;
  votes: number;
}

export const wishlist: WishlistIdea[] = [
  {
    id: "dj-migrations-panel",
    title: "dj-migrations-panel",
    summary:
      "See migration state per app and per environment, with a safe plan preview before applying anything.",
    rationale:
      "Deploys go wrong when nobody knows which migrations already ran on staging versus production.",
    category: "Database",
    status: "planned",
    author: "Priya R.",
    votes: 28,
  },
  {
    id: "dj-queries-panel",
    title: "dj-queries-panel",
    summary: "Slow-query log with ORM call sites, N+1 detection, and per-view query budgets.",
    rationale: "Django Debug Toolbar only helps locally, never in production.",
    category: "Performance",
    status: "requested",
    author: "Marion K.",
    votes: 21,
  },
  {
    id: "dj-permissions-panel",
    title: "dj-permissions-panel",
    summary:
      "A matrix view of groups, permissions, and object-level rules so you can audit who can do what.",
    rationale: "Permission audits are done by hand today and are easy to get wrong.",
    category: "Security",
    status: "in_progress",
    author: "Anonymous",
    votes: 17,
  },
  {
    id: "dj-mail-panel",
    title: "dj-mail-panel",
    summary:
      "Inspect outgoing email: rendered previews, delivery attempts, bounces, and a replay button.",
    rationale: "Debugging transactional email currently means digging through provider dashboards.",
    category: "Integrations",
    status: "requested",
    author: "Tomas L.",
    votes: 12,
  },
  {
    id: "dj-storage-panel",
    title: "dj-storage-panel",
    summary:
      "Browse configured storage backends, list buckets and files, and spot orphaned uploads.",
    rationale: "Media files drift from database records and nobody notices for months.",
    category: "Infrastructure",
    status: "requested",
    author: "Anonymous",
    votes: 6,
  },
];

export const statusLabels: Record<string, string> = {
  requested: "Requested",
  planned: "Planned",
  in_progress: "In progress",
  shipped: "Shipped",
};

export const wishlistCategories = [
  "Infrastructure",
  "Performance",
  "Background jobs",
  "Database",
  "Security",
  "Integrations",
  "Developer tooling",
  "other",
];

const VOTES_KEY = "dcr-registry-votes";
const IDEAS_KEY = "dcr-registry-ideas";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadVotedIds(): string[] {
  return read<string[]>(VOTES_KEY, []);
}

export function saveVotedIds(ids: string[]) {
  write(VOTES_KEY, ids);
}

export function loadLocalIdeas(): WishlistIdea[] {
  return read<WishlistIdea[]>(IDEAS_KEY, []);
}

export function saveLocalIdeas(ideas: WishlistIdea[]) {
  write(IDEAS_KEY, ideas);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
