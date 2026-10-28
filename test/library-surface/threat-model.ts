/**
 * Task 17.4c (`openspec/changes/core-arch/tasks.md` 17.4c; A178 `[STATIC]`, owner decisions Q181 A, Q177 A, Q178 A,
 * Q179 A, Q180 A): `docs/THREAT_MODEL.md` describes 0.10.0.
 *
 * - **No 0.9.5 part named** ({@link retiredPartProblems}): none of {@link RETIRED_PARTS} (the checkpoint store, the
 *   chunk pool, the wallet envelope, TemporalKV) appears in it, in any spelling the patterns allow.
 * - **The draft's ten boundaries and the owner's three areas** ({@link headingProblems}): a `### N. <boundary>`
 *   heading for each of {@link BOUNDARIES} and a `## <area>` heading for each of {@link OWNER_AREAS}, each once.
 * - **The known gaps** ({@link knownGapProblems}): its "Known gaps" section names the tasks that fixed or will fix a
 *   gap ({@link GAP_TASKS}) and the issues that record the rest ({@link GAP_ISSUES}).
 * - **Every `path:line` it cites** ({@link citations}, {@link citationProblems}) names a file of the tree with at least
 *   that many lines (a range `path:a-b`, its end).
 * - **`README.md` and `SECURITY.md` link it** ({@link threatModelLinkProblems}): a Markdown link of each resolves to
 *   {@link THREAT_MODEL}.
 * - **Lines at most 120 columns** ({@link lineLengthProblems}), the repository's Markdown rule.
 *
 * Pure functions over texts and repository-relative paths; `./threat-model.test.ts` gives them the tree.
 */

import { linkedPath, markdownLinks } from "./documents.js";

/** The threat model's path from the repository root. */
export const THREAT_MODEL = "docs/THREAT_MODEL.md";

/** The documents that must link {@link THREAT_MODEL} (A178). */
export const LINKING_DOCUMENTS: readonly string[] = ["README.md", "SECURITY.md"];

/**
 * 0.9.5's parts A178 names, which the model must not name: as patterns, so `checkpoint-store`, `chunk_pool` and
 * `TemporalKV`'s `PgTemporalKV` count too.
 */
export const RETIRED_PARTS: readonly { readonly part: string; readonly pattern: RegExp }[] = [
  { part: "checkpoint store", pattern: /checkpoint[\s_-]?store/i },
  { part: "chunk pool", pattern: /chunk[\s_-]?pool/i },
  { part: "wallet envelope", pattern: /wallet[\s_-]?envelope/i },
  { part: "TemporalKV", pattern: /temporal[\s_-]?kv/i },
];

/** The ten boundaries of the Codex draft (`~/todo/Umbra/experiments/00028-threat-model-draft.md`), in its order. */
export const BOUNDARIES: readonly string[] = [
  "Operator files and module code → process",
  "Midnight node → public process",
  "Runner and modules → PostgreSQL 18 or PGlite",
  "Main thread ↔ ledger worker",
  "Module API readers → process",
  "Admin callers → admin worker",
  "Public process/database ↔ private process",
  "Database ↔ backup file → restore target",
  "Browser origin → page, workers and storage",
  "Dependency producers and build pipeline → installed code",
];

/** The owner's three areas (review of 2026-10-28; Q177 and Q178, Q179, Q180), each a section of its own. */
export const OWNER_AREAS: readonly string[] = [
  "Backups and restore",
  "The Midnight node",
  "Private reads of public data",
];

/** The heading of the gap list. */
export const KNOWN_GAPS = "Known gaps";

/** The tasks that fixed a gap of the draft (14.2b: 1, 12.2b: 3, 15.1b: 7, 17.4b: 9) or will (4.5: 2, and Q175). */
export const GAP_TASKS: readonly string[] = ["14.2b", "4.5", "12.2b", "15.1b", "17.4b"];

/** The issues that record the draft's gaps 4, 5, 6 and 8. */
export const GAP_ISSUES: readonly string[] = ["00045", "00046", "00047", "00048"];

const FENCE = /^ {0,3}(`{3,}|~{3,})/;

/** The lines of a Markdown text outside fenced code blocks, with their 1-based numbers. */
function proseLines(text: string): { readonly line: number; readonly text: string }[] {
  const lines: { line: number; text: string }[] = [];
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
    lines.push({ line: index + 1, text: raw });
  });
  return lines;
}

/** A `path:line` the model cites: the line of the model it is on, the path, and the last line it names. */
export interface Citation {
  readonly at: number;
  readonly path: string;
  readonly line: number;
}

/**
 * A path (segments of letters, digits, `.`, `_`, `-`, separated by `/`, its last with an extension starting with a
 * letter), a colon and a line number, optionally a range (`-` or `–`) whose end is taken. Not preceded by a path
 * character or `/` (so a URL's host is not read), and not an address: `0.0.0.0:8081`'s last segment has no extension
 * starting with a letter, `localhost:5432` none at all.
 */
const CITATION = /(?<![\w./-])((?:[\w.-]+\/)*[\w-][\w.-]*\.[A-Za-z][A-Za-z0-9]*):(\d+)(?:\s*[-–]\s*(\d+))?\b/g;

/** Every `path:line` of a Markdown text outside fenced code blocks, in order. */
export function citations(text: string): Citation[] {
  const found: Citation[] = [];
  for (const { line, text: raw } of proseLines(text)) {
    for (const match of raw.matchAll(CITATION)) {
      const end = match[3] ?? match[2];
      found.push({ at: line, path: match[1] as string, line: Number(end) });
    }
  }
  return found;
}

/**
 * A178's problems with the model's citations: each names a file of the tree (`lineCount` gives its number of lines,
 * or `null` when it is not a file of the tree) with at least that many lines, and a line of at least 1.
 */
export function citationProblems(text: string, lineCount: (path: string) => number | null): string[] {
  const problems: string[] = [];
  for (const { at, path, line } of citations(text)) {
    const lines = lineCount(path);
    if (lines === null) {
      problems.push(`${THREAT_MODEL}:${at}: cites ${path}:${line}, and ${path} is not a file of the tree (A178)`);
    } else if (line < 1 || line > lines) {
      problems.push(`${THREAT_MODEL}:${at}: cites ${path}:${line}, and ${path} has ${lines} lines (A178)`);
    }
  }
  return problems;
}

/** The number of lines of a file's text: a final newline ends the last line, it does not start another. */
export function lineCountOf(text: string): number {
  if (text === "") return 0;
  const lines = text.split("\n").length;
  return text.endsWith("\n") ? lines - 1 : lines;
}

/** A178's problems with 0.9.5's parts: each line naming one of {@link RETIRED_PARTS}. */
export function retiredPartProblems(text: string): string[] {
  const problems: string[] = [];
  text.split("\n").forEach((line, index) => {
    for (const { part, pattern } of RETIRED_PARTS) {
      if (pattern.test(line)) problems.push(`${THREAT_MODEL}:${index + 1}: names the ${part}, 0.9.5's (A178)`);
    }
  });
  return problems;
}

/** The headings of a Markdown text outside fenced code blocks: their level and their text, trimmed. */
function headings(text: string): { readonly level: number; readonly title: string }[] {
  return proseLines(text).flatMap(({ text: raw }) => {
    const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(raw);
    return heading === null ? [] : [{ level: (heading[1] as string).length, title: heading[2] as string }];
  });
}

/**
 * A178's problems with the model's headings: each of the ten {@link BOUNDARIES} a `### N. <boundary>` heading (N its
 * place, 1 to 10), each of the {@link OWNER_AREAS} and {@link KNOWN_GAPS} a `## <title>` heading, each exactly once.
 */
export function headingProblems(text: string): string[] {
  const found = headings(text);
  const count = (level: number, title: string): number =>
    found.filter((heading) => heading.level === level && heading.title === title).length;
  const problems: string[] = [];
  const expect = (level: number, title: string, what: string): void => {
    const times = count(level, title);
    const heading = `${"#".repeat(level)} ${title}`;
    if (times === 0) problems.push(`${THREAT_MODEL} lacks ${what} (heading "${heading}") (A178)`);
    if (times > 1) problems.push(`${THREAT_MODEL} has the heading "${heading}" ${times} times (A178)`);
  };
  BOUNDARIES.forEach((boundary, index) => expect(3, `${index + 1}. ${boundary}`, `boundary ${index + 1}`));
  for (const area of OWNER_AREAS) expect(2, area, `the owner's area "${area}"`);
  expect(2, KNOWN_GAPS, "its known gaps");
  return problems;
}

/**
 * A178's problems with the "Known gaps" section (from its heading to the next `#` or `##` heading): it names each task
 * of {@link GAP_TASKS} ("task 14.2b", "tasks 12.2b and …" or the bare number) and each issue of {@link GAP_ISSUES}.
 */
export function knownGapProblems(text: string): string[] {
  const lines = proseLines(text);
  const start = lines.findIndex(({ text: raw }) => new RegExp(`^##\\s+${KNOWN_GAPS}\\s*$`).test(raw));
  if (start < 0) return [`${THREAT_MODEL} has no "${KNOWN_GAPS}" section (A178)`];
  const after = lines.slice(start + 1);
  const end = after.findIndex(({ text: raw }) => /^#{1,2}\s/.test(raw));
  const section = (end < 0 ? after : after.slice(0, end)).map(({ text: raw }) => raw).join("\n");
  const problems: string[] = [];
  for (const task of GAP_TASKS) {
    const named = new RegExp(`(?<![\\w.])${task.replace(/\./g, "\\.")}(?![\\w.]*\\d)`);
    if (!named.test(section)) problems.push(`${THREAT_MODEL}'s known gaps do not name task ${task} (A178)`);
  }
  for (const issue of GAP_ISSUES) {
    if (!new RegExp(`(?<!\\d)${issue}(?!\\d)`).test(section)) {
      problems.push(`${THREAT_MODEL}'s known gaps do not name issue ${issue} (A178)`);
    }
  }
  return problems;
}

/** A178's problems with the links to the model: each of `documents` without a Markdown link resolving to it. */
export function threatModelLinkProblems(
  documents: readonly { readonly file: string; readonly text: string }[],
): string[] {
  return documents
    .filter(({ file, text }) => !markdownLinks(text).some(({ target }) => linkedPath(file, target) === THREAT_MODEL))
    .map(({ file }) => `${file} does not link ${THREAT_MODEL} (A178)`);
}

/** Lines longer than 120 columns (characters, not bytes: `→` counts one). */
export function lineLengthProblems(text: string): string[] {
  const problems: string[] = [];
  text.split("\n").forEach((line, index) => {
    const columns = [...line].length;
    if (columns > 120) problems.push(`${THREAT_MODEL}:${index + 1}: ${columns} columns, more than 120`);
  });
  return problems;
}
