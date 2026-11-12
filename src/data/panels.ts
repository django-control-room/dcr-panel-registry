import { parse as parseYaml } from "yaml";
import { z } from "zod";

import { findKnownCategory, type Category } from "./categories";

// Every panel in the registry is one markdown file in /panels, named after its PyPI package.
// The frontmatter holds the structured fields below; the body is the panel's description.
// See CONTRIBUTING.md for the format panel authors follow.

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
    screenshot: z
      .object({ file: z.string().min(1), alt: z.string().min(1).max(200) })
      .strict()
      .optional(),
  })
  .strict();

// Matched ignoring case and written back in the canonical spelling. Unknown names are dropped,
// not rejected, so a new category in a pull request doesn't fail the build.
function keepKnownCategories(names: string[]): Category[] {
  const known: Category[] = [];
  for (const name of names) {
    const match = findKnownCategory(name);
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
  /** From panels/screenshots/; url is the built, base-aware address. */
  screenshot: { url: string; alt: string } | null;
}

// Screenshots live in panels/screenshots/, named after the package. Vite gives each a hashed URL.
// Size and file type are checked when building, in vite.config.ts.
const screenshotFiles = import.meta.glob<string>("/panels/screenshots/*.{png,jpg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});
const SCREENSHOT_EXTENSIONS = ["png", "jpg", "webp"];

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

  let yaml: unknown;
  try {
    yaml = parseYaml(frontmatter);
  } catch (error) {
    // Usually an unquoted value containing ": ". Quote the value to fix it.
    fail(`the frontmatter isn't valid YAML: ${(error as Error).message}`);
  }
  const result = frontmatterSchema.safeParse(yaml);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
    );
    fail(`invalid frontmatter\n${problems.join("\n")}`);
  }
  const description = body.trim();
  if (!description) fail("add a description of the panel below the frontmatter");

  const data = result.data!;
  let screenshot: Panel["screenshot"] = null;
  if (data.screenshot) {
    const { file, alt } = data.screenshot;
    const allowedNames = SCREENSHOT_EXTENSIONS.map((extension) => `${name}.${extension}`);
    if (!allowedNames.includes(file)) {
      fail(`screenshot.file must be named after the package: ${allowedNames.join(", ")}`);
    }
    const url = screenshotFiles[`/panels/screenshots/${file}`];
    if (!url) fail(`screenshot.file: panels/screenshots/${file} doesn't exist`);
    screenshot = { url: url!, alt };
  }

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
    screenshot,
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

// A screenshot no panel uses was misnamed, or left behind. Hidden panels keep theirs.
const usedScreenshotUrls = panels.flatMap((panel) =>
  panel.screenshot ? [panel.screenshot.url] : [],
);
const screenshotEntries = Object.entries(screenshotFiles);
const unusedScreenshots = screenshotEntries
  .filter(([path, url]) => {
    const panelName = path
      .split("/")
      .pop()!
      .replace(/\.\w+$/, "");
    return !usedScreenshotUrls.includes(url) && !HIDDEN_PANELS.includes(panelName);
  })
  .map(([path]) => path.slice(1));
if (unusedScreenshots.length > 0) {
  const message = `screenshots no panel uses (set screenshot.file, or delete them): ${unusedScreenshots.join(", ")}`;
  if (!import.meta.env.DEV) throw new Error(message);
  console.error(message);
}

export function getPanel(name: string) {
  return panels.find((panel) => panel.name === name);
}
