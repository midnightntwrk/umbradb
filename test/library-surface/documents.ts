/**
 * Task 17.4a (`openspec/changes/core-arch/tasks.md` 17.4a; A171 `[STATIC]`, owner decision Q169): 0.9.5's documents
 * are deleted, not marked ("It will still be available in the git history"), and nothing left points at them.
 *
 * - **The documents task 17.4a classified as 0.9.5's** ({@link RETIRED_DOCUMENTS}) are not in the tree
 *   ({@link retiredDocumentProblems}).
 * - **`CHANGELOG.md`** has no preamble naming one of them and no planned `1.0.0` entry, heading or link reference
 *   ({@link changelogDocumentProblems}).
 * - **`package.json`'s `description`** is one sentence about the indexer, not 0.9.5's store
 *   ({@link descriptionProblems}).
 * - **No Markdown link in the tree points at a missing file** ({@link linkProblems}): every inline link, image and
 *   link reference definition of every `.md` file whose target is a path (not a URL or an anchor) names a file or a
 *   directory of the tree, resolved from the linking file's directory (`/…` from the root), its `#fragment` and
 *   `?query` left out. Fenced code blocks and code spans hold no links.
 *
 * Pure functions over repository-relative paths and file texts; `./documents.test.ts` gives them the tree (git's
 * tracked and untracked files, ignored ones left out).
 */

import path from "node:path";

/**
 * The documents task 17.4a classified as 0.9.5's and deleted (Q169): they described a removed 0.9.5 part, its
 * contracts or the 1.0.0 release planned on the 0.9.5 surface as current. The classification of every other document
 * is in the task's record.
 */
export const RETIRED_DOCUMENTS: readonly string[] = [
  "docs/STABILITY.md",
  "docs/CONTRACT.md",
  "docs/ERROR-CATALOG.md",
  "docs/SCHEMA.md",
  "docs/durability-contract.md",
  "docs/checkpoint-store-contract.md",
  "docs/features/full-chain-storage.md",
  "docs/releases/v1.0.0.md",
  "docs/roadmapv1.html",
  "docs/visualizations/cardano-midnight-flow.html",
  "docs/notes/2026-07-23-resume-checkpoint.md",
];

/** `package.json`'s `description` as 0.9.5 shipped it. */
export const DESCRIPTION_0_9_5 =
  "A local, single-writer, PostgreSQL-backed temporal and content-addressed store for Midnight wallet state.";

/** A text file: its path from the repository root (`/`-separated) and its text. */
export interface TextFile {
  readonly file: string;
  readonly text: string;
}

/** A link a Markdown file makes: its line (1-based) and its target as written, angle brackets removed. */
export interface MarkdownLink {
  readonly line: number;
  readonly target: string;
}

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const CODE_SPAN = /(`+)(?:(?!\1).)*?\1/g;
const INLINE = /\]\(\s*(<[^>\n]*>|[^\s)]+)/g;
const DEFINITION = /^ {0,3}\[[^\]]+\]:\s*(<[^>\n]*>|\S+)/;

/**
 * The links of a Markdown text: inline links and images (`[text](target)`, `![alt](target "title")`) and link
 * reference definitions (`[label]: target`). Lines inside a fenced code block and code spans are skipped.
 */
export function markdownLinks(text: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  let fence: string | null = null;
  text.split("\n").forEach((raw, index) => {
    const opened = FENCE.exec(raw)?.[1];
    if (fence !== null) {
      if (opened !== undefined && opened[0] === fence[0] && opened.length >= fence.length && raw.trim() === opened) {
        fence = null;
      }
      return;
    }
    if (opened !== undefined) {
      fence = opened;
      return;
    }
    const line = raw.replace(CODE_SPAN, (span) => " ".repeat(span.length));
    const targets = [...line.matchAll(INLINE)].map((match) => match[1] as string);
    const definition = DEFINITION.exec(line)?.[1];
    if (definition !== undefined) targets.push(definition);
    for (const target of targets) links.push({ line: index + 1, target: target.replace(/^<(.*)>$/, "$1") });
  });
  return links;
}

/** A target that is a URL (`https:`, `mailto:`, …, or `//host`) or an anchor in the same file: not a path. */
const notAPath = (target: string): boolean =>
  /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//") || target.startsWith("#");

/**
 * The repository path a link's target names, from the linking file's directory (or the root, for `/…`); its
 * `#fragment` and `?query` left out, percent-escapes decoded. `null` for a URL, an anchor, or an empty path.
 */
export function linkedPath(file: string, target: string): string | null {
  if (notAPath(target)) return null;
  let named = target.replace(/[#?].*$/, "");
  try {
    named = decodeURI(named);
  } catch {
    // A malformed escape is checked as written.
  }
  if (named === "") return null;
  const joined = named.startsWith("/") ? named.slice(1) : path.posix.join(path.posix.dirname(file), named);
  const resolved = path.posix.normalize(joined).replace(/\/+$/, "");
  return resolved === "." ? "" : resolved;
}

/** Every file of the tree, and every directory holding one, as paths from the root (the root itself is `""`). */
function treePaths(tree: readonly string[]): Set<string> {
  const paths = new Set<string>([""]);
  for (const file of tree) {
    paths.add(file);
    for (let dir = path.posix.dirname(file); dir !== "."; dir = path.posix.dirname(dir)) paths.add(dir);
  }
  return paths;
}

/**
 * A171's broken links: each link of `files` (the tree's Markdown files) whose target is a path naming no file or
 * directory of `tree`, as `file:line: …`.
 */
export function linkProblems(files: readonly TextFile[], tree: readonly string[]): string[] {
  const paths = treePaths(tree);
  const problems: string[] = [];
  for (const { file, text } of files) {
    for (const { line, target } of markdownLinks(text)) {
      const named = linkedPath(file, target);
      if (named !== null && !paths.has(named)) {
        problems.push(`${file}:${line}: links to ${target}, and ${named} is not in the tree (A171)`);
      }
    }
  }
  return problems;
}

/** The documents of {@link RETIRED_DOCUMENTS} still in `tree`. */
export function retiredDocumentProblems(tree: readonly string[]): string[] {
  const present = new Set(tree);
  return RETIRED_DOCUMENTS.filter((document) => present.has(document)).map(
    (document) => `${document} is 0.9.5's (task 17.4a) and still in the tree (A171)`,
  );
}

/**
 * A171's problems with `CHANGELOG.md`: a preamble (the text before the first `## ` heading) naming a retired document,
 * and a planned `1.0.0` entry — a `## [1.0.0]` heading, or a link reference defined for `1.0.0` or naming `v1.0.0`.
 */
export function changelogDocumentProblems(changelog: string): string[] {
  const lines = changelog.split("\n");
  const firstEntry = lines.findIndex((line) => line.startsWith("## "));
  const preamble = lines.slice(0, firstEntry < 0 ? undefined : firstEntry);
  const problems: string[] = [];
  for (const document of RETIRED_DOCUMENTS) {
    const named = preamble.findIndex((line) => line.includes(document) || line.includes(path.posix.basename(document)));
    if (named >= 0) problems.push(`CHANGELOG.md:${named + 1}: the preamble names ${document}, which is 0.9.5's (A171)`);
  }
  lines.forEach((line, index) => {
    if (/^## \[1\.0\.0\]/.test(line)) problems.push(`CHANGELOG.md:${index + 1}: plans a 1.0.0 entry (A171)`);
    const definition = /^ {0,3}\[([^\]]+)\]:\s*(\S+)/.exec(line);
    if (definition !== null && (definition[1] === "1.0.0" || /\bv1\.0\.0\b/.test(definition[2] as string))) {
      problems.push(`CHANGELOG.md:${index + 1}: a link reference for the planned 1.0.0 (A171)`);
    }
  });
  return problems;
}

/** A171's problems with `package.json`'s `description`: one sentence about the indexer, nothing of 0.9.5's store. */
export function descriptionProblems(description: unknown): string[] {
  if (typeof description !== "string" || description.trim() === "") {
    return ["package.json has no description (A171)"];
  }
  const problems: string[] = [];
  if (description === DESCRIPTION_0_9_5) problems.push("package.json's description is 0.9.5's (A171)");
  if (!/\bindexer\b/i.test(description)) problems.push("package.json's description does not name the indexer (A171)");
  const store = /temporal|content-addressed|wallet state/i.exec(description);
  if (store !== null) problems.push(`package.json's description describes 0.9.5's store ("${store[0]}") (A171)`);
  if (!description.endsWith(".") || /[.!?]\s+\S/.test(description)) {
    problems.push("package.json's description is not one sentence (A171)");
  }
  return problems;
}
