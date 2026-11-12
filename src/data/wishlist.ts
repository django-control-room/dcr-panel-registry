import ideas from "./wishlist.json";

// Wishlist ideas are GitHub issues. scripts/update-wishlist.ts saves them to wishlist.json on a
// schedule, and the site is built from that file.

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

export const wishlist = ideas as WishlistIdea[];
