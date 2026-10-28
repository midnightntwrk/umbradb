/**
 * `umbradb restore <file> [--config <file>]` (`openspec/changes/core-arch/specs/backups/spec.md` BK-3, BK-4;
 * `design.md` §9.1, §12; owner decisions Q83, Q85, Q153; tasks 15.2, 15.2a): restores a backup into the database the
 * configuration file names (`./configured.ts`), which must be empty, through `src/backup/restore.ts` (`restoreBackup`):
 * the checks before loading, the file's SQL in one transaction on the writer connection, the owners and grants, the
 * contents hash and the ledger state root checked before the commit. A PGlite directory not there yet is created, with
 * any missing parent directory, once the checks before loading passed (`openRestoreTarget`; CF-4, owner decision Q163).
 *
 * - **The configuration file** — `--config`, or `umbradb.config.ts` in the working directory, as for `umbradb run` —
 *   gives the database and the opt-in (its process's `core` revision, Q102), the history the backup's must equal up to
 *   its height and the build that must carry its versions and migrations (CF-1: the command's build with the file's
 *   user modules).
 * - **The chain** the checks read is the configuration's node (`core-block-fetch`'s node source on one node client, as
 *   `umbradb run` reads it): its genesis hash, its finalized block at the backup's height and, with `core-ledger-state`
 *   in the history, its ledger state root there. The node client retries an unreachable node as a process does
 *   (IN-10), each retry on stderr; Ctrl-C ends the command.
 * - **A private process's configuration** (its `core` entry has no `node`, CF-4; PP-12, owner decision Q153, task
 *   15.2a): its chain is its public database, read as the private process reads it (`openPublicSide` of
 *   `core-private-source`): a PostgreSQL `publicDatabase` directly, with reads only, else through the core's transport
 *   at `coreTransport`, whose `hello` gives an empty private database's position, S − 1 with no hash (PP-4); the
 *   transport's lines go to stderr. The restore checks the backup's binding and block against it
 *   (`src/backup/restore.ts`).
 * - **Refusals** (exit 1, nothing committed: the target as it was) are BK-3's codes, the configuration's own and the
 *   database's failures; a wrong argument prints the usage (exit 2). Every text passes through the redaction of the
 *   file's secrets (the database and node URLs among them) and any URL's credentials.
 */

import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { nodeSourceOf } from "../backbone/core-block-fetch/node-source.js";
import { nodeOptionsOf } from "../backbone/core-chain/core-chain.js";
import { openPublicSide, type PublicDatabase } from "../backbone/core-private-source/public-database.js";
import { type RestoreChain, type RestoreSeams, restoreBackup } from "../backup/restore.js";
import type { PlainObject } from "../config/plain-data.js";
import { redactor } from "../config/redact.js";
import { UmbraError } from "../db/errors.js";
import { NodeClient } from "../node/client.js";
import type { BlockSource } from "../runner/block-source.js";
import { type CommandConfig, commandTarget, openRestoreTarget, readCommandConfig } from "./configured.js";

/** `restore`'s arguments — one file, at most one `--config <file>`, nothing else —, or what is wrong with them. */
export function restoreArguments(args: readonly string[]): { readonly file: string; readonly config?: string } | string {
  const { tokens } = parseArgs({
    args: [...args],
    options: { config: { type: "string" } },
    allowPositionals: true,
    strict: false,
    tokens: true,
  });
  const files: string[] = [];
  const configs: (string | undefined)[] = [];
  for (const token of tokens) {
    if (token.kind === "positional") files.push(token.value);
    else if (token.kind === "option") {
      if (token.name !== "config") return `unknown option ${token.rawName} of restore`;
      configs.push(token.value);
    }
  }
  if (files.length !== 1) return "restore takes one backup file: umbradb restore <file> [--config <file>]";
  if (configs.length > 1) return "restore takes --config once";
  const [config] = configs;
  if (configs.length === 1 && (config === undefined || config === "")) return "--config takes a value: the configuration file";
  return config === undefined ? { file: files[0] as string } : { file: files[0] as string, config };
}

/** What the tests replace. */
export interface RestoreCommandSeams {
  /** The chain the checks read, in place of the configuration's node (an in-memory chain, a negative control's). */
  readonly source?: (config: CommandConfig) => BlockSource;
  /**
   * A private process's public database, in place of the one its configuration names (the tests' direct reads of a
   * PGlite core's database).
   */
  readonly publicDatabase?: (config: CommandConfig) => PublicDatabase;
  /** The restore's own seams (`RestoreSeams`). */
  readonly restore?: RestoreSeams;
}

/** What {@link runRestore} runs. */
export interface RestoreCommandOptions {
  readonly file: string;
  readonly config?: string | undefined;
  readonly cwd: string;
  /** Where the node client's retries are told. */
  readonly log?: (line: string) => void;
  /** Where what the restore did besides restoring is told: a PGlite directory it created (Q165 B, Q167 A). */
  readonly say?: (line: string) => void;
}

/** What `umbradb restore` restored, or why it did not. */
export type RestoreOutcome =
  | { readonly restored: true; readonly line: string }
  | { readonly restored: false; readonly error: unknown; readonly line: string };

/** What a restore's chain is, and what closes it. */
interface Chain {
  readonly chain: RestoreChain;
  close(): Promise<void>;
}

/**
 * The restore's chain (see the module comment): the configuration's node — one node client, `core-block-fetch`'s node
 * source over it —, or, for a private process's configuration, which has no `node`, its public database.
 */
function chainOf(config: CommandConfig, seams: RestoreCommandSeams, log: (line: string) => void): Chain {
  const options = nodeOptionsOf(config.core.settings as PlainObject);
  if (options === null) {
    if (seams.publicDatabase !== undefined) {
      return { chain: { publicDatabase: seams.publicDatabase(config) }, close: async () => undefined };
    }
    // The target is empty: its position is a private database's before its first commit (PP-4).
    const start = BigInt(config.checked.start);
    const side = openPublicSide(config.core, { position: () => ({ height: start - 1n, hash: null }), log });
    return {
      chain: { publicDatabase: side.publicDatabase },
      async close() {
        try {
          await side.publicDatabase.close();
        } finally {
          await side.transport?.close();
        }
      },
    };
  }
  if (seams.source !== undefined) return { chain: { source: seams.source(config) }, close: async () => undefined };
  const client = new NodeClient({
    ...options,
    onRetry: (retry) => log(`node retries in ${retry.delayMs} ms (${retry.operation}, attempt ${retry.attempt})`),
  });
  const source = nodeSourceOf(config.core, { nodeClient: client });
  return {
    chain: { source },
    async close() {
      await source.close();
      await client.close();
    },
  };
}

/** Runs the command (see the module comment); resolves with the line it prints. */
export async function runRestore(options: RestoreCommandOptions, seams: RestoreCommandSeams = {}): Promise<RestoreOutcome> {
  let redact = redactor([]);
  let close: (() => Promise<void>) | undefined;
  try {
    const config = await readCommandConfig({ file: options.config, cwd: options.cwd });
    redact = config.redact;
    const log = (line: string) => options.log?.(redact.text(`umbradb restore: ${line}`));
    const target = commandTarget(config, options.cwd);
    const { chain, close: closeChain } = chainOf(config, seams, log);
    close = closeChain;
    const file = resolve(options.cwd, options.file);
    const { manifest } = await restoreBackup(
      {
        file,
        target: target.backend === "postgres" ? { backend: "postgres" } : { backend: "pglite", exists: target.exists },
        open: () => openRestoreTarget(target, config, (line) => options.say?.(redact.text(`umbradb restore: ${line}`))),
        config: config.checked,
        declarations: config.declarations,
        ...chain,
      },
      seams.restore,
    );
    const next = BigInt(manifest.height) + 1n;
    const line =
      `umbradb restore: restored ${file}: height ${manifest.height}, contents hash ${manifest.contentsHash}; the ` +
      `database resumes from ${next}`;
    return { restored: true, line: redact.text(line) };
  } catch (error) {
    const what = error instanceof UmbraError ? `${error.code}: ${error.message}` : `failed: ${String(error)}`;
    return { restored: false, error, line: redact.text(`umbradb restore: ${what}`) };
  } finally {
    await close?.();
  }
}
