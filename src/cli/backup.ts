/**
 * `umbradb backup --out <file> [--config <file>]`: writes a backup of the database the configuration file names
 * (`./configured.ts`) to the file `--out` names, through `src/backup/` (`writeBackup`).
 * [BK-1, BK-2, PP-12, Q83, Q85; design §9.1, §12]
 *
 * - **Which database, and its build.** The configuration file (`--config`, or `umbradb.config.ts` in the working
 *   directory, as for `umbradb run`) gives the database (from its process's `core` revision), the development opt-in
 *   and the side. The command's build with the file's user modules gives the tables declared `deterministic: false`,
 *   which the contents hash records by name only. [CF-1, Q102, Q76]
 * - **While the process runs.** On PostgreSQL the command reads through a connection of its own, in one read's
 *   snapshot, beside a process writing the same database. A PGlite directory can be opened by one process at a time:
 *   while a process holds it, the command refuses with `writer-lock-held`, and the process itself backs it up (its
 *   `backup`, or `backupAtStop`). [DB-11]
 * - **Refusals** (exit 1, no file written):
 *   - the configuration's own;
 *   - `private-backup-refused` for a private process's database without the development opt-in (known from the file's
 *     side, or the database's own private cursor); it comes before anything is opened when the file says so [PP-12];
 *   - `backup-tools-missing`, naming what to install;
 *   - `no-committed-height`; a PGlite directory with no database in it is refused without being opened, since opening
 *     it would create one;
 *   - the database's failures.
 *
 * The command prints one line on stdout when the backup is written: the file, the height, the contents hash and the
 * tool. Nothing it prints holds a secret: every text passes through the redaction of the file's secrets (the database
 * URL among them) and of any URL's credentials.
 */

import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { redactor } from "../config/redact.js";
import { UmbraError } from "../db/errors.js";
import { type BackupSeams, writeBackup } from "../backup/backup.js";
import type { Environment } from "../backup/tools.js";
import {
  type CommandConfig,
  commandTarget,
  declaredOptOuts,
  openCommandDatabase,
  readCommandConfig,
} from "./configured.js";

/** `backup`'s arguments — one `--out <file>`, at most one `--config <file>`, nothing else —, or what is wrong. */
export function backupArguments(args: readonly string[]): { readonly out: string; readonly config?: string } | string {
  const { tokens } = parseArgs({
    args: [...args],
    options: { out: { type: "string" }, config: { type: "string" } },
    allowPositionals: true,
    strict: false,
    tokens: true,
  });
  const outs: (string | undefined)[] = [];
  const configs: (string | undefined)[] = [];
  for (const token of tokens) {
    if (token.kind === "positional") return "backup takes no file of its own: umbradb backup --out <file> [--config <file>]";
    if (token.kind === "option") {
      if (token.name === "out") outs.push(token.value);
      else if (token.name === "config") configs.push(token.value);
      else return `unknown option ${token.rawName} of backup`;
    }
  }
  if (outs.length !== 1) return "backup takes --out once: umbradb backup --out <file> [--config <file>]";
  if (configs.length > 1) return "backup takes --config once";
  const [out] = outs;
  const [config] = configs;
  if (out === undefined || out === "") return "--out takes a value: the backup file to write";
  if (configs.length === 1 && (config === undefined || config === "")) {
    return "--config takes a value: the configuration file";
  }
  return config === undefined ? { out } : { out, config };
}

/** What {@link runBackup} runs. */
export interface BackupCommandOptions {
  readonly out: string;
  readonly config?: string | undefined;
  readonly cwd: string;
  /** `PATH` and `UMBRADB_PG_DUMP`; this process's environment unless given. */
  readonly env?: Environment;
}

/** What `umbradb backup` wrote, or why it did not. */
export type BackupOutcome =
  | { readonly written: true; readonly line: string }
  | { readonly written: false; readonly error: unknown; readonly line: string };

/** `private-backup-refused` before anything is opened: the file describes a private process. [PP-12] */
function privateBySide(config: CommandConfig): void {
  if (config.side === "private" && !config.developmentOptIn) {
    throw new UmbraError(
      "private-backup-refused",
      `the configuration ${config.file} is a private process's, and UmbraDB does not back up a private process's ` +
        "database unless the development opt-in is set; nothing was opened and no file was written",
      { feature: "private-backup" },
    );
  }
}

/** Runs the command (see the module comment); resolves with the line it prints. */
export async function runBackup(options: BackupCommandOptions, seams: BackupSeams = {}): Promise<BackupOutcome> {
  let redact = redactor([]);
  try {
    const config = await readCommandConfig({ file: options.config, cwd: options.cwd });
    redact = config.redact;
    privateBySide(config);
    const target = commandTarget(config, options.cwd);
    if (target.backend === "pglite" && !target.exists) {
      throw new UmbraError(
        "no-committed-height",
        `the configuration's PGlite directory ${target.dataDir} holds no database yet, so there is nothing to back up; ` +
          "it was not opened (opening it would create one)",
        { reason: "no-database" },
      );
    }
    const db = await openCommandDatabase(target, config);
    try {
      const out = resolve(options.cwd, options.out);
      const { manifest } = await writeBackup(
        {
          db,
          target: target.backend === "postgres" ? { backend: "postgres", connection: target.connection } : { backend: "pglite" },
          out,
          optedOut: declaredOptOuts(config.declarations),
          side: config.side,
          developmentOptIn: config.developmentOptIn,
          ...(options.env === undefined ? {} : { env: options.env }),
        },
        seams,
      );
      const tool = `${manifest.tool.name} ${manifest.tool.version}`;
      const line = `umbradb backup: wrote ${out}: height ${manifest.height}, contents hash ${manifest.contentsHash}, ${tool}`;
      return { written: true, line: redact.text(line) };
    } finally {
      await db.close();
    }
  } catch (error) {
    const what = error instanceof UmbraError ? `${error.code}: ${error.message}` : `failed: ${String(error)}`;
    return { written: false, error, line: redact.text(`umbradb backup: ${what}`) };
  }
}
