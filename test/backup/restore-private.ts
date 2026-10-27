import { setTimeout as sleep } from "node:timers/promises";
import { privateCursorHeight, privateIntake } from "../../src/backbone/core-private-source/index.js";
import type { Manifest } from "../../src/backup/manifest.js";
import type { PublicDatabase } from "../../src/backbone/core-private-source/index.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import { type RestoreCommandSeams, type RestoreOutcome, runRestore } from "../../src/cli/restore.js";
import { loadConfig } from "../../src/config/load.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import type { CliProject } from "../cli/cli-fixtures.js";
import { genesisHex, type PublicCore, startPublicCore, TEST_LEDGER_TABLE } from "../private/builds.js";
import { startProcess } from "../runner/process-build.js";
import { type BackupBackend, type BackupDatabase, PATIENCE_MS } from "./backup-fixtures.js";

/**
 * What the restores of a private process's backup share (task 15.2a; BK-3, BK-4, PP-2, PP-12, owner decision Q153;
 * A164), on PostgreSQL 18.6 and PGlite 0.5.10.
 *
 * **The public side** is a public core of `../private/builds.ts` (`startPublicCore`: the in-memory chain, the custom
 * network {@link genesisHex}(0xa1) unless another is given), on a database of the backend. A private process reads it
 * as in production: on PostgreSQL directly, its `publicDatabase` the public database's URL; on PGlite, which only the
 * core opens, through the core's process transport (`coreTransport`, the core's `listen.transport`).
 *
 * **A private process** is started from a configuration file of a command project, as `umbradb run` starts one
 * (`src/cli/run.ts`: the command's private build with one intake, its source the intake's), so that `umbradb restore`
 * reads the same file and build: its `core` entry and one private module `pm` ({@link pmModule}, `../private/builds.ts`'s
 * `privateModule` as a module file declares it), which requires the public `table` item `blocks` and stores, at each
 * height, the public block's hash it read with its data setting `salt`.
 */

/** The module `pm` as a module file declares it (see the module comment), importing `defineModule` from `builders`. */
export function pmModule(builders: string): string {
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    "export const pm = defineModule({",
    '  id: "pm",',
    '  version: "1.0.0",',
    '  side: "private",',
    '  requires: ["blocks"],',
    "  provides: [",
    '    { name: "pm-public", lifetimes: ["block"] },',
    '    { name: "pm-rows", lifetimes: ["table"], table: { schema: "pm", tables: ["rows"], kind: "append-only" } },',
    "  ],",
    "  startsMidChain: true,",
    '  configSchema: z.object({ salt: z.number().int().default(0).meta({ kind: "data" }) }),',
    "  migrations: [",
    '    { id: "001", sql: "CREATE TABLE pm.rows (height bigint PRIMARY KEY, public_hash bytea NOT NULL, salt bigint NOT NULL)" },',
    "  ],",
    "  points: {",
    '    async "on-fetch"(_p, b, out, read) {',
    '      if (read === undefined) throw new Error("pm\'s on-fetch got no read of public data");',
    '      const [row] = await read.query("SELECT hash FROM core_block_commit.blocks WHERE height = $1", [b.height]);',
    "      if (row === undefined) throw new Error(`no public block at ${b.height}`);",
    '      out.put("pm-public", row.hash);',
    "    },",
    '    async "on-db-write"(_p, b, w) {',
    '      await w.execute("INSERT INTO pm.rows (height, public_hash, salt) VALUES ($1, $2, $3)", [',
    "        b.height,",
    '        b.items.get("pm-public"),',
    "        b.settings.salt,",
    "      ]);",
    "    },",
    "  },",
    "});",
    "",
  ].join("\n");
}

/** Where a private process reads its public database: a PostgreSQL URL (`publicDatabase`) or the core's transport. */
export type PublicSetting = { readonly publicDatabase: string } | { readonly coreTransport: string };

/** What a private configuration file of these tests holds. */
export interface PrivateConfig {
  /** The private database's `database` setting. */
  readonly database: string;
  /** S of the private process (its `core` entry and `pm`). */
  readonly start: number;
  readonly public: PublicSetting;
  /** The instance id; `instance-1` unless given. */
  readonly instanceId?: string;
}

let files = 0;

/** `pm`'s data setting in every configuration of these tests. */
export const SALT = 7;

/** Writes a private configuration file (under its own name) that exports `modules = [pm]`; returns its path. */
export function writePrivateConfig(project: CliProject, options: PrivateConfig): string {
  files += 1;
  const core = JSON.stringify({
    network: "custom",
    genesisHash: genesisHex(0xa1),
    ledgerTable: TEST_LEDGER_TABLE,
    database: options.database,
    instanceId: options.instanceId ?? "instance-1",
    developmentOptIn: true,
    ...options.public,
  });
  return project.write(
    `private-restore-${files}.config.ts`,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
      'import { pm } from "./pm.ts";',
      "export const modules = [pm];",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: ${options.start}, config: ${core} }),`,
      `    pm.entry({ start: ${options.start}, config: { salt: ${SALT} } }),`,
      "  ],",
      "});",
      "",
    ].join("\n"),
  );
}

/** A private process started from a configuration file (see the module comment). */
export interface FileProcess {
  readonly handle: ProcessHandle;
  readonly lines: string[];
  /** Waits until the private cursor is `height`; rejects if processing ends first or `PATIENCE_MS` passes. */
  reach(height: bigint): Promise<void>;
}

/** Starts the private process of the configuration file `file`, as `umbradb run` starts one (see the module comment). */
export async function startPrivateFile(file: string): Promise<FileProcess> {
  const loaded = await loadConfig({ file });
  const intake = privateIntake();
  const lines: string[] = [];
  const handle = startProcess({
    declarations: commandBuild(loaded.modules, { side: "private", intake }),
    config: { data: loaded.data, file: loaded.file },
    source: (core, shared) => intake.source(core, shared),
    side: "private",
    log: (line) => lines.push(line),
  });
  return {
    handle,
    lines,
    async reach(height) {
      const deadline = Date.now() + PATIENCE_MS;
      for (;;) {
        const status = handle.status();
        if (status.cursor !== null && status.cursor >= height) return;
        if (status.ended !== null) throw new Error(`processing ended (${status.ended.kind}) at ${String(status.cursor)}: ${lines.join(" | ")}`);
        if (Date.now() > deadline) throw new Error(`the private cursor is ${String(status.cursor)}, not ${height}, after ${PATIENCE_MS} ms`);
        await sleep(10);
      }
    },
  };
}

/** A public core of a test and where a private process reads it. */
export interface PublicSide {
  readonly core: PublicCore;
  readonly setting: PublicSetting;
  readonly db: BackupDatabase;
}

/** What {@link startPublicSide} varies: S, the head, the network's genesis hash and the chain's own blocks. */
export interface PublicSideOptions {
  readonly start?: number;
  readonly head: bigint;
  readonly genesisHash?: string;
  readonly blocks?: readonly BlockRef[];
}

/** How long a core's transport may take to listen. */
const LISTEN_MS = 60_000;

/** Starts a public core on a new database of `backend` (see the module comment); on PGlite with its transport. */
export async function startPublicSide(backend: BackupBackend, options: PublicSideOptions): Promise<PublicSide> {
  const db = await backend.database();
  const pglite = backend.kind === "pglite";
  const core = await startPublicCore({
    database: db.setting,
    head: options.head,
    start: options.start ?? 1,
    ...(options.genesisHash === undefined ? {} : { genesisHash: options.genesisHash }),
    ...(options.blocks === undefined ? {} : { blocks: options.blocks }),
    ...(pglite ? { extra: { listen: { transport: "127.0.0.1:0" } } } : {}),
  });
  try {
    const setting = pglite ? { coreTransport: await core.transportWithin(LISTEN_MS) } : { publicDatabase: db.setting };
    return { core, setting, db };
  } catch (error) {
    await core.stop();
    throw error;
  }
}

/** `umbradb restore <file> --config <config>`'s own work (`runRestore`) in `project`, its lines kept. */
export async function restorePrivate(
  project: CliProject,
  file: string,
  config: string,
  seams: RestoreCommandSeams = {},
): Promise<RestoreOutcome & { readonly lines: readonly string[] }> {
  const lines: string[] = [];
  const outcome = await runRestore({ file, config, cwd: project.dir, log: (line) => lines.push(line) }, seams);
  return { ...outcome, lines };
}

/** The contents hash of a private database as `0x` hex (no table of `pm` is declared `deterministic: false`). */
export async function privateHashOf(db: BackupDatabase): Promise<string> {
  const hash = await db.read((read) => contentsHash(read, { optedOut: [] }), privateCursorHeight);
  return `0x${Buffer.from(hash).toString("hex")}`;
}

/** The heights `pm.rows` holds, as text, in order, and the private cursor's. */
export async function privateRows(db: BackupDatabase): Promise<{ readonly heights: string[]; readonly cursor: string | null }> {
  return db.read(async (read) => {
    // Ordered by the column, not by its text (an output column's name would win in ORDER BY).
    const rows = await read.query("SELECT height::text AS shown FROM pm.rows ORDER BY height");
    const [cursor] = await read.query("SELECT height::text AS shown FROM core_private_source.cursor");
    return { heights: rows.map((row) => row.shown as string), cursor: (cursor?.shown as string | undefined) ?? null };
  }, privateCursorHeight);
}

/** A public database as a direct read of `db` (a PGlite one no process holds): the restore's `publicDatabase` seam. */
export function publicDatabaseOf(db: BackupDatabase): PublicDatabase {
  return { read: (body) => db.read(body), close: async () => undefined };
}

/** The private S, the backup's height and the head the restored process continues to, in these tests. */
export const PRIVATE_START = 3;
export const BACKUP_HEIGHT = 12n;
export const CONTINUED_HEAD = 40n;

/** The heights `from` to `to` as text. */
export const heightsFrom = (from: bigint, to: bigint): string[] =>
  Array.from({ length: Number(to - from + 1n) }, (_, i) => String(from + BigInt(i)));

/** A private process's backup of these tests and the public core it was taken against (see {@link privateBackup}). */
export interface PrivateBackup {
  /** Its public core: S 1, at {@link BACKUP_HEIGHT} until a test raises it. */
  readonly bound: PublicSide;
  readonly file: string;
  readonly manifest: Manifest;
}

/**
 * A private process's backup at {@link BACKUP_HEIGHT} on `backend`, written into `file` by the process itself under
 * the development opt-in its `core` entry sets (PP-12): a public core from S 1 to the height, the private process from
 * {@link PRIVATE_START} to it, its `backup`, then its stop. The public core keeps running (the caller stops it).
 */
export async function privateBackup(project: CliProject, backend: BackupBackend, file: string): Promise<PrivateBackup> {
  const bound = await startPublicSide(backend, { head: BACKUP_HEIGHT });
  try {
    const db = await backend.database();
    const config = writePrivateConfig(project, { database: db.setting, start: PRIVATE_START, public: bound.setting });
    const running = await startPrivateFile(config);
    try {
      await running.reach(BACKUP_HEIGHT);
      const { manifest } = await running.handle.backup(file);
      return { bound, file, manifest };
    } finally {
      await running.handle.stop();
    }
  } catch (error) {
    await bound.core.stop();
    throw error;
  }
}
