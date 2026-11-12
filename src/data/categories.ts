// Shared by panels and wishlist ideas; matched ignoring case.
export const CATEGORIES = [
  "Background jobs",
  "Database",
  "Developer tooling",
  "Infrastructure",
  "Integrations",
  "Observability",
  "Performance",
  "Security",
  "Games",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function findKnownCategory(name: string): Category | undefined {
  return CATEGORIES.find((category) => category.toLowerCase() === name.trim().toLowerCase());
}
