/**
 * The documents of the library entry, `startUmbraDB`: the changelog's entry for the change that made it, and the
 * documents a user reads kept clear of the names that change removed. [L59 DOC, LS-1, CF-4]
 *
 * - **The changelog's entry** ({@link changelogEntryProblems}): `CHANGELOG.md`'s `0.10.0` section holds a subsection
 *   whose heading starts with {@link ENTRY_HEADING}, opening with a bold breaking-change warning
 *   ({@link WARNING_START}), and naming, each in backticks (a function also as a call, `` `startUmbraDB(options)` ``),
 *   every term of {@link entryTerms}: both renamed settings with their new names and the finding `renamed-setting`;
 *   `node:sqlite`, whose `ExperimentalWarning` no longer prints; the six new refusal codes; `callback-error` and
 *   `listen-failed` with `ERROR_CODES`; the exports the change removed and the values it added.
 * - **The documents' sweep** ({@link sweepProblems}): no paragraph of a document a user reads names a removed export
 *   as a word (`InMemoryBlockSource` is not `BlockSource`) or a renamed setting's old key: those documents describe the
 *   current version, and only the changelog records what changed. A paragraph is a run of lines between blank lines,
 *   each Markdown table row one of its own; the line reported is the name's own.
 *
 * Pure functions over texts; `./library-documents.test.ts` gives them the tree, the change's design (its §4 Exports
 * bullet, its §7.2 list of new codes) and the renamed settings of `src/config/core-settings.ts`.
 */

/** The changelog subsection's heading, as it starts. */
export const ENTRY_HEADING = "### Changed since `v0.10.0-rc.1`";

/** How the subsection's first paragraph starts: a bold breaking-change warning. */
export const WARNING_START = "**Breaking";

/** A renamed setting: its old key and its new one, each a dotted path (`listen.transport`). */
export interface Renamed {
  readonly from: string;
  readonly to: string;
}

/** What the changelog entry must name. */
export interface EntryInput {
  readonly renamed: readonly Renamed[];
  /** The six new refusal codes (the change's design §7.2). */
  readonly codes: readonly string[];
  /** The exports the change removed, and the values it added (the change's design §4). */
  readonly removed: readonly string[];
  readonly added: readonly string[];
}

/** Every term the changelog entry names in backticks, in the order {@link changelogEntryProblems} reports them. */
export function entryTerms(input: EntryInput): string[] {
  return [
    ...input.renamed.flatMap(({ from, to }) => [from, to]),
    "renamed-setting",
    "node:sqlite",
    "ExperimentalWarning",
    ...input.codes,
    "callback-error",
    "listen-failed",
    "ERROR_CODES",
    ...input.removed,
    ...input.added,
  ];
}

/** The lines of `## [version]`'s section, up to the next `## ` heading; null without it. */
function versionSection(changelog: string, version: string): string[] | null {
  const lines = changelog.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start < 0) return null;
  const next = lines.findIndex((line, i) => i > start && line.startsWith("## "));
  return lines.slice(start + 1, next < 0 ? undefined : next);
}

/**
 * The problems of the changelog's entry for the library entry (see the module comment), in the `0.10.0` section of
 * `changelog`: the subsection missing, its first paragraph not the warning, or a term of {@link entryTerms} not named
 * in backticks.
 */
export function changelogEntryProblems(changelog: string, input: EntryInput): string[] {
  const section = versionSection(changelog, "0.10.0");
  if (section === null) return ["CHANGELOG.md has no 0.10.0 section (L59)"];
  const start = section.findIndex((line) => line.startsWith(ENTRY_HEADING));
  if (start < 0) return [`CHANGELOG.md's 0.10.0 section has no subsection "${ENTRY_HEADING}…" (L59)`];
  const next = section.findIndex((line, i) => i > start && /^#{2,3} /.test(line));
  const body = section.slice(start + 1, next < 0 ? undefined : next);
  const problems: string[] = [];
  const first = body.find((line) => line.trim() !== "");
  if (first === undefined || !first.startsWith(WARNING_START)) {
    problems.push(`the subsection "${ENTRY_HEADING}…" does not open with a bold breaking-change warning (L59)`);
  }
  const text = body.join("\n");
  for (const term of entryTerms(input)) {
    const named = text.includes(`\`${term}\``) || text.includes(`\`${term}(`);
    if (!named) problems.push(`the subsection "${ENTRY_HEADING}…" does not name \`${term}\` (L59)`);
  }
  return problems;
}

/** A document's path from the repository root and its text. */
export interface Document {
  readonly file: string;
  readonly text: string;
}

/** The paragraphs of `text`, each with the 1-based number of its first line. */
function paragraphs(text: string): { readonly line: number; readonly lines: readonly string[] }[] {
  const found: { line: number; lines: string[] }[] = [];
  let open: { line: number; lines: string[] } | null = null;
  text.split("\n").forEach((line, index) => {
    const row = line.trimStart().startsWith("|");
    if (line.trim() === "" || row) open = null;
    if (line.trim() === "") return;
    if (open === null) {
      open = { line: index + 1, lines: [] };
      found.push(open);
    }
    open.lines.push(line);
    if (row) open = null;
  });
  return found;
}

/** Whether `line` names `name` as a word: not inside a longer identifier. */
const namesWord = (line: string, name: string): boolean =>
  new RegExp(`(?<![A-Za-z0-9_$])${name.replaceAll(".", "\\.")}(?![A-Za-z0-9_$])`).test(line);

/**
 * The problems of the documents' sweep (see the module comment): each `file:line` naming a removed export or a
 * renamed setting's old key.
 */
export function sweepProblems(documents: readonly Document[], removed: readonly string[], renamed: readonly Renamed[]): string[] {
  const problems: string[] = [];
  for (const { file, text } of documents) {
    for (const paragraph of paragraphs(text)) {
      paragraph.lines.forEach((line, offset) => {
        const at = `${file}:${paragraph.line + offset}`;
        for (const name of removed) {
          if (namesWord(line, name)) problems.push(`${at}: names ${name}, which the package no longer exports (LS-1)`);
        }
        for (const { from, to } of renamed) {
          if (namesWord(line, from)) {
            problems.push(`${at}: names ${from}, the old key of ${to}; only the changelog records renames (CF-4)`);
          }
        }
      });
    }
  }
  return problems;
}

/**
 * The six new refusal codes, from the change's design §7.2: the backticked words between "The six new refusal codes —"
 * and the next " —". Throws when the sentence is gone or lists another number of codes.
 */
export function newRefusalCodes(design: string): string[] {
  const lead = "The six new refusal codes —";
  const start = design.indexOf(lead);
  const end = design.indexOf(" —", start + lead.length);
  if (start < 0 || end < 0) throw new Error(`the start-umbradb design has no sentence "${lead} … —"`);
  const codes = [...design.slice(start + lead.length, end).matchAll(/`([a-z][a-z-]*)`/g)].map((match) => match[1] as string);
  if (codes.length !== 6) throw new Error(`the start-umbradb design lists ${codes.length} new refusal codes, not six`);
  return codes;
}
