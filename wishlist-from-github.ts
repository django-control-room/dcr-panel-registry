import type { Plugin } from "vite";

import { WISHLIST_REPO, type WishlistIdea } from "./src/data/wishlist";

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

async function fetchWishlistIssuesFromGitHub() {
  // Optional, but Cloudflare's shared build machines can hit GitHub's anonymous rate limit.
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
  return keptIssues.map(convertIssueToWishlistIdea).sort((a, b) => b.votes - a.votes);
}

const VIRTUAL_ID = "virtual:wishlist";

/** Provides `import wishlist from "virtual:wishlist"`, fetched from GitHub once per build. */
export function wishlistFromGitHub(): Plugin {
  let isBuild = false;
  let wishlist: Promise<WishlistIdea[]> | null = null;
  return {
    name: "wishlist-from-github",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? `\0${VIRTUAL_ID}` : null;
    },
    async load(id) {
      if (id !== `\0${VIRTUAL_ID}`) return null;
      wishlist ??= fetchWishlistIssuesFromGitHub().catch((error: unknown) => {
        // A failed build keeps the previous deploy live; publishing an empty wishlist would not.
        if (isBuild) throw error;
        console.warn(`[wishlist] could not load ideas from GitHub, showing none:\n${error}`);
        return [];
      });
      return `export default ${JSON.stringify(await wishlist)};`;
    },
  };
}
