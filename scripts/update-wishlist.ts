// Saves the wishlist (GitHub issues labelled "wishlist") to src/data/wishlist.json.
// Run by .github/workflows/update-wishlist.yml; a changed file is committed, and that push
// makes Cloudflare rebuild the site. Run locally with: bun scripts/update-wishlist.ts
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { WISHLIST_REPO, type WishlistIdea } from "../src/data/wishlist";

// An idea is an issue labelled "wishlist", opened from .github/ISSUE_TEMPLATE/wishlist.yml.
const WISHLIST_LABEL = "wishlist";

// Headings GitHub writes into the issue body from the form; must match the labels in wishlist.yml.
const SUMMARY_HEADING = "What should the panel do?";
const RATIONALE_HEADING = "Why do you need it?";
const CATEGORY_HEADING = "Category";

interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: "open" | "closed";
  state_reason: string | null;
  user: { login: string } | null;
  labels: { name: string }[];
  reactions: { "+1": number };
  pull_request?: unknown;
}

/** Splits an issue-form body into { heading: answer }, dropping GitHub's "_No response_". */
export function readIssueFormAnswers(body: string) {
  const answers: Record<string, string> = {};
  const sections = body.split(/^### /m).slice(1);
  for (const section of sections) {
    const [heading = "", ...rest] = section.split("\n");
    const answer = rest.join("\n").trim();
    if (answer && answer !== "_No response_") answers[heading.trim()] = answer;
  }
  return answers;
}

function readWishlistStatus(issue: GitHubIssue): WishlistIdea["status"] {
  if (issue.state === "closed") return "shipped";
  const labelNames = issue.labels.map((label) => label.name.toLowerCase());
  if (labelNames.includes("in progress")) return "in_progress";
  if (labelNames.includes("planned")) return "planned";
  return "requested";
}

export function convertIssueToWishlistIdea(issue: GitHubIssue): WishlistIdea {
  const answers = readIssueFormAnswers(issue.body ?? "");
  return {
    number: issue.number,
    title: issue.title.trim(),
    // An issue opened without the form has no headings; its whole body is the summary.
    summary: answers[SUMMARY_HEADING] ?? (issue.body ?? "").trim(),
    rationale: answers[RATIONALE_HEADING] ?? null,
    category: answers[CATEGORY_HEADING] ?? null,
    status: readWishlistStatus(issue),
    author: issue.user?.login ?? "ghost",
    votes: issue.reactions["+1"],
    url: issue.html_url,
  };
}

async function fetchWishlistFromGitHub() {
  // Optional locally; the workflow passes its built-in token to avoid the anonymous rate limit.
  const token = process.env["GITHUB_TOKEN"];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "dcr-panel-registry-build",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const issues: GitHubIssue[] = [];
  let url: string | null =
    `https://api.github.com/repos/${WISHLIST_REPO}/issues?labels=${WISHLIST_LABEL}&state=all&per_page=100`;
  while (url) {
    const response: Response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub answered ${response.status} for ${url}: ${await response.text()}`);
    }
    const page = (await response.json()) as GitHubIssue[];
    issues.push(...page);
    url = response.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  }
  // Closed as "not planned" or "duplicate" means rejected, not shipped.
  const keptIssues = issues.filter(
    (issue) =>
      !issue.pull_request && (issue.state === "open" || issue.state_reason === "completed"),
  );
  return keptIssues
    .map(convertIssueToWishlistIdea)
    .sort((a, b) => b.votes - a.votes || a.number - b.number);
}

const WISHLIST_FILE = new URL("../src/data/wishlist.json", import.meta.url);

// Only runs as a script, so the parser can be imported for checks without fetching.
const runAsScript = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;
if (runAsScript) {
  const wishlist = await fetchWishlistFromGitHub();
  const json = `${JSON.stringify(wishlist, null, 2)}\n`;
  const previous = readFileSync(WISHLIST_FILE, "utf8");
  if (json === previous) {
    console.log(`Wishlist unchanged (${wishlist.length} ideas).`);
  } else {
    writeFileSync(WISHLIST_FILE, json);
    console.log(`Wishlist updated (${wishlist.length} ideas).`);
  }
}
