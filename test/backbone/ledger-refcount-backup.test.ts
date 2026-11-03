import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Manifest } from "../../src/backup/manifest.js";
import { isEmptyDatabase } from "../../src/backup/restore.js";
import { BACKUP_BACKENDS, type BackupBackend, type BackupDatabase, pathOf } from "../backup/backup-fixtures.js";
import { type RestorableBackup, type RestoreBuild, restoreLedger } from "../backup/restore-ledger.js";
import { extendedCases, rootOf, TO_EMBEDDED } from "../ledger/fixtures/sweep-fixture.js";
import { entryOf } from "../runner/process-build.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { restartAt } from "./ledger-restart.js";
import { fixtureProblems, referencesOf } from "./refcount-checks.js";
import {
  buildContentsHash,
  byteDigestsOf,
  byteHashedTables,
  bytesContentsHash,
  dagOptedOut,
  nodeSetOf,
} from "./refcount-contents.js";
import { type DagRun, runDag } from "./refcount-process.js";
import { seenTables, sweepCore, sweepTape, sweepWatcher, type TableSnapshot } from "./sweep-tapes.js";

/**
 * R15: a backup of a database this build wrote, restored and run on, on PostgreSQL 18.6 and PGlite 0.5.10.
 * [R15, BK-3, DT-3, LG-11]
 *
 * The database: the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`) synced from genesis by the real
 * process with the build's `core-ledger-state` (`./refcount-process.ts`), and backed up by the process
 * (`ProcessHandle.backup`) at h = TO_EMBEDDED, the block that rewrites `rewrite to-embedded` to embed its small child:
 * the backup's queue holds that leaf, which only the old child list referenced, beside the root released at h. It is
 * restored by `restoreBackup` with the same build (`../backup/restore-ledger.ts`), whose contents-hash step takes
 * `nodes` by its node set and checks `ref_counts` and `unreferenced` against the rows; then a new process runs on the
 * restored database to h + 50, its worker loading the state at h from it, and it is compared with a run that never
 * stopped, on a database of its own:
 * - the restored database at h is the backed-up one, every table of `core_ledger_state` as it was;
 * - R3 passes after every block, the run before the backup and the run after the restore taken together
 *   (`./refcount-checks.ts`: the queue the restored database holds at h is deleted at h + 1);
 * - after every block from h to h + 50 the node set and every `core_ledger_state` table that is not content-defined
 *   equal the uninterrupted run's; at h + 50, every table the contents hash takes by its bytes, and the contents hash.
 *
 * Negative controls, each a variant of the backup's file restored into an empty target: without its `ref_counts`
 * rows; without one row of `nodes` — one a stored child list references, the root persisted at h, the queued leaf —
 * whose reference, root count or queue entry names it. Each is refused with `ledger-refcount-invalid`, reason
 * `tables-inconsistent`, and the restore rolls back, leaving the target empty. One byte of a `nodes` row's payload
 * changed is refused the same way (`details.check` `node-key`) by `../backup/restore-content-defined.test.ts` (A126),
 * on the ledger chain's backup.
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

const NODES_LINE = /^INSERT INTO core_ledger_state\.nodes VALUES \('\\x([0-9a-f]{64})', '\\x([0-9a-f]*)', '\\x([0-9a-f]*)'\);$/;
const REF_COUNTS_LINE = /^INSERT INTO core_ledger_state\.ref_counts VALUES \('\\x([0-9a-f]{64})', (\d+)\);$/;
const ROOT_COUNTS_LINE = /^INSERT INTO core_ledger_state\.root_counts VALUES \('\\x([0-9a-f]{64})', (\d+)\);$/;
const UNREFERENCED_LINE = /^INSERT INTO core_ledger_state\.unreferenced VALUES \('\\x([0-9a-f]{64})'\);$/;

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The keys of the file's lines matching `line`, in byte order. */
const keysOf = (text: string, line: RegExp): string[] =>
  text
    .split("\n")
    .flatMap((each) => line.exec(each)?.[1] ?? [])
    .sort();

/** The file's `nodes` rows: each key's child list. */
const fileRows = (text: string): Map<string, Uint8Array> =>
  new Map(
    text.split("\n").flatMap((each) => {
      const found = NODES_LINE.exec(each);
      return found === null ? [] : [[found[1] as string, Uint8Array.from(Buffer.from(found[3] as string, "hex"))] as const];
    }),
  );

/** `text` without the lines `drop` matches. */
const without = (text: string, drop: (line: string) => boolean): string =>
  text
    .split("\n")
    .filter((line) => !drop(line))
    .join("\n");

/** `ledger-refcount-invalid` with reason `tables-inconsistent`, naming `check` and `key`. */
const inconsistent = (check: string, key: string) =>
  expect.objectContaining({ code: "ledger-refcount-invalid", details: { reason: "tables-inconsistent", check, key: `0x${key}` } });

/** A table snapshot as text: every row with its child list, counts, root counts, queue, states and table digests. */
const snapshotText = (tables: TableSnapshot | undefined): string =>
  JSON.stringify(tables, (_key, value: unknown) =>
    value instanceof Uint8Array ? hex(value) : value instanceof Map || value instanceof Set ? [...value] : typeof value === "bigint" ? `${value}` : value,
  );

describe.each(BACKUP_BACKENDS)("R15 (BK-3, DT-3): a backup of the counting build's database restores and runs on, on $name", (backend: BackupBackend) => {
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

  /** True when `target` holds nothing (a PGlite directory never created is empty). */
  async function empty(target: BackupDatabase): Promise<boolean> {
    if (backend.kind === "pglite" && !existsSync(join(pathOf(target.setting), "PG_VERSION"))) return true;
    return target.read((read) => isEmptyDatabase(read), async () => null);
  }

  let variants = 0;
  /** The backup's file with `text` in its place. */
  const variant = (text: string): string => {
    const at = join(dir, `variant-${++variants}.backup`);
    writeFileSync(at, text);
    return at;
  };

  it(
    "R15: the backup taken at h restores (its contents-hash step passes: the node set compared, ref_counts and " +
      "unreferenced checked against the rows), and the restored database continues to h + 50 with R3 passing and its " +
      "node set, byte-hashed tables and contents hash equal to an uninterrupted run's",
    async () => {
      expect(before.status, "the run backed up").toMatchObject({ cursor: BigInt(H), reason: null });
      expect(manifest.height).toBe(`${H}`);
      // The backup's hash is the build's, which takes the node tables by their content, not the bytes'.
      const byContent = await buildContentsHash(source, OPTED_OUT);
      expect(manifest.contentsHash).toBe(byContent);
      expect(await bytesContentsHash(source, OPTED_OUT)).not.toBe(byContent);
      // The backup holds a queue: the root released at h and the leaf only the old child list referenced.
      const queued = hex(extendedCases(H).toEmbedded.small.key);
      expect(before.tables.get(BigInt(H))?.queue.has(queued)).toBe(true);
      expect(before.tables.get(BigInt(H))?.queue.has(hex(rootOf(H - 1, DAG).slice(1)))).toBe(true);

      const restored = await restoreInto(file);
      expect(restored.outcome).toMatchObject({ manifest: { height: `${H}`, contentsHash: byContent } });
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

  it(
    "R15 negative control: a backup whose file lacks the ref_counts rows is refused by the restore (its contents-hash " +
      "step fails with ledger-refcount-invalid, reason tables-inconsistent) and the restore rolls back",
    async () => {
      const text = readFileSync(file, "utf8");
      const counted = keysOf(text, REF_COUNTS_LINE);
      expect(counted.length).toBeGreaterThan(10);
      const lacking = without(text, (line) => REF_COUNTS_LINE.test(line));
      expect(keysOf(lacking, REF_COUNTS_LINE)).toEqual([]);
      const refused = await restoreInto(variant(lacking));
      // The stored child lists reference every key ref_counts held; the first in byte order is named.
      expect(refused.outcome).toEqual(inconsistent("counts", counted[0] as string));
      expect(await empty(refused.target)).toBe(true);
    },
    PATIENCE_MS,
  );

  /** The backup's file: its `nodes` rows, and the keys of its counts, root counts and queue. */
  interface FileEntries {
    readonly rows: ReadonlyMap<string, Uint8Array>;
    readonly counted: readonly string[];
    readonly roots: readonly string[];
    readonly queue: readonly string[];
  }

  /**
   * The rows of `nodes` the control leaves out, each with the entry that names it and the check that finds it: a row a
   * stored child list references (no root, not queued), the root persisted at h (no reference), and the queued leaf
   * (whose child list references nothing).
   */
  const MISSING: readonly (readonly [string, "closure" | "roots" | "queue", (file: FileEntries) => string])[] = [
    ["a row a stored child list references", "closure", (file) => file.counted.find((key) => file.rows.has(key) && !file.roots.includes(key)) as string],
    ["the root persisted at h", "roots", () => hex(rootOf(H, DAG).slice(1))],
    ["the queued leaf", "queue", () => hex(extendedCases(H).toEmbedded.small.key)],
  ];

  it.each(MISSING)(
    "R15 negative control: a backup whose file lacks one row of nodes, %s, is refused the same way, the entry naming " +
      "the missing node (%s): ledger-refcount-invalid, reason tables-inconsistent, the restore rolled back",
    async (what, check, choose) => {
      const text = readFileSync(file, "utf8");
      const entries: FileEntries = {
        rows: fileRows(text),
        counted: keysOf(text, REF_COUNTS_LINE),
        roots: keysOf(text, ROOT_COUNTS_LINE),
        queue: keysOf(text, UNREFERENCED_LINE),
      };
      const key = choose(entries);
      // The row is in the file, and the entry that names it.
      expect(entries.rows.has(key), what).toBe(true);
      const named = { closure: entries.counted, roots: entries.roots, queue: entries.queue }[check];
      expect(named.includes(key), what).toBe(true);
      if (check === "roots") expect(entries.counted.includes(key), what).toBe(false);
      if (check === "queue") expect(referencesOf(entries.rows.get(key) as Uint8Array), what).toEqual([]);

      const lacking = without(text, (line) => NODES_LINE.exec(line)?.[1] === key);
      expect(fileRows(lacking).size, what).toBe(entries.rows.size - 1);
      const refused = await restoreInto(variant(lacking));
      expect(refused.outcome, what).toEqual(inconsistent(check, key));
      expect(await empty(refused.target), what).toBe(true);
    },
    PATIENCE_MS,
  );
});
