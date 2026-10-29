import { mkdtempSync, rmSync } from "node:fs";
import type { PostgresParts } from "../../src/config/database-parts.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/index.js";
import type { Manifest } from "../../src/backup/manifest.js";
import { type Restored, restoreBackup } from "../../src/backup/restore.js";
import { plainData } from "../../src/config/plain-data.js";
import { validateConfig } from "../../src/config/validate.js";
import { openPostgres } from "../../src/db/postgres.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { NodeClient } from "../../src/node/client.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { NETWORK_ID, RAW } from "../ledger/adapter-fixtures.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { committed, genesisOf, ingest, PATIENCE_MS, watched, watcher } from "./ingest-harness.js";
import { cappedAt, LEDGER_CORE, restartAt } from "./ledger-restart.js";
import { type RetentionSeen, retentionWatcher } from "./ledger-storage-checks.js";
import { type LedgerScenario, ledgerScenario } from "./ledger-tapes.js";

/**
 * The retention-window long run, shared by `ledger-window.test.ts`, sized to fit a loaded machine. v9's empty blocks
 * from genesis, with `retainStates` 1,000 and the sweep off:
 * - synced through the real process on PGlite to {@link BACKUP_AT}, and backed up there by the process
 *   (`ProcessHandle.backup`, `pglite-tools`' `pg_dump`);
 * - then continued to the head on that PGlite database (a restart, which loads the state at the cursor);
 * - and continued to the head on PostgreSQL, from the same backup restored into an empty PostgreSQL database with
 *   `umbradb restore`'s own code. A PGlite backup restores on PostgreSQL, and a restored database continues like one
 *   that never stopped.
 *
 * On PostgreSQL every block costs several statements through Docker's port proxy, so this way it processes only the
 * window's last blocks and its loads at cursor 5,000, not 5,000 blocks. The configuration is the same throughout: the
 * ledger's core modules, and a retention watcher loading the planned heights at 5,001's `on-compute`.
 * [A103, LG-12, BK-2, BK-4, Q122]
 */

/** The heights of the run: the head, and the backup's. */
export const HEAD = 5_001n;
export const BACKUP_AT = 4_990n;

/** The run's settings: `retainStates` 1,000; the sweep off, since the window does not depend on it. [A103] */
export const WINDOW_SETTINGS = Object.freeze({ retainStates: 1_000, sweep: "off" });

/**
 * At 5,001's `on-compute` the read is at the cursor 5,000: the loads the window check asks for, and two more outside
 * the window. [A103]
 */
export const WINDOW_PLAN: ReadonlyMap<bigint, readonly bigint[]> = new Map([[HEAD, [4_000n, 3_999n, 5_000n, 5_001n, 0n]]]);

/** The scenario: v9's empty blocks from genesis to {@link HEAD}, roots only. */
export function windowScenario(): Promise<LedgerScenario> {
  return ledgerScenario({
    ledger: "v9",
    genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks: Array.from({ length: Number(HEAD) + 1 }, () => []),
    rootsOnly: true,
  });
}

/** The ingest options of every run: the ledger's core modules from 0, the settings, the watcher recording into `seen`. */
const runOptions = (seen: RetentionSeen) => ({ start: 0n, core: LEDGER_CORE, settings: WINDOW_SETTINGS, user: [retentionWatcher(seen, WINDOW_PLAN)] });

/** A backup written by the process at {@link BACKUP_AT}: its file, in a directory of its own, and its manifest. */
export interface WindowBackup {
  readonly file: string;
  readonly manifest: Manifest;
  /** Removes the backup's directory. */
  remove(): void;
}

/** Syncs `scenario` on `db` to {@link BACKUP_AT} over a tape capped there, and backs it up there through the process. */
export async function syncAndBackUp(db: ProcessDatabase, scenario: LedgerScenario, seen: RetentionSeen): Promise<WindowBackup> {
  const run = await ingest(db, cappedAt(scenario.records, BACKUP_AT), runOptions(seen));
  const directory = mkdtempSync(join(tmpdir(), "umbradb-a103-backup-"));
  const file = join(directory, "a103.backup");
  try {
    await committed(run, BACKUP_AT, PATIENCE_MS * 4);
    const { manifest } = await run.handle.backup(file);
    return { file, manifest, remove: () => rmSync(directory, { recursive: true, force: true }) };
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  } finally {
    await run.close();
  }
}

/** Continues `db` from its cursor to {@link HEAD}; the status at the head and the process's log. */
export async function continueToHead(db: ProcessDatabase, scenario: LedgerScenario, seen: RetentionSeen) {
  // The tape with the cursor's header and metadata, which the restarted process reads (`./ledger-restart.ts`). [Q135 A]
  const run = await ingest(db, restartAt(scenario.records, BACKUP_AT), runOptions(seen));
  try {
    await committed(run, HEAD, PATIENCE_MS * 2);
    return { status: run.handle.status(), lines: run.lines };
  } finally {
    await run.close();
  }
}

/**
 * Restores `backup` into the empty PostgreSQL database `target` with `umbradb restore`'s code (`restoreBackup`), with
 * the configuration and build every run of {@link syncAndBackUp} had. `restoreBackup` runs:
 * - the restore checks against a tape node serving the scenario, whose finalized head is at the backup's height;
 * - the file's statements in one transaction;
 * - a comparison of the contents hash and the stored state root.
 * [BK-3]
 */
export async function restoreOnPostgres(target: ProcessDatabase, backup: WindowBackup, scenario: LedgerScenario, seen: RetentionSeen): Promise<Restored> {
  const user: ModuleDeclaration[] = [watcher(watched()), retentionWatcher(seen, WINDOW_PLAN)];
  const declarations = validateDeclarations(chainDeclarations(user, { core: LEDGER_CORE }));
  const extra = { node: "ws://127.0.0.1:9/node", genesisHash: genesisOf(scenario.records) as string, ...WINDOW_SETTINGS };
  const entries = [core(target.setting, 0, { extra }), ...LEDGER_CORE.map((module) => entryOf(module, 0)), ...user.map((module) => entryOf(module, 0))];
  const config = validateConfig({ config: { file: undefined, data: plainData({ entries }, undefined) }, declarations, side: "public" });
  // The tape with its finalized head at the backup's height, as the node was when the backup was taken.
  const node = await TapeNode.start({ records: cappedAt(scenario.records, BACKUP_AT) as TapeRecord[] });
  const client = new NodeClient({ url: node.url });
  const source = nodeSourceOf({ settings: { prefetchWindow: 64, tipCap: 600 } }, { nodeClient: client });
  try {
    return await restoreBackup({
      file: backup.file,
      target: { backend: "postgres" },
      open: async () => {
        const { kind: _kind, ...connection } = target.setting as PostgresParts;
        return openPostgres({ connection, committedHeight: cursorHeight });
      },
      config,
      declarations,
      source,
    });
  } finally {
    await source.close?.();
    await client.close();
    await node.close();
  }
}
