import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * The provenance of the files `token-metadata` copies from the MIP-0018 proof of concept (acedward/umbradb PR #26 at
 * `760d3e9`) and, through it, from the MIP's reference implementation (`midnight-experiments/mip-0018` at `e829579`).
 * Each copied directory holds a `SOURCE.md` whose table lists every other file in it with its SHA-256; the copies are
 * never edited. [TM-4; acceptance's fixture note, task 1.1]
 */

/** One row of a `SOURCE.md` table: a file of the directory, where it was copied from, and its SHA-256. */
export interface SourceRow {
  readonly path: string;
  readonly from: string;
  readonly sha256: string;
}

const ROW = /^\| `([^`]+)` \| `([^`]+)` \| `([0-9a-f]{64})` \|$/;

/** The rows of the `SOURCE.md` of `dir`, in the order they are written. */
export function sourceRows(dir: string): SourceRow[] {
  const text = readFileSync(join(dir, "SOURCE.md"), "utf8");
  const rows: SourceRow[] = [];
  for (const line of text.split("\n")) {
    const match = ROW.exec(line);
    if (match) rows.push({ path: match[1]!, from: match[2]!, sha256: match[3]! });
  }
  return rows;
}

/** Every file under `dir` except its `SOURCE.md`, as `/`-separated paths relative to `dir`, sorted. */
export function filesUnder(dir: string): string[] {
  const out: string[] = [];
  const walk = (at: string): void => {
    for (const name of readdirSync(at)) {
      const path = join(at, name);
      if (statSync(path).isDirectory()) walk(path);
      else out.push(relative(dir, path).split(sep).join("/"));
    }
  };
  walk(dir);
  return out.filter((path) => path !== "SOURCE.md").sort();
}

/** The SHA-256 of a file, lowercase hex. */
export function sha256Of(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/**
 * What is wrong with `dir`'s copies against its `SOURCE.md`: a listed file missing or with another SHA-256, a file not
 * listed, or a file listed twice. Empty when every copy is as listed.
 */
export function provenanceProblems(dir: string): string[] {
  const rows = sourceRows(dir);
  const problems: string[] = [];
  const listed = new Set<string>();
  for (const row of rows) {
    if (listed.has(row.path)) problems.push(`${row.path}: listed twice`);
    listed.add(row.path);
  }
  const present = new Set(filesUnder(dir));
  for (const row of rows) {
    if (!present.has(row.path)) problems.push(`${row.path}: listed, but missing`);
    else if (sha256Of(join(dir, row.path)) !== row.sha256) problems.push(`${row.path}: SHA-256 differs from SOURCE.md`);
  }
  for (const path of present) if (!listed.has(path)) problems.push(`${path}: not listed in SOURCE.md`);
  return problems;
}

/** A file ported from the proof of concept: the original with only the listed replacements. */
export interface Port {
  readonly file: string;
  readonly from: string;
  readonly sha256Original: string;
  readonly replacements: readonly { readonly ported: string; readonly original: string }[];
}

/** The ports `PORTED.json` lists. */
export function ports(path = "src/features/token-metadata/PORTED.json"): Port[] {
  return (JSON.parse(readFileSync(path, "utf8")) as { ports: Port[] }).ports;
}

/**
 * What is wrong with a ported file: a replacement whose ported text is not in it once, or, with every replacement
 * undone, content whose SHA-256 is not the original's. Empty when the port is the original plus its replacements.
 */
export function portProblems(port: Port, text: string = readFileSync(port.file, "utf8")): string[] {
  let original = text;
  for (const { ported, original: was } of port.replacements) {
    if (original.split(ported).length !== 2) return [`${port.file}: the replacement ${JSON.stringify(ported)} is not in it exactly once`];
    original = original.replace(ported, was);
  }
  const sha = createHash("sha256").update(original).digest("hex");
  return sha === port.sha256Original ? [] : [`${port.file}: with its replacements undone, it is not ${port.from} (SHA-256 differs)`];
}
