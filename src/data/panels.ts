import { parse as parseYaml } from "yaml";
import { z } from "zod";

// Every panel in the registry is one markdown file in /panels, named after its PyPI package.
// The frontmatter holds the structured fields below; the body is the panel's description.
// See CONTRIBUTING.md for the format panel authors follow.

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

// Panels hidden from the site without deleting their file: no listing, no page, and the file
// isn't validated. Add the package name (the file name without .md) to hide one; remove it to
// bring the panel back.
export const HIDDEN_PANELS: string[] = [];

const frontmatterSchema = z
  .object({
    label: z.string().min(1).max(30),
    tagline: z.string().min(1).max(80),
    categories: z.array(z.string().min(1)).min(1),
    repository: z.string().url(),
    docs: z.string().url().optional(),
    maintainer: z.string().min(1),
    first_release: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date written as YYYY-MM-DD"),
    highlights: z.array(z.string().min(1)).min(1).max(6),
  })
  .strict();

export type Category = (typeof CATEGORIES)[number];

// Matched ignoring case and written back in the canonical spelling. Unknown names are dropped,
// not rejected, so a new category in a pull request doesn't fail the build.
function keepKnownCategories(names: string[]): Category[] {
  const known: Category[] = [];
  for (const name of names) {
    const match = CATEGORIES.find(
      (category) => category.toLowerCase() === name.trim().toLowerCase(),
    );
    if (match && !known.includes(match)) known.push(match);
  }
  return known;
}

export interface Panel {
  /** The PyPI package name, taken from the file name. Also the URL slug. */
  name: string;
  label: string;
  tagline: string;
  description: string;
  /** Known categories only; a panel with none appears only under "All". */
  categories: Category[];
  repository: string;
  docs: string | null;
  highlights: string[];
  maintainer: string;
  firstRelease: string;
}

// PyPI normalized names: lowercase letters, digits and single hyphens.
const PACKAGE_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function parsePanelFile(fileName: string, raw: string): Panel {
  const name = fileName.replace(/\.md$/, "");
  const fail = (message: string) => {
    throw new Error(`panels/${fileName}: ${message}`);
  };

  if (!PACKAGE_NAME.test(name)) {
    fail("the file name must be the PyPI package name in lowercase, e.g. dj-redis-panel.md");
  }
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) fail("the file must start with a frontmatter block between two --- lines");
  const [, frontmatter = "", body = ""] = match!;

  const result = frontmatterSchema.safeParse(parseYaml(frontmatter));
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
    );
    fail(`invalid frontmatter\n${problems.join("\n")}`);
  }
  const description = body.trim();
  if (!description) fail("add a description of the panel below the frontmatter");

  const data = result.data!;
  return {
    name,
    label: data.label,
    tagline: data.tagline,
    description,
    categories: keepKnownCategories(data.categories),
    repository: data.repository,
    docs: data.docs ?? null,
    highlights: data.highlights,
    maintainer: data.maintainer,
    firstRelease: data.first_release,
  };
}

const panelFiles = import.meta.glob<string>("/panels/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parsePanelFileOrSkipInDev(path: string, raw: string): Panel[] {
  try {
    return [parsePanelFile(path.split("/").pop()!, raw)];
  } catch (error) {
    // The build fails on an invalid file so a broken pull request can't ship;
    // the dev server skips it instead so one bad file doesn't blank the whole site.
    if (!import.meta.env.DEV) throw error;
    console.error(error);
    return [];
  }
}

const panelFileEntries = Object.entries(panelFiles);

const visiblePanelFileEntries = panelFileEntries.filter(
  ([path]) => !HIDDEN_PANELS.includes(path.split("/").pop()!.replace(/\.md$/, "")),
);

export const panels: Panel[] = visiblePanelFileEntries
  .flatMap(([path, raw]) => parsePanelFileOrSkipInDev(path, raw))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getPanel(name: string) {
  return panels.find((panel) => panel.name === name);
}
