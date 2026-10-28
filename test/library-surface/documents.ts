/**
 * Tasks 17.4a and 17.4b (`openspec/changes/core-arch/tasks.md` 17.4a, 17.4b; A171 `[STATIC]`, owner decisions Q169,
 * Q170 C, Q171 A): 0.9.5's documents are deleted, not marked ("It will still be available in the git history"), and
 * nothing left points at them.
 *
 * - **The documents tasks 17.4a and 17.4b list as 0.9.5's** ({@link RETIRED_DOCUMENTS}) are not in the tree
 *   ({@link retiredDocumentProblems}).
 * - **`CHANGELOG.md`** has no preamble naming one of them and no planned `1.0.0` entry, heading or link reference
 *   ({@link changelogDocumentProblems}).
 * - **`package.json`'s `description`** is one sentence about the indexer, not 0.9.5's store
 *   ({@link descriptionProblems}).
 * - **No Markdown link in the tree points at a missing file** ({@link linkProblems}): every inline link, image and
 *   link reference definition of every `.md` file whose target is a path (not a URL or an anchor) names a file or a
 *   directory of the tree, resolved from the linking file's directory (`/…` from the root), its `#fragment` and
 *   `?query` left out. Fenced code blocks and code spans hold no links.
 * - **`AGENTS.md`** holds the rules of the 1.0.0 guideline still in force ({@link ENGINEERING_RULES}, owner decision
 *   Q170 C), names no deleted document and nothing of 0.9.5's program ({@link agentsProblems}).
 * - **`Formal/STORAGE_ALGEBRA.md`** states W1 and T5 and no retired law ({@link storageAlgebraProblems}, Q171 A).
 *
 * Pure functions over repository-relative paths and file texts; `./documents.test.ts` gives them the tree (git's
 * tracked and untracked files, ignored ones left out).
 */

import path from "node:path";
import { RETIRED_EXPORTS } from "./retirement.js";

/**
 * The documents task 17.4a classified as 0.9.5's and deleted (Q169): they described a removed 0.9.5 part, its
 * contracts or the 1.0.0 release planned on the 0.9.5 surface as current. The classification of every other document
 * is in the task's record.
 */
export const RETIRED_DOCUMENTS_17_4A: readonly string[] = [
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

/**
 * The documents task 17.4b deleted: the 1.0.0 program's guideline and lessons log (Q170 C; the guideline's rules still
 * in force moved into `AGENTS.md` first), and 0.9.5's design, formal, performance and research records (Q171 A) —
 * every file of `design/`, `Formal/*.md` but `Formal/STORAGE_ALGEBRA.md`, `Performance/`, `docs/research/` but
 * `indexer-parallelism-roadmap.md` and `midnight-node-peer-flapping.md`, and `docs/superpowers/`.
 * `docs/THREAT_MODEL.md` (Q172 A) is deleted by the task too but is not listed: task 17.4c writes 0.10.0's threat model
 * at the same path.
 */
export const RETIRED_DOCUMENTS_17_4B: readonly string[] = [
  "docs/v1-implementation-guideline.md",
  "docs/v1-lessons-learned.md",
  "design/db-sync-tls-feasibility.md",
  "design/design-algebra.md",
  "design/design-interfaces.md",
  "design/design.md",
  "design/environment/CHANGELOG.md",
  "design/environment/ENVIRONMENT.md",
  "design/environment/preprod-connection.md",
  "design/environment/verification-checklist.md",
  "design/environment/versions.lock.json",
  "design/full-chain-storage-design.md",
  "design/proposal.md",
  "design/sprint-5-recommendation.md",
  "design/sprint-7-preprod-toolchain-inventory.md",
  "design/tasks.md",
  "Formal/FORMAL-COMPLETION-AUDIT.md",
  "Formal/FORMAL-COMPLETION-ROADMAP.md",
  "Formal/FORMALIZATION_ROADMAP.md",
  "Formal/LEAN_FORMALIZATION_PLAN.md",
  "Formal/STORAGE_ALGEBRA_LEAN_RESEARCH.md",
  "Formal/STORAGE_TYPES.md",
  "Performance/CEILINGS.md",
  "Performance/DESIGN.md",
  "Performance/GC_AND_TRACING_RESEARCH.md",
  "Performance/README.md",
  "docs/research/a1-unbounded-bytea-insert.md",
  "docs/superpowers/plans/2026-07-21-storage-algebra-lean-m1.md",
  "docs/superpowers/plans/2026-07-21-storage-algebra-lean-m2.md",
  "docs/superpowers/plans/2026-07-21-storage-algebra-lean-m3a-watermarks.md",
  "docs/superpowers/plans/2026-07-21-storage-algebra-lean-m3b-checkpoint-c1.md",
];

/** Every document tasks 17.4a and 17.4b deleted as 0.9.5's. */
export const RETIRED_DOCUMENTS: readonly string[] = [...RETIRED_DOCUMENTS_17_4A, ...RETIRED_DOCUMENTS_17_4B];

/** The task that deleted a document of {@link RETIRED_DOCUMENTS}. */
const retiredBy = (document: string): string => (RETIRED_DOCUMENTS_17_4A.includes(document) ? "17.4a" : "17.4b");

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
    (document) => `${document} is 0.9.5's (task ${retiredBy(document)}) and still in the tree (A171)`,
  );
}

/**
 * A171's problems with `CHANGELOG.md`: a preamble (the text before the first `## ` heading) naming a retired document
 * — by its path, or for task 17.4a's by its file name too (17.4b's include names as common as `README.md`) — and a
 * planned `1.0.0` entry: a `## [1.0.0]` heading, or a link reference defined for `1.0.0` or naming `v1.0.0`.
 */
export function changelogDocumentProblems(changelog: string): string[] {
  const lines = changelog.split("\n");
  const firstEntry = lines.findIndex((line) => line.startsWith("## "));
  const preamble = lines.slice(0, firstEntry < 0 ? undefined : firstEntry);
  const problems: string[] = [];
  for (const document of RETIRED_DOCUMENTS) {
    const byName = RETIRED_DOCUMENTS_17_4A.includes(document);
    const named = preamble.findIndex(
      (line) => line.includes(document) || (byName && line.includes(path.posix.basename(document))),
    );
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

/** A rule of the 1.0.0 guideline still in force (Q170 C): the owner's name for it, and its lead in `AGENTS.md`. */
export interface EngineeringRule {
  readonly rule: string;
  readonly lead: string;
}

/**
 * The 18 rules of `docs/v1-implementation-guideline.md` the owner confirmed as still in force (Q170 C, 2026-10-28), in
 * the owner's order, each with the bold lead its restatement for 0.10.0 opens with in `AGENTS.md` — in the stage or
 * section that already carried part of it, or under "Engineering rules".
 */
export const ENGINEERING_RULES: readonly EngineeringRule[] = [
  { rule: "acceptance criteria are the contract", lead: "**Acceptance criteria are the contract.**" },
  { rule: "verify external claims", lead: "**Verify external claims.**" },
  { rule: "test first on real databases", lead: "**Test first, on real databases.**" },
  { rule: "traceability", lead: "**Traceability.**" },
  { rule: "deterministic tests", lead: "**Deterministic tests.**" },
  { rule: "no placeholders", lead: "**No placeholders.**" },
  { rule: "SQL discipline", lead: "**SQL discipline.**" },
  { rule: "typed errors", lead: "**Typed errors.**" },
  { rule: "stop and escalate", lead: "**Stop and escalate.**" },
  { rule: "review evidence and negative controls", lead: "**Review evidence and negative controls.**" },
  { rule: "test honesty", lead: "**Test honesty.**" },
  { rule: "floors only go up, except with the owner's approval", lead: "**Floors only go up.**" },
  { rule: "the flaky-test policy", lead: "**Flaky tests.**" },
  { rule: "the Lean gate", lead: "**The Lean gate.**" },
  { rule: "the supply-chain gates", lead: "**Supply-chain gates.**" },
  { rule: "secrets", lead: "**Secrets.**" },
  { rule: "per-change security checks", lead: "**Per-change security checks.**" },
  { rule: "no AI attribution", lead: "**No AI attribution.**" },
];

/**
 * What marks a sentence as 0.9.5's program rather than 0.10.0's: the versions it was written for, its source and test
 * paths, its test database's name and its gate's live variable. `AGENTS.md` names none of them, nor in backticks a name
 * of 0.9.5's retired exports (A5's {@link RETIRED_EXPORTS}).
 */
export const AGENTS_0_9_5_MARKERS: readonly string[] = [
  "0.9.5",
  "1.0.0",
  "src/postgres/",
  "src/interfaces/",
  "test/api-surface/barrel-resolves",
  "error-catalog-drift",
  "Testcontainers Postgres",
  "UMBRADB_LIVE_PREPROD",
];

/** File names too common to tell a retired document by (`design/tasks.md` against an OpenSpec change's `tasks.md`). */
const COMMON_NAMES = new Set(["README.md", "CHANGELOG.md", "DESIGN.md", "design.md", "proposal.md", "tasks.md"]);

/**
 * A171's problems with `AGENTS.md` (Q170 C): a rule of {@link ENGINEERING_RULES} whose lead is missing or appears more
 * than once; a line naming a retired document, by its path or by its file name unless that is a common one; a line
 * naming a marker of {@link AGENTS_0_9_5_MARKERS} or, in backticks, a retired export.
 */
export function agentsProblems(agents: string): string[] {
  const problems: string[] = [];
  for (const { rule, lead } of ENGINEERING_RULES) {
    const count = agents.split(lead).length - 1;
    if (count === 0) problems.push(`AGENTS.md lacks the rule "${rule}" (its lead ${lead}) (A171)`);
    if (count > 1) problems.push(`AGENTS.md states the rule "${rule}" ${count} times (A171)`);
  }
  const retired = new Set(RETIRED_EXPORTS);
  agents.split("\n").forEach((line, index) => {
    const at = `AGENTS.md:${index + 1}`;
    for (const document of RETIRED_DOCUMENTS) {
      const name = path.posix.basename(document);
      if (line.includes(document) || (!COMMON_NAMES.has(name) && line.includes(name))) {
        problems.push(`${at}: names ${document}, deleted by task ${retiredBy(document)} (A171)`);
      }
    }
    for (const marker of AGENTS_0_9_5_MARKERS) {
      if (line.includes(marker)) problems.push(`${at}: names "${marker}", 0.9.5's program (A171)`);
    }
    for (const match of line.matchAll(/`([A-Za-z_$][\w$]*)`/g)) {
      const name = match[1] as string;
      if (retired.has(name)) problems.push(`${at}: names \`${name}\`, a retired 0.9.5 export (A171)`);
    }
  });
  return problems;
}

/**
 * The laws and property tests of `Formal/STORAGE_ALGEBRA.md` retired with 0.9.5's parts (design §13; Q171 A): T1–T4,
 * C1, C2 (C2a, C2b), L1, and P1–P8, P10, P11. W1 and its property test P9, and T5, stay.
 */
const RETIRED_LAW = /\b(T[1-4]|C1|C2[ab]?|L1|P(?:[1-8]|1[01]))\b/g;

/**
 * A171's problems with `Formal/STORAGE_ALGEBRA.md` (Q171 A): no heading naming W1 or none naming T5, and every line
 * naming a retired law or property test.
 */
export function storageAlgebraProblems(text: string): string[] {
  const problems: string[] = [];
  const lines = text.split("\n");
  const headings = lines.filter((line) => /^#{1,6} /.test(line));
  for (const law of ["W1", "T5"]) {
    if (!headings.some((heading) => new RegExp(`\\b${law}\\b`).test(heading))) {
      problems.push(`Formal/STORAGE_ALGEBRA.md has no heading stating ${law} (A171)`);
    }
  }
  lines.forEach((line, index) => {
    const named = [...new Set([...line.matchAll(RETIRED_LAW)].map((match) => match[1] as string))];
    for (const law of named) {
      problems.push(`Formal/STORAGE_ALGEBRA.md:${index + 1}: names ${law}, a retired law or property test (A171)`);
    }
  });
  return problems;
}
