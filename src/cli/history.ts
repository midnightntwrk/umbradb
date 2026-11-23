/**
 * `umbradb history export [--out <file>] [--config <file>]`: writes the configuration's database's recorded history
 * (`core_chain.config` at its committed height) to the history file the configuration names, or to `--out`. Stop the
 * process first: its next start then runs this build's entries from the height after.
 */

import { randomBytes } from "node:crypto";
import { rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { readHistory } from "../backbone/core-chain/sql.js";
import type { Manifest } from "../backup/manifest.js";
import { historyFileText, type RecordedHistory } from "../config/recorded-history.js";
import { redactor } from "../config/redact.js";
import { UmbraError } from "../db/errors.js";
import { commandCommittedHeight, commandTarget, openCommandDatabase, readCommandConfig } from "./configured.js";

/** A backup's recorded history, from its manifest. */
export function manifestHistory(manifest: Manifest): RecordedHistory {
  return Object.freeze({
    height: manifest.height,
    revisions: manifest.history.map(({ id, start, stop, version, data }) => ({ id, start, stop, version, data })),
  });
}

/** Writes `history` to `file` whole: a temporary file next to it, renamed over it. */
export async function writeHistoryFile(file: string, history: RecordedHistory): Promise<void> {
  const temporary = join(dirname(file), `.${basename(file)}.${randomBytes(6).toString("hex")}.partial`);
  try {
    await writeFile(temporary, historyFileText(history), { flag: "wx" });
    await rename(temporary, file);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

/** `history export`'s arguments, or what is wrong with them. */
export function historyExportArguments(
  args: readonly string[],
): { readonly out?: string; readonly config?: string } | string {
  const { tokens } = parseArgs({
    args: [...args],
    options: { out: { type: "string" }, config: { type: "string" } },
    allowPositionals: true,
    strict: false,
    tokens: true,
  });
  const given: Record<string, (string | undefined)[]> = { out: [], config: [] };
  for (const token of tokens) {
    if (token.kind === "positional") return "history export takes no file of its own: umbradb history export [--out <file>] [--config <file>]";
    if (token.kind === "option") {
      const values = given[token.name];
      if (values === undefined) return `unknown option ${token.rawName} of history export`;
      values.push(token.value);
    }
  }
  const result: { out?: string; config?: string } = {};
  for (const name of ["out", "config"] as const) {
    const values = given[name] as (string | undefined)[];
    if (values.length > 1) return `history export takes --${name} once`;
    const [value] = values;
    if (values.length === 1 && (value === undefined || value === "")) return `--${name} takes a value`;
    if (value !== undefined) result[name] = value;
  }
  return result;
}

/** What `umbradb history export` wrote, or why it did not. */
export type HistoryExportOutcome =
  | { readonly written: true; readonly line: string }
  | { readonly written: false; readonly error: unknown; readonly line: string };

/** Runs `umbradb history export` (see the module comment); resolves with the line it prints. */
export async function runHistoryExport(options: {
  readonly out?: string | undefined;
  readonly config?: string | undefined;
  readonly cwd: string;
}): Promise<HistoryExportOutcome> {
  let redact = redactor([]);
  try {
    const config = await readCommandConfig({ file: options.config, cwd: options.cwd });
    redact = config.redact;
    const out = options.out === undefined ? config.historyFile : resolve(options.cwd, options.out);
    if (out === null) {
      throw new UmbraError(
        "invalid-configuration",
        `the configuration ${config.file} names no history file: add history: "./umbradb.history.json" to it, or give --out`,
        { file: config.file, reason: "no-history-file" },
      );
    }
    const target = commandTarget(config, options.cwd);
    if (target.backend === "pglite" && !target.exists) {
      throw new UmbraError("no-committed-height", `the PGlite directory ${target.dataDir} holds no database yet`, {
        reason: "no-database",
      });
    }
    const db = await openCommandDatabase(target, config);
    let history: RecordedHistory;
    try {
      history = await db.read(async (read) => {
        const height = await commandCommittedHeight(read);
        if (height === null) {
          throw new UmbraError("no-committed-height", "the database has no committed height yet, so it has no history to export");
        }
        const revisions = (await readHistory(read)).map((row) => ({
          id: row.id,
          start: String(row.start),
          stop: row.stop === null ? null : String(row.stop),
          version: row.version,
          data: row.data,
        }));
        return { height: String(height), revisions };
      });
    } finally {
      await db.close();
    }
    await writeHistoryFile(out, history);
    const line = `umbradb history export: wrote ${out}: height ${history.height}, ${history.revisions.length} revisions`;
    return { written: true, line: redact.text(line) };
  } catch (error) {
    const what = error instanceof UmbraError ? `${error.code}: ${error.message}` : `failed: ${String(error)}`;
    return { written: false, error, line: redact.text(`umbradb history export: ${what}`) };
  }
}
