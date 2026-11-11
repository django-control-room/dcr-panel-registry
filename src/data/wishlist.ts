// Wishlist ideas are GitHub issues, fetched at build time by wishlist-from-github.ts.
// Import the ideas themselves from "virtual:wishlist".

// Issues labelled "wishlist" in this repo, which must be public. A vote is a 👍 on the issue.
export const WISHLIST_REPO = "django-control-room/dcr-panel-registry";
export const SUGGEST_IDEA_URL = `https://github.com/${WISHLIST_REPO}/issues/new?template=wishlist.yml`;

export interface WishlistIdea {
  number: number;
  title: string;
  summary: string;
  rationale: string | null;
  category: string | null;
  status: "requested" | "planned" | "in_progress" | "shipped";
  author: string;
  votes: number;
  url: string;
}

export const statusLabels: Record<WishlistIdea["status"], string> = {
  requested: "Requested",
  planned: "Planned",
  in_progress: "In progress",
  shipped: "Shipped",
};
