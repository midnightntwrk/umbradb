import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { CORE_LEDGER_STATE_ID, type KeptBlock, LEDGER_STATE_ITEM, type LedgerStateItem } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { type CoreRevision, retainedFrom } from "../../src/backbone/core-ledger-state/retention.js";
import type { PostgresParts } from "../../src/config/database-parts.js";
import { UmbraError } from "../../src/db/errors.js";
import type { Database } from "../../src/db/api.js";
import { WRITER_LOCK_CLASS, WRITER_LOCK_KEY } from "../../src/db/writer-lock.js";
import type { LedgerName } from "../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type CommitFault, CommitProxy } from "../runner/commit-proxy.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../runner/process-backends.js";
import {
  type BeforeRun,
  beforeRun,
  changedRowProblems,
  heightsFrom,
  keyOf,
  loadedKeys,
  readsAt,
  readsOf,
  rowDifferences,
  storedKeys,
} from "./block-before.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runProblems } from "./refcount-process.js";

/**
 * `core-ledger-state` and `core-block-commit` take the block before from what they kept of it in memory when the block
 * continues it (`b.continues`) and the kept block is the one at h − 1, through the real process on PostgreSQL 18 and
 * PGlite 0.5.10, with the extended DAG fixture (`./block-before.ts`). The statements each of their callbacks sends are
 * recorded through the handle it is given. So:
 * - an uninterrupted run reads nothing of the block before (heights 0 to 6: 0 is S, which has none): not
 *   `core-ledger-state`'s state at h − 1, parent time or released keys at `on-compute`, nor `core-block-commit`'s
 *   parent hash at `on-db-write`; each `on-compute` still has the worker hold the state the database stores at h − 1;
 * - every table after every height equals a run with the memory off (`continues` false at every height), which sends
 *   those four reads at every height above 0;
 * - the first height of a run reads them, and the heights after it do not: after a `COMMIT` lost before it landed (h
 *   made again) or after it landed (h + 1), after a failure at h's `on-compute` (the kept block is h − 1 then, and
 *   `continues` false), after one at h's `on-db-write` (the kept block is h), after a restart, and on PostgreSQL after a
 *   `COMMIT` whose backend a proxy terminated before or after it was forwarded;
 * - a height whose kept block is not h − 1 reads them even if its block context says `continues` (a loop whose seam
 *   says so after a rollback);
 * - after a `COMMIT` of h − 1 lost after it landed, with the state key stored at h − 1 changed while the process was
 *   away, h, the run's first height, reads the changed row, has the worker load the key the database holds, and halts
 *   at the root check after the load: what was kept is not used once a run starts again;
 * - with `retainStates` 2, a run's first height reads the keys of the retention window once (the one it releases and
 *   those the next blocks release), and no height that continues it reads a key;
 * - with the checking option, each kept value is also read and compared: a run with nothing changed stores what an
 *   uninterrupted run stores, and a kept value changed through the option `keep` (the state key, its root, the block's
 *   hash, ledger and time, a released key) fails `on-compute` at the next height, naming the field and both values.
 * - every row of the backbone's and the ledger modules' tables (`nodes` with its payloads, the counts and the queue
 *   included) is compared after every height and at each halt, with an uninterrupted run or a run with the memory off;
 * - what `core-ledger-state` keeps is its own: a module that changes the bytes of a published `ledger-state` item after
 *   the block changes nothing the next block takes;
 * - the keys it keeps are the retention window's and no more, through a long run, a `retainStates` raised and lowered,
 *   and a retried height; the block before is read again after an activation boundary of another module (not: no
 *   height of the run is a first one), a stop as before an upgrade, and failures after the block was kept: at
 *   `on-settle` and in `on-after-db-write`;
 * - on PostgreSQL, the writer's session lost between heights 2 and 3 while another writer changes the state key stored
 *   at 2: 3 reads the database, loads the changed key and halts at the root check, as a run with the memory off does;
 *   and lost while 3's callbacks run with the block before kept: that attempt fails before it writes, and 3 made again
 *   reads the changed row and halts.
 * h = 3. The negative controls (a build that uses the memory whenever the kept block is h − 1; the checking option off)
 * are in `ledger-block-before.negative-control.test.ts`.
 */

const LAST = 6;
const H = 3n;

/** The rows of every table but those that record the process's start and configuration, by table: an MD5 of each. */
async function everyRow(db: ProcessDatabase): Promise<Record<string, string>> {
  const tables = await db.query(
    `SELECT n.nspname || '.' || c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname IN ('core_block_commit', 'core_ledger_state', 'core_digest', 'core_chain_events', 'core_block_parsed',
       'core_tx_results') AND c.relkind IN ('r', 'p') AND NOT c.relispartition ORDER BY 1`,
  );
  const rows: Record<string, string> = {};
  for (const { t } of tables) {
    const [row] = await db.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM ${t as string} r`);
    rows[t as string] = row?.d as string;
  }
  return rows;
}

/** The loads an uninterrupted run from 0 to `last` asks: at each h above 0, the state stored at h − 1. */
const loadsOf = (run: BeforeRun, last: number): string[] =>
  Array.from({ length: last }, (_, i) => `${i} ${storedKeys(run.run).get(BigInt(i)) ?? "(none stored)"}`);

const connectionLost = (): UmbraError => new UmbraError("connection-lost", "the writer's connection was lost (the test's fault)");

describe.each(PROCESS_BACKENDS)("the block before, kept in memory, through the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The uninterrupted run and its database, made once for the tests that compare with it. */
  let uninterruptedRun: Promise<{ readonly db: ProcessDatabase; readonly before: BeforeRun }> | undefined;
  const uninterrupted = () =>
    (uninterruptedRun ??= (async () => {
      const db = await backend.database();
      return { db, before: await beforeRun(db, { last: LAST }) };
    })());

  it("an uninterrupted run sends no read of the block before above S; each on-compute has the worker hold the state stored at h − 1", async () => {
    const { before } = await uninterrupted();
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(loadedKeys(before.loads)).toEqual(loadsOf(before, LAST));
    expect(runProblems(before.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 2);

  it("every table after every height equals a run with the memory off, which reads the block before at every height above S", async () => {
    const { db, before } = await uninterrupted();
    const offDb = await backend.database();
    const off = await beforeRun(offDb, { last: LAST, continues: "off" });
    expect(off.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(off.calls)).toEqual(readsAt(heightsFrom(1n, BigInt(LAST))));
    expect(loadedKeys(off.loads)).toEqual(loadedKeys(before.loads));
    expect(off.applies).toEqual(before.applies);
    expect(rowDifferences(before.rows, off.rows)).toEqual([]);
    expect(await everyRow(db)).toEqual(await everyRow(offDb));
  }, PATIENCE_MS * 4);

  it("a COMMIT lost before it landed: h made again reads the block before, the heights after it do not; the rows are an uninterrupted run's", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, lose: { at: H, how: "lost" } });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(before.run.lines.some((line) => line.startsWith("processing retries in"))).toBe(true);
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H, compute: 2 }]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a COMMIT lost after it landed: h + 1, the next run's first height, reads the block before, the heights after it do not", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, lose: { at: H, how: "landed" } });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(before.run.lines.some((line) => line.startsWith("processing retries in"))).toBe(true);
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H + 1n }]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a COMMIT of h − 1 lost after it landed, h − 1's state key changed while the process was away: h reads the changed row, has the worker load that key, and halts at its root check", async () => {
    const at = H - 1n;
    const before = await beforeRun(await backend.database(), {
      last: LAST,
      lose: { at, how: "landed", then: keyOf(at, at - 1n) },
      halts: true,
    });
    const changed = storedKeys(before.run).get(at - 1n) as string;
    expect(storedKeys(before.run).get(at)).toBe(changed);
    expect(changedRowProblems(before, at, changed)).toEqual([]);
    expect(String(before.run.errors.at(-1))).toContain(`the ledger state loaded for block ${at} has the root`);
    // The rows after every height and at the halt: a run with the memory off's, in the same case.
    const off = await beforeRun(await backend.database(), {
      last: LAST,
      lose: { at, how: "landed", then: keyOf(at, at - 1n) },
      halts: true,
      continues: "off",
    });
    expect(off.run.status).toMatchObject({ state: "halted", cursor: at });
    expect(rowDifferences(before.rows, off.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a failure at h's on-compute after core-ledger-state's: the kept block is h − 1, and h processed again reads the block before all the same", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, faults: new Map([[`on-compute@${H}`, connectionLost()]]) });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    // h's first on-compute ended in the failure, before any on-db-write: core-block-commit's first call at h is the retry's.
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H, compute: 2, write: 1 }]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a failure at h's on-db-write after core-ledger-state's: the kept block is h, and h processed again reads the block before", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, faults: new Map([[`on-db-write@${H}`, connectionLost()]]) });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H, compute: 2 }]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a restart: the restarted process's first height reads the block before, the heights after it do not", async () => {
    const db = await backend.database();
    const first = await beforeRun(db, { last: Number(H) });
    expect(first.run.status).toMatchObject({ cursor: H, reason: null });
    expect(readsOf(first.calls)).toEqual(readsAt([]));
    const again = await beforeRun(db, { last: LAST, resume: H });
    expect(again.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(again.calls)).toEqual(readsAt([{ height: H + 1n }]));
    expect(rowDifferences(new Map([...first.rows, ...again.rows]), (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a height whose kept block is not h − 1 reads the block before even when its block context says continues (h made again after a rollback)", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, lose: { at: H, how: "lost" }, continues: "always" });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H, compute: 2 }]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("with retainStates 2 a run's first height reads the keys of the retention window once, and no height that continues it reads a key; the rows are a run's with the memory off", async () => {
    const settings = { retainStates: 2 };
    const db = await backend.database();
    // Heights 0 to 4: block h releases the state after h − 3 from 3 on, every one written in this run.
    const first = await beforeRun(db, { last: 4, settings });
    expect(first.run.status).toMatchObject({ cursor: 4n, reason: null });
    expect(readsOf(first.calls)).toEqual(readsAt([]));
    // Restarted at 4: 5 reads every read, its keys those of 2 to 4 (the one 5 releases and the window's, written before
    // the restart); 6 to 9 nothing.
    const again = await beforeRun(db, { last: 9, resume: 4n, settings });
    expect(again.run.status).toMatchObject({ cursor: 9n, reason: null });
    expect(readsOf(again.calls)).toEqual(readsAt([{ height: 5n }]));
    // With the memory off every height is a first one: each reads the window's keys, also where it releases none.
    const off = await beforeRun(await backend.database(), { last: 9, settings, continues: "off" });
    expect(readsOf(off.calls)).toEqual(readsAt(heightsFrom(1n, 9n)));
    expect(rowDifferences(new Map([...first.rows, ...again.rows]), off.rows)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("with the checking option and nothing changed: every kept value is read and compared at every height above S, and the rows are an uninterrupted run's", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, core: { checkKept: true }, commit: { checkKept: true } });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt(heightsFrom(1n, BigInt(LAST))));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a module changing the bytes of a published ledger-state item after the block: the next block takes what was written, not the changed bytes", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, user: [changingPublished()] });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(before.run.errors).toEqual([]);
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("a published ledger-state item's bytes changed after h's state row was written and before its on-db-write ended: the next block takes what was written", async () => {
    let changed = 0;
    const before = await beforeRun(await backend.database(), {
      last: LAST,
      afterWriteStatement: (module, b, sql) => {
        if (module !== CORE_LEDGER_STATE_ID || b.height !== H || !sql.includes("INSERT INTO core_ledger_state.states")) return;
        // Another module holding the published item changes it in place while the block's writes go on.
        const item = b.items.get(LEDGER_STATE_ITEM) as LedgerStateItem;
        item.stateKey[0] = (item.stateKey[0] ?? 0) ^ 0xff;
        item.stateRoot[0] = (item.stateRoot[0] ?? 0) ^ 0xff;
        changed++;
      },
    });
    expect(changed).toBe(1);
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(before.run.errors).toEqual([]);
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("the block context's hash changed after h's blocks row was written and before core-block-commit's on-db-write ended: both its rows and the next block's parent check take the hash it was given", async () => {
    let changed = 0;
    const before = await beforeRun(await backend.database(), {
      last: LAST,
      halts: true,
      afterWriteStatement: (module, b, sql) => {
        if (module !== "core-block-commit" || b.height !== H) return;
        // Flipped after the blocks row and back after the hashes row: the loop's own block reference is the same buffer.
        if (sql.includes("INSERT INTO core_block_commit.blocks") || sql.includes("INSERT INTO core_block_commit.hashes")) {
          b.hash[0] = (b.hash[0] ?? 0) ^ 0xff;
          changed++;
        }
      },
    });
    expect(changed).toBe(2);
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("the keys kept are the retention window's, L(h) to h, after every block of a long run with retainStates raised and lowered and a retried height", async () => {
    const revisions = [
      { start: 15n, settings: { retainStates: 6 } },
      { start: 28n, settings: { retainStates: 1 } },
    ];
    const window: readonly CoreRevision[] = [
      { start: 0n, last: 14n, retainStates: 2, sweep: "on" },
      { start: 15n, last: 27n, retainStates: 6, sweep: "on" },
      { start: 28n, last: null, retainStates: 1, sweep: "on" },
    ];
    const kept: { readonly height: bigint; readonly keys: readonly bigint[] }[] = [];
    const record = (block: KeptBlock): KeptBlock => {
      kept.push({ height: block.height, keys: [...block.stateKeys.keys()] });
      return block;
    };
    const last = 40;
    const before = await beforeRun(await backend.database(), {
      last,
      settings: { retainStates: 2 },
      revisions,
      core: { keep: record },
      lose: { at: 20n, how: "lost" },
    });
    expect(before.run.status).toMatchObject({ cursor: BigInt(last), reason: null });
    // Every block kept, 20 twice (its first attempt rolled back).
    expect(kept.map((entry) => entry.height)).toEqual([...heightsFrom(0n, 20n), ...heightsFrom(20n, BigInt(last))].map(({ height }) => height));
    const problems = kept.flatMap(({ height, keys }) => {
      const low = retainedFrom(window, height);
      const want = heightsFrom(low, height).map((entry) => entry.height);
      return keys.join(",") === want.join(",") ? [] : [`after ${height}: kept ${keys.join(",")}, not ${want.join(",")}`];
    });
    expect(problems).toEqual([]);
    expect(Math.max(...kept.map(({ keys }) => keys.length))).toBe(7);
    // Only the retried height's first block reads: 20 made again.
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: 20n, compute: 2 }]));
    const off = await beforeRun(await backend.database(), { last, settings: { retainStates: 2 }, revisions, continues: "off" });
    expect(rowDifferences(before.rows, off.rows)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("an activation boundary of another module at h: no height reads the block before, and the rows are an uninterrupted run's", async () => {
    const before = await beforeRun(await backend.database(), { last: LAST, faultsFrom: Number(H) });
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([]));
    expect(rowDifferences(before.rows, (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("a stop at h, as before an upgrade, and a process started again: h + 1 reads the block before, the heights after it do not", async () => {
    const db = await backend.database();
    const first = await beforeRun(db, { last: Number(H), stop: H });
    expect(first.run.status).toMatchObject({ cursor: H });
    expect(readsOf(first.calls)).toEqual(readsAt([]));
    const again = await beforeRun(db, { last: LAST, resume: H });
    expect(again.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(again.calls)).toEqual(readsAt([{ height: H + 1n }]));
    expect(rowDifferences(new Map([...first.rows, ...again.rows]), (await uninterrupted()).before.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("failures after h was kept: at on-settle h is made again and reads; in on-after-db-write h + 1 reads; the rows are an uninterrupted run's", async () => {
    const cases = [
      { fault: `on-settle@${H}`, reads: readsAt([{ height: H, compute: 2 }]) },
      { fault: `on-after-db-write@${H}`, reads: readsAt([{ height: H + 1n }]) },
    ];
    for (const { fault, reads } of cases) {
      const before = await beforeRun(await backend.database(), { last: LAST, faults: new Map([[fault, connectionLost()]]) });
      expect(before.run.status, fault).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(before.run.lines.some((line) => line.startsWith("processing retries in")), fault).toBe(true);
      expect(readsOf(before.calls), fault).toEqual(reads);
      expect(rowDifferences(before.rows, (await uninterrupted()).before.rows), fault).toEqual([]);
    }
  }, PATIENCE_MS * 6);

  /** Each kept value a test changes, with how, and the field the failure names. */
  const changes: readonly { readonly field: string; readonly change: (kept: KeptBlock) => KeptBlock }[] = [
    { field: "the state key after block 0", change: (kept) => ({ ...kept, stateKey: new Uint8Array(32).fill(0xee) }) },
    { field: "the state root after block 0", change: (kept) => ({ ...kept, stateRoot: new Uint8Array(32).fill(0xee) }) },
    { field: "the hash of block 0", change: (kept) => ({ ...kept, hash: new Uint8Array(32).fill(0xee) }) },
    { field: "the ledger of block 0", change: (kept) => ({ ...kept, ledger: (kept.ledger === "v8" ? "v9" : "v8") as LedgerName }) },
    { field: "the time of block 0 in ms", change: (kept) => ({ ...kept, timestampMs: kept.timestampMs + 1n }) },
    {
      field: "the released key of the state after block 0",
      change: (kept) => ({
        ...kept,
        stateKeys: new Map([...kept.stateKeys].map(([height, key]) => [height, height === kept.height ? new Uint8Array(32).fill(0xee) : key])),
      }),
    },
  ];

  it.each(changes)("with the checking option, $field changed in memory fails the next on-compute, naming it and both values", async ({ field, change }) => {
    const before = await beforeRun(await backend.database(), { last: LAST, core: { checkKept: true, keep: change }, halts: true });
    expect(before.run.status).toMatchObject({
      state: "halted",
      cursor: 0n,
      reason: { code: "callback-error", height: 1n, module: "core-ledger-state", point: "on-compute" },
    });
    const message = (before.run.errors.at(-1) as Error | undefined)?.message ?? "";
    const named = /^block 1: the block before as core-ledger-state kept it in memory differs from the database: (.+) is (\S+) in memory and (\S+) in the database$/.exec(message);
    expect(named?.[1], message).toBe(field);
    expect(named?.[2]).not.toBe(named?.[3]);
  }, PATIENCE_MS * 2);
});

/** Through the process on PostgreSQL 18: the writer's backend terminated at the `COMMIT` of h by a proxy. */
describe("the block before after a lost COMMIT through a proxy on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as (typeof PROCESS_BACKENDS)[number];
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A run through a {@link CommitProxy}, armed at h's `on-db-write`. */
  async function proxied(fault: CommitFault): Promise<{ readonly before: BeforeRun; readonly faults: readonly string[] }> {
    const db = await backend.database();
    const proxy = await CommitProxy.start(db.setting as PostgresParts);
    const terminate = () => (db.terminateWriter as () => Promise<number>)();
    let armed = false;
    try {
      const before = await beforeRun(
        { ...db, setting: proxy.setting(db.setting as PostgresParts) },
        {
          last: LAST,
          atWrite: (height) => {
            if (height !== H || armed) return;
            armed = true;
            void proxy.arm(fault, { terminate });
          },
        },
      );
      return { before, faults: proxy.faults };
    } finally {
      await proxy.close();
    }
  }

  it("terminated before the COMMIT was forwarded: h made again reads the block before, the heights after it do not", async () => {
    const { before, faults } = await proxied("before");
    expect(faults).toEqual(["before"]);
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H, compute: 2 }]));
    expect(runProblems(before.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 4);

  it("terminated after the server committed: h + 1 reads the block before, the heights after it do not", async () => {
    const { before, faults } = await proxied("after");
    expect(faults).toEqual(["after"]);
    expect(before.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(readsOf(before.calls)).toEqual(readsAt([{ height: H + 1n }]));
    expect(runProblems(before.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 4);
});

/** On PostgreSQL 18: another writer between two of the process's transactions, its writer's session replaced. */
describe("the block before after another writer held the writer lock, on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as (typeof PROCESS_BACKENDS)[number];
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The state key stored after 2 set to the one stored after 1, as another writer would. */
  const CHANGE = "UPDATE core_ledger_state.states SET state_key = (SELECT state_key FROM core_ledger_state.states WHERE height = 1) WHERE height = 2";

  it("the writer's session lost between heights 2 and 3, another writer changing the state key stored at 2: 3 reads the database, loads the changed key and halts at the root check, as with the memory off", async () => {
    const at = 2n;
    const run = async (continues?: "off") => {
      const db = await backend.database();
      return beforeRun(db, {
        last: LAST,
        halts: true,
        between: { after: at, act: (loopDb) => anotherWriter(db, loopDb, CHANGE) },
        ...(continues === undefined ? {} : { continues }),
      });
    };
    const before = await run();
    const changed = storedKeys(before.run).get(at - 1n) as string;
    expect(storedKeys(before.run).get(at)).toBe(changed);
    expect(changedRowProblems(before, at, changed)).toEqual([]);
    expect(String(before.run.errors.at(-1))).toContain(`the ledger state loaded for block ${at} has the root`);
    const off = await run("off");
    expect(off.run.status).toMatchObject({ state: "halted", cursor: at });
    expect(rowDifferences(before.rows, off.rows)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("the writer's session lost while 3's callbacks run with the block before kept: that attempt fails before it writes, and 3 made again reads the changed row, loads it and halts", async () => {
    const db = await backend.database();
    let done = false;
    const before = await beforeRun(db, {
      last: LAST,
      halts: true,
      atCompute: async (height, loopDb) => {
        if (height !== H || done) return;
        done = true;
        await anotherWriter(db, loopDb, CHANGE);
      },
    });
    const changed = storedKeys(before.run).get(H - 2n) as string;
    // The first attempt took the block before from memory (no read); made again, 3 reads the state at 2 and halts at
    // the root check right after the load.
    expect(readsOf(before.calls)).toEqual({ ...readsAt([]), state: [`ledger on-compute@${H}#2`] });
    expect(loadedKeys(before.loads.filter((load) => load.height === H - 1n)).at(-1)).toBe(`${H - 1n} ${changed}`);
    expect(before.run.lines.some((line) => line.startsWith("processing retries in"))).toBe(true);
    expect(before.run.status).toMatchObject({
      state: "halted",
      cursor: H - 1n,
      reason: { code: "callback-error", height: H, module: CORE_LEDGER_STATE_ID, point: "on-compute" },
    });
  }, PATIENCE_MS * 4);
});

/**
 * Another writer between two of the process's transactions: the session holding the writer lock is terminated, and
 * once the process's database says it has none (`Database.writerSession`), the test's own session takes the lock, runs
 * `change` and releases the lock.
 */
async function anotherWriter(db: ProcessDatabase, loopDb: Database, change: string): Promise<void> {
  await (db.terminateWriter as () => Promise<number>)();
  const session = (): number | null | undefined => (loopDb as Partial<Pick<Database, "writerSession">>).writerSession?.();
  for (let attempt = 0; attempt < 200 && session() !== null; attempt++) await new Promise((resolve) => setTimeout(resolve, 25));
  if (!(await (db.takeWriterLock as () => Promise<boolean>)())) throw new Error("the test's writer could not take the writer lock");
  await db.query(change);
  await db.query(`SELECT pg_advisory_unlock(${WRITER_LOCK_CLASS}, hashtext('${WRITER_LOCK_KEY}'))`);
}

/**
 * A module that keeps the `ledger-state` item its `on-compute` sees and, once the block committed, changes the first
 * byte of its state key and root: a module that works on its own copy of a published value in place.
 */
function changingPublished(): ModuleDeclaration {
  let item: LedgerStateItem | undefined;
  return {
    id: "block-before-changes",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", LEDGER_STATE_ITEM],
    provides: [{ name: "block-before-changes-rows", lifetimes: ["table"], table: { schema: "block_before_changes", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE block_before_changes.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b) {
        item = b.items.get(LEDGER_STATE_ITEM) as LedgerStateItem | undefined;
      },
      async "on-after-db-write"() {
        if (item === undefined) return;
        item.stateKey[0] = (item.stateKey[0] ?? 0) ^ 0xff;
        item.stateRoot[0] = (item.stateRoot[0] ?? 0) ^ 0xff;
        item = undefined;
      },
    },
  };
}
