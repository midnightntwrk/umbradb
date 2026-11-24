import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Manifest } from "../../src/backup/manifest.js";
import { BACKUP_BACKENDS, type BackupBackend, type BackupDatabase } from "../backup/backup-fixtures.js";
import { type RestorableBackup, type RestoreBuild, restoreLedger } from "../backup/restore-ledger.js";
import { extendedCases, rootOf, TO_EMBEDDED } from "../ledger/fixtures/sweep-fixture.js";
import { entryOf } from "../runner/process-build.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { seenTables, sweepCore, sweepTape, sweepWatcher, type TableSnapshot } from "./ledger-graph-tapes.js";
import { restartAt } from "./ledger-restart.js";
import { fixtureProblems } from "./refcount-checks.js";
import {
  buildContentsHash,
  byteDigestsOf,
  byteHashedTables,
  bytesContentsHash,
  dagOptedOut,
  nodeSetOf,
} from "./refcount-contents.js";
import { type DagRun, runDag } from "./refcount-process.js";

/**
 * A backup of a database this build wrote, restored and run on, on PostgreSQL 18.6 and PGlite 0.5.10.
 *
 * The database: the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`) synced from genesis by the real
 * process with the build's `core-ledger-state` (`./refcount-process.ts`), and backed up by the process
 * (`ProcessHandle.backup`) at h = TO_EMBEDDED, the block that rewrites `rewrite to-embedded` to embed its small child:
 * the backup's queue holds that leaf, which only the old child list referenced, beside the root released at h. It is
 * restored by `restoreBackup` with the same build (`../backup/restore-ledger.ts`); then a new process runs on the
 * restored database to h + 50, its worker loading the state at h from it, and it is compared with a run that never
 * stopped, on a database of its own:
 * - the restored database at h is the backed-up one, every table of `core_ledger_state` as it was;
 * - passes after every block, the run before the backup and the run after the restore taken together
 *   (`./refcount-checks.ts`: the queue the restored database holds at h is deleted at h + 1);
 * - after every block from h to h + 50 the node set and every `core_ledger_state` table that is not content-defined
 *   equal the uninterrupted run's; at h + 50, every table the contents hash takes by its bytes, and the contents hash.
 */

/** The height the backup is taken at. */
const H = TO_EMBEDDED;
/** The height the restored database is run to. */
const END = H + 50;
const DAG = "extended";

/** The fixture's chain to {@link END}: every run's. */
const RECORDS = sweepTape(END, DAG).records;
/** The restore's node: the chain with the header and metadata of the backup's block, which the restore reads. */
const RESTORE_NODE = restartAt(RECORDS, BigInt(H));

/** The build: the ledger's core modules and the DAG's watcher, besides the ingest's own, as the runs have them. */
const RESTORE_BUILD: RestoreBuild = { core: sweepCore(), entry: (module) => entryOf(module, 0), user: [sweepWatcher(seenTables())] };
const OPTED_OUT = dagOptedOut();

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** A table snapshot as text: every row with its child list, counts, root counts, queue, states and table digests. */
const snapshotText = (tables: TableSnapshot | undefined): string =>
  JSON.stringify(tables, (_key, value: unknown) =>
    value instanceof Uint8Array ? hex(value) : value instanceof Map || value instanceof Set ? [...value] : typeof value === "bigint" ? `${value}` : value,
  );

describe.each(BACKUP_BACKENDS)("a backup of the counting build's database restores and runs on, on $name", (backend: BackupBackend) => {
  let dir: string;
  /** The run to h that was backed up, its backup's file and manifest, and the database. */
  let before: DagRun;
  let file: string;
  let manifest: Manifest;
  let source: BackupDatabase;

  beforeAll(async () => {
    await backend.start();
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
    dir = mkdtempSync(join(tmpdir(), "umbradb-refcount-backup-"));
    file = join(dir, "dag.backup");
    source = await backend.database();
    before = await runDag(source, {
      dag: DAG,
      last: H,
      atLast: async (run) => {
        ({ manifest } = await run.handle.backup(file));
      },
    });
  }, PATIENCE_MS * 2);

  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
    await backend.stop();
  }, 120_000);

  /** The backup, its file `at`. */
  const backupAt = (at: string): RestorableBackup => ({ file: at, scenario: { records: RECORDS } });

  /** Restores `at` into a new target with the build: what the restore gave (or threw), and the target. */
  async function restoreInto(at: string): Promise<{ readonly outcome: unknown; readonly target: BackupDatabase }> {
    const target = await backend.database();
    const outcome = await restoreLedger(backend, target, backupAt(at), RESTORE_NODE, {}, undefined, RESTORE_BUILD).then(
      (restored) => restored,
      (error: unknown) => error,
    );
    return { outcome, target };
  }

  it(
    "the backup taken at h restores, and the restored database continues to h + 50 with R3 passing and its node " +
      "set, byte-hashed tables and contents hash equal to an uninterrupted run's",
    async () => {
      expect(before.status, "the run backed up").toMatchObject({ cursor: BigInt(H), reason: null });
      expect(manifest.height).toBe(`${H}`);
      // The build's hash takes the node tables by their content, not the bytes'.
      const byContent = await buildContentsHash(source, OPTED_OUT);
      expect(await bytesContentsHash(source, OPTED_OUT)).not.toBe(byContent);
      // The backup holds a queue: the root released at h and the leaf only the old child list referenced.
      const queued = hex(extendedCases(H).toEmbedded.small.key);
      expect(before.tables.get(BigInt(H))?.queue.has(queued)).toBe(true);
      expect(before.tables.get(BigInt(H))?.queue.has(hex(rootOf(H - 1, DAG).slice(1)))).toBe(true);

      const restored = await restoreInto(file);
      expect(restored.outcome).toMatchObject({ manifest: { height: `${H}` } });
      expect(await buildContentsHash(restored.target, OPTED_OUT)).toBe(byContent);

      // A new process on the restored database, to h + 50; and a run that never stopped.
      const after = await runDag(restored.target, { dag: DAG, resume: BigInt(H), last: END });
      expect(after.status, "the run on the restored database").toMatchObject({ cursor: BigInt(END), reason: null });
      const uninterrupted = await backend.database();
      const whole = await runDag(uninterrupted, { dag: DAG, last: END });
      expect(whole.status, "the uninterrupted run").toMatchObject({ cursor: BigInt(END), reason: null });

      // The restored database at h is the backed-up one.
      expect(snapshotText(after.tables.get(BigInt(H)))).toBe(snapshotText(before.tables.get(BigInt(H))));
      // The queue it restored is deleted at h + 1.
      expect(after.tables.get(BigInt(H + 1))?.rows.has(queued)).toBe(false);

      // R3 after every block: the run to h and, from h on, the run on the restored database.
      const tables = new Map([...before.tables].filter(([height]) => height < BigInt(H)));
      for (const [height, snapshot] of after.tables) tables.set(height, snapshot);
      const batches = new Map([...before.batches, ...after.batches]);
      expect([...tables.keys()]).toEqual(Array.from({ length: END + 1 }, (_, height) => BigInt(height)));
      expect(fixtureProblems(DAG, tables, batches, END)).toEqual([]);
      expect(fixtureProblems(DAG, whole.tables, whole.batches, END)).toEqual([]);

      // After every block from h: the node set and the core_ledger_state tables taken by their bytes.
      for (let height = BigInt(H); height <= BigInt(END); height++) {
        const [got, want] = [after.tables.get(height) as TableSnapshot, whole.tables.get(height) as TableSnapshot];
        expect(nodeSetOf(got), `the node set after ${height}`).toEqual(nodeSetOf(want));
        expect(byteDigestsOf(got), `the byte-hashed core_ledger_state tables after ${height}`).toEqual(byteDigestsOf(want));
      }
      // At h + 50: every table the contents hash takes by its bytes, and the contents hash.
      const tablesAfter = await byteHashedTables(restored.target, OPTED_OUT);
      expect(tablesAfter.has("core_ledger_state.root_counts")).toBe(true);
      expect(tablesAfter.has("core_ledger_state.nodes")).toBe(false);
      expect(tablesAfter).toEqual(await byteHashedTables(uninterrupted, OPTED_OUT));
      expect(await buildContentsHash(restored.target, OPTED_OUT)).toBe(await buildContentsHash(uninterrupted, OPTED_OUT));
    },
    PATIENCE_MS * 4,
  );
});
