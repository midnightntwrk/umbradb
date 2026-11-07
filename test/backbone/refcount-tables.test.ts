import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  KEYS_PER_STATEMENT,
  type RefcountStep,
  refcountStep,
  sqlRefcountTables,
  writeRefcount,
} from "../../src/backbone/core-ledger-state/refcount.js";
import {
  addRootCounts,
  CORE_LEDGER_STATE_MIGRATIONS,
  insertNodes,
  NODES_TABLE,
  REF_COUNTS_TABLE,
  ROOT_COUNTS_TABLE,
  UNREFERENCED_TABLE,
} from "../../src/backbone/core-ledger-state/sql.js";
import type { BlockWriteHandle, Database, ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { NodeBatch, StoredNode } from "../../src/ledger/types.js";
import { BACKENDS } from "../db/backends.js";
import { encodeChildren, hex } from "../ledger/node-format.js";
import {
  driveHistory,
  historyScripts,
  type RefcountBatch,
  type RefcountTables as ModelTables,
} from "./refcount-model.js";

/**
 * The reclamation step's reads (`sqlRefcountTables`) and writes (`writeRefcount`) on `core_ledger_state`'s own tables
 * (its migration), on PostgreSQL 18 and PGlite 0.5.10, through the database API: [LG-14, R11; design §3.4, §14]
 * - each read on small hand-built tables, and chunked by `KEYS_PER_STATEMENT` keys;
 * - a block's writes: the rows each statement reports affected equal what the step computed, chunks summed;
 * - `row-count-mismatch` for each statement, its transaction rolled back;
 * - `negative-count` and `missing-reference` through the database's reads;
 * - the property (fast-check, seed 20261105): on R1's histories, the step computed from the database at h − 1 and
 *   written after the block's node writes leaves the tables equal to the reference model's after every block.
 *
 * The node writes come first, as `core-ledger-state`'s `writeBlock` makes them, with its statement (`insertNodes`: a
 * new key inserted, a changed child list replacing the stored one, an unchanged one touching no row).
 */

/** The fast-check seed and run count of the property here (its blocks run statements on both backends). */
const SEED = 20261105;
const RUNS = 30;
const H = 41n;

const SCHEMA = `CREATE SCHEMA core_ledger_state;\n${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join("\n")}`;

/** Writes `nodes` with `insertNodes`, {@link KEYS_PER_STATEMENT} per statement; resolves with the rows written. */
async function writeNodes(w: Pick<BlockWriteHandle, "execute">, nodes: readonly StoredNode[]): Promise<number> {
  let written = 0;
  for (let at = 0; at < nodes.length; at += KEYS_PER_STATEMENT) written += await insertNodes(w, nodes.slice(at, at + KEYS_PER_STATEMENT));
  return written;
}

/** A 32-byte key: `tag` and the index `n` in its first bytes. */
const key = (tag: number, n = 0): Uint8Array => {
  const bytes = new Uint8Array(32).fill(tag);
  bytes[0] = tag;
  bytes[1] = n >> 8;
  bytes[2] = n & 0xff;
  return bytes;
};
/** A child list referencing `keys`. */
const list = (...keys: Uint8Array[]): Uint8Array => encodeChildren(keys.map((ref) => ({ ref })));
const bytes = (k: string): Uint8Array => Uint8Array.from(Buffer.from(k, "hex"));

/** Tables as hex: rows by key with their child list, the counts, the root counts, the queue. */
interface Tables {
  readonly rows: Readonly<Record<string, string>>;
  readonly refs: Readonly<Record<string, number>>;
  readonly roots: Readonly<Record<string, number>>;
  readonly queue: readonly string[];
}

const tablesOfModel = (tables: ModelTables): Tables => ({
  rows: Object.fromEntries([...tables.rows].map(([k, children]) => [k, hex(children)])),
  refs: Object.fromEntries(tables.refs),
  roots: Object.fromEntries(tables.roots),
  queue: [...tables.queue].sort(),
});

async function tablesOf(db: Database): Promise<Tables> {
  return db.read(async (read) => {
    const rows = await read.query(`SELECT node_key, children FROM ${NODES_TABLE}`);
    const refs = await read.query(`SELECT node_key, count FROM ${REF_COUNTS_TABLE}`);
    const roots = await read.query(`SELECT node_key, count FROM ${ROOT_COUNTS_TABLE}`);
    const queue = await read.query(`SELECT node_key FROM ${UNREFERENCED_TABLE}`);
    const k = (row: Record<string, unknown>): string => hex(row.node_key as Uint8Array);
    return {
      rows: Object.fromEntries(rows.map((row) => [k(row), hex(row.children as Uint8Array)])),
      refs: Object.fromEntries(refs.map((row) => [k(row), row.count as number])),
      roots: Object.fromEntries(roots.map((row) => [k(row), row.count as number])),
      queue: queue.map(k).sort(),
    };
  });
}

/** Writes `tables` into the empty tables of `db`. */
async function seed(
  db: Database,
  tables: {
    readonly rows: readonly (readonly [Uint8Array, Uint8Array])[];
    readonly refs?: readonly (readonly [Uint8Array, number])[];
    readonly roots?: readonly (readonly [Uint8Array, number])[];
    readonly queue?: readonly Uint8Array[];
  },
): Promise<void> {
  await db.transaction(async (tx) => {
    const { rows, refs = [], roots = [], queue = [] } = tables;
    await tx.execute(
      `INSERT INTO ${NODES_TABLE} (node_key, data, children)
        SELECT k, '\\x'::bytea, c FROM unnest($1::bytea[], $2::bytea[]) AS t (k, c)`,
      [rows.map(([k]) => k), rows.map(([, c]) => c)],
    );
    for (const [table, counts] of [[REF_COUNTS_TABLE, refs], [ROOT_COUNTS_TABLE, roots]] as const) {
      await tx.execute(`INSERT INTO ${table} (node_key, count) SELECT * FROM unnest($1::bytea[], $2::integer[])`, [
        counts.map(([k]) => k),
        counts.map(([, n]) => n),
      ]);
    }
    await tx.execute(`INSERT INTO ${UNREFERENCED_TABLE} (node_key) SELECT unnest($1::bytea[])`, [[...queue]]);
  });
}

/** Empties the four tables. */
async function clear(db: Database): Promise<void> {
  await db.transaction(async (tx) => {
    for (const table of [NODES_TABLE, REF_COUNTS_TABLE, ROOT_COUNTS_TABLE, UNREFERENCED_TABLE]) {
      await tx.execute(`DELETE FROM ${table}`);
    }
  });
}

/** A write handle that records each statement it runs with the rows the database reported. */
function recording(w: Pick<BlockWriteHandle, "execute">): {
  readonly handle: Pick<BlockWriteHandle, "execute">;
  readonly ran: { readonly sql: string; readonly rows: number }[];
} {
  const ran: { sql: string; rows: number }[] = [];
  return {
    ran,
    handle: {
      async execute(sql, params) {
        const rows = await w.execute(sql, params);
        ran.push({ sql, rows });
        return rows;
      },
    },
  };
}

/** A read that counts its statements. */
function counting(read: Pick<ReadHandle, "query">): {
  readonly read: Pick<ReadHandle, "query">;
  readonly asked: string[];
} {
  const asked: string[] = [];
  return { asked, read: { query: (sql, params) => (asked.push(sql), read.query(sql, params)) } };
}

/** The statements of {@link writeRefcount}, told apart by what they do, with the rows each reported, chunks summed. */
function byStatement(
  ran: readonly { readonly sql: string; readonly rows: number }[],
): Record<string, readonly number[]> {
  const kinds: Record<string, RegExp> = {
    "merge-ref-counts": new RegExp(`INSERT INTO ${REF_COUNTS_TABLE}`),
    "delete-unreferenced": new RegExp(`DELETE FROM ${UNREFERENCED_TABLE}`),
    "insert-unreferenced": new RegExp(`INSERT INTO ${UNREFERENCED_TABLE}`),
    "delete-nodes": new RegExp(`^DELETE FROM ${NODES_TABLE}`),
  };
  const found: Record<string, number[]> = {};
  for (const { sql, rows } of ran) {
    const kind = Object.keys(kinds).find((name) => kinds[name]?.test(sql));
    if (kind === undefined) throw new Error(`a statement of no known kind: ${sql}`);
    (found[kind] ??= []).push(rows);
  }
  return found;
}

/**
 * A block on hand-built tables that every statement of the step writes in:
 * - at h − 1: the state s0 (persisted) over a (over l) and b; the queued q over m; the queued u; w (persisted as a
 *   contract key) over x;
 * - the block persists s1 (new) over b, c (new) and u, releases s0, and rewrites w to reference y (new).
 * The step: q deleted in round 1, m in round 2; u leaves the queue; s0 and x (which the rewrite stops referencing)
 * enter it; b, c, u, y counted.
 */
const S = {
  s0: key(0x50),
  a: key(0x0a),
  l: key(0x1a),
  b: key(0x0b),
  q: key(0x71),
  m: key(0x6d),
  u: key(0x75),
  w: key(0x77),
  x: key(0x78),
  s1: key(0x51),
  c: key(0x0c),
  y: key(0x79),
};
const SCENARIO = {
  rows: [
    [S.s0, list(S.a, S.b)],
    [S.a, list(S.l)],
    [S.l, list()],
    [S.b, list()],
    [S.q, list(S.m)],
    [S.m, list()],
    [S.u, list()],
    [S.w, list(S.x)],
    [S.x, list()],
  ],
  refs: [
    [S.a, 1],
    [S.b, 1],
    [S.l, 1],
    [S.m, 1],
    [S.x, 1],
  ],
  roots: [
    [S.s0, 1],
    [S.w, 1],
  ],
  queue: [S.q, S.u],
} as const satisfies Parameters<typeof seed>[1];
const node = (k: Uint8Array, children: Uint8Array): StoredNode => ({
  key: k,
  data: Uint8Array.of(k[0] ?? 0),
  children,
});
const SCENARIO_BATCH: NodeBatch = {
  inserts: [node(S.s1, list(S.b, S.c, S.u)), node(S.c, list()), node(S.w, list(S.y)), node(S.y, list())],
  rootCounts: [
    { key: S.s0, delta: -1 },
    { key: S.s1, delta: 1 },
  ],
};
const h = (...keys: Uint8Array[]): string[] => keys.map(hex).sort();
/** A key or child list as a `bytea` literal. */
const lit = (value: Uint8Array): string => `'\\x${hex(value)}'`;

describe.each(BACKENDS)("the reclamation step's reads and writes on $name (LG-14)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A fresh database with the part's tables, `body` run on it, closed after. */
  async function withTables<T>(body: (db: Database) => Promise<T>): Promise<T> {
    const { db } = await backend.database(SCHEMA);
    try {
      return await body(db);
    } finally {
      await db.close();
    }
  }
  const stepOn = (db: Database, batch: NodeBatch, on = true): Promise<RefcountStep> =>
    db.read((read) => refcountStep(sqlRefcountTables(read), batch, { height: H, on }));
  /** The block's writes: its nodes, its root counts, then the step's. */
  const writeAll = (w: Pick<BlockWriteHandle, "execute">, batch: NodeBatch, step: RefcountStep): Promise<void> =>
    (async () => {
      const written = await writeNodes(w, batch.inserts);
      if (batch.rootCounts.length > 0) await addRootCounts(w, batch.rootCounts);
      await writeRefcount(w, step, written);
    })();

  it("reads which keys are rows, the stored lists that differ, the queue, the counts and the references", async () => {
    await withTables(async (db) => {
      await seed(db, SCENARIO);
      const missing = key(0x99);
      await db.read(async (read) => {
        const tables = sqlRefcountTables(read);
        expect(tables.fault).toBeUndefined();
        expect(sortedKeys(await tables.rows([S.s0, S.q, missing]))).toEqual(h(S.s0, S.q));
        // w and b differ (their stored lists' references given); a is the stored list; a missing key is no row.
        const changed = await tables.changed([
          node(S.w, list(S.y)),
          node(S.a, list(S.l)),
          node(S.b, list(S.x)),
          node(missing, list()),
        ]);
        expect(Object.fromEntries([...changed].map(([k, refs]) => [k, refs.map(hex)]))).toEqual({
          [hex(S.w)]: [hex(S.x)],
          [hex(S.b)]: [],
        });
        expect((await tables.queue()).map(hex).sort()).toEqual(h(S.q, S.u));
        expect(Object.fromEntries(await tables.counts([S.b, S.s0, S.q, missing]))).toEqual({
          [hex(S.b)]: { row: true, refs: 1, roots: 0 },
          [hex(S.s0)]: { row: true, refs: 0, roots: 1 },
          [hex(S.q)]: { row: true, refs: 0, roots: 0 },
          [hex(missing)]: { row: false, refs: 0, roots: 0 },
        });
        const references = await tables.references([S.s0, S.q, S.l, missing]);
        expect(Object.fromEntries([...references].map(([k, refs]) => [k, refs.map(hex)]))).toEqual({
          [hex(S.s0)]: [hex(S.a), hex(S.b)],
          [hex(S.q)]: [hex(S.m)],
          [hex(S.l)]: [],
        });
      });
    });
  });

  it(`reads in statements of ${KEYS_PER_STATEMENT} keys, and asks nothing for no key`, async () => {
    await withTables(async (db) => {
      const count = 2 * KEYS_PER_STATEMENT + 1;
      const keys = Array.from({ length: count }, (_, i) => key(0x20, i));
      await seed(db, {
        rows: keys.map((k, i) => [k, list(key(0x21, i))] as const),
        refs: keys.map((k) => [k, 3] as const),
      });
      await db.read(async (read) => {
        const { read: counted, asked } = counting(read);
        const tables = sqlRefcountTables(counted);
        expect((await tables.rows(keys)).size).toBe(count);
        expect(asked).toHaveLength(3);
        const changed = await tables.changed(keys.map((k, i) => node(k, list(key(0x21, i === count - 1 ? 0 : i)))));
        expect([...changed.keys()]).toEqual([hex(keys[count - 1] as Uint8Array)]);
        expect(asked).toHaveLength(6);
        const counts = await tables.counts(keys);
        const all = [...counts.values()].every((c) => c.row && c.refs === 3 && c.roots === 0);
        expect([counts.size, all]).toEqual([count, true]);
        expect(asked).toHaveLength(9);
        const references = await tables.references(keys);
        expect(references.get(hex(keys[count - 1] as Uint8Array))?.map(hex)).toEqual([hex(key(0x21, count - 1))]);
        expect(asked).toHaveLength(12);
        await Promise.all([tables.rows([]), tables.changed([]), tables.counts([]), tables.references([])]);
        expect(asked).toHaveLength(12);
      });
    });
  });

  it("writes a block's step: each statement affects the rows the step computed; the tables follow", async () => {
    await withTables(async (db) => {
      await seed(db, SCENARIO);
      const step = await stepOn(db, SCENARIO_BATCH);
      expect([h(...step.newNodes), h(...step.rewritten), h(...step.deleted), step.rounds]).toEqual([
        h(S.s1, S.c, S.y),
        h(S.w),
        h(S.q, S.m),
        2,
      ]);
      expect([h(...step.unqueued), h(...step.queued), step.counted]).toEqual([h(S.q, S.u), h(S.s0, S.x), 4]);
      await db.transaction(async (tx) => {
        const written = await writeNodes(tx, SCENARIO_BATCH.inserts);
        expect(written).toBe(4);
        await addRootCounts(tx, SCENARIO_BATCH.rootCounts);
        const recorder = recording(tx);
        await writeRefcount(recorder.handle, step, written);
        expect(byStatement(recorder.ran)).toEqual({
          "merge-ref-counts": [step.counted],
          "delete-unreferenced": [step.unqueued.length],
          "insert-unreferenced": [step.queued.length],
          "delete-nodes": [step.deleted.length],
        });
      });
      const after = await tablesOf(db);
      expect(Object.keys(after.rows).sort()).toEqual(h(S.s0, S.a, S.l, S.b, S.u, S.w, S.x, S.s1, S.c, S.y));
      expect(after.rows[hex(S.w)]).toBe(hex(list(S.y)));
      expect(after.refs).toEqual({
        [hex(S.a)]: 1,
        [hex(S.b)]: 2,
        [hex(S.l)]: 1,
        [hex(S.u)]: 1,
        [hex(S.c)]: 1,
        [hex(S.y)]: 1,
      });
      expect(after.roots).toEqual({ [hex(S.w)]: 1, [hex(S.s1)]: 1 });
      expect(after.queue).toEqual(h(S.s0, S.x));
    });
  });

  it(`writes in statements of ${KEYS_PER_STATEMENT} keys, each statement's rows summed over its chunks`, async () => {
    await withTables(async (db) => {
      const n = KEYS_PER_STATEMENT + 1;
      const d = Array.from({ length: n }, (_, i) => key(0xd0, i)); // queued, deleted
      const e = Array.from({ length: n }, (_, i) => key(0xe0, i)); // queued, referenced by r
      const p = Array.from({ length: n }, (_, i) => key(0xf0, i)); // new, nothing references them: queued
      const r = key(0xa0);
      await seed(db, { rows: [...d, ...e].map((k) => [k, list()] as const), queue: [...d, ...e] });
      const batch: NodeBatch = {
        inserts: [...p.map((k) => node(k, list())), node(r, list(...e))],
        rootCounts: [{ key: r, delta: 1 }],
      };
      const step = await stepOn(db, batch);
      expect([step.deleted.length, step.unqueued.length, step.queued.length, step.counted]).toEqual([n, 2 * n, n, n]);
      await db.transaction(async (tx) => {
        const written = await writeNodes(tx, batch.inserts);
        await addRootCounts(tx, batch.rootCounts);
        const recorder = recording(tx);
        await writeRefcount(recorder.handle, step, written);
        expect(byStatement(recorder.ran)).toEqual({
          "merge-ref-counts": [KEYS_PER_STATEMENT, 1],
          "delete-unreferenced": [KEYS_PER_STATEMENT, KEYS_PER_STATEMENT, 2],
          "insert-unreferenced": [KEYS_PER_STATEMENT, 1],
          "delete-nodes": [KEYS_PER_STATEMENT, 1],
        });
      });
      const after = await tablesOf(db);
      const sizes = [Object.keys(after.rows).length, Object.keys(after.refs).length, after.queue.length];
      expect(sizes).toEqual([2 * n + 1, n, n]);
    });
  });

  it("writes nothing for a step with nothing to write, and checks the node writes alone", async () => {
    await withTables(async (db) => {
      await seed(db, { rows: [[S.s0, list()]], roots: [[S.s0, 1]] });
      const batch: NodeBatch = { inserts: [node(S.s0, list())], rootCounts: [] };
      const step = await stepOn(db, batch);
      const lists = [step.unchanged.map(hex), step.deltas, step.deleted, step.queued, step.unqueued];
      expect(lists).toEqual([[hex(S.s0)], [], [], [], []]);
      await db.transaction(async (tx) => {
        const recorder = recording(tx);
        await writeRefcount(recorder.handle, step, await writeNodes(tx, batch.inserts));
        expect(recorder.ran).toEqual([]);
      });
    });
  });

  describe("row-count-mismatch: a statement that affects another number of rows than computed", () => {
    const faults: readonly {
      readonly statement: string;
      readonly expected: number;
      readonly actual: number;
      readonly fault: string;
    }[] = [
      // w written with its new list before the block: the block's node write then finds it unchanged.
      {
        statement: "write-nodes",
        expected: 4,
        actual: 3,
        fault: `UPDATE ${NODES_TABLE} SET children = ${lit(list(S.y))} WHERE node_key = ${lit(S.w)}`,
      },
      // x's count raised: the merge keeps it at 1 instead of deleting it.
      {
        statement: "merge-ref-counts",
        expected: 4,
        actual: 5,
        fault: `UPDATE ${REF_COUNTS_TABLE} SET count = 2 WHERE node_key = ${lit(S.x)}`,
      },
      {
        statement: "delete-unreferenced",
        expected: 2,
        actual: 1,
        fault: `DELETE FROM ${UNREFERENCED_TABLE} WHERE node_key = ${lit(S.q)}`,
      },
      {
        statement: "insert-unreferenced",
        expected: 2,
        actual: 1,
        fault: `INSERT INTO ${UNREFERENCED_TABLE} (node_key) VALUES (${lit(S.x)})`,
      },
      {
        statement: "delete-nodes",
        expected: 2,
        actual: 1,
        fault: `DELETE FROM ${NODES_TABLE} WHERE node_key = ${lit(S.m)}`,
      },
    ];
    for (const { statement, expected, actual, fault } of faults) {
      it(`${statement}: halts naming it, ${expected} rows computed, ${actual} affected; nothing written`, async () => {
        await withTables(async (db) => {
          await seed(db, SCENARIO);
          const step = await stepOn(db, SCENARIO_BATCH);
          await db.transaction((tx) => tx.execute(fault));
          const before = await tablesOf(db);
          const error = await db
            .transaction((tx) => writeAll(tx, SCENARIO_BATCH, step))
            .catch((caught: unknown) => caught);
          expect(error).toBeInstanceOf(UmbraError);
          expect(error).toMatchObject({
            code: "ledger-refcount-invalid",
            details: { reason: "row-count-mismatch", height: H, statement, expected, actual },
          });
          expect((error as Error).message).toContain(statement);
          expect(await tablesOf(db)).toEqual(before);
        });
      });
    }
  });

  it("halts with row-count-mismatch when the queue holds a key that is no row: deleting it affects none", async () => {
    await withTables(async (db) => {
      const ghost = key(0x9a);
      await seed(db, { rows: [], queue: [ghost] });
      const step = await stepOn(db, { inserts: [], rootCounts: [] });
      expect([h(...step.deleted), h(...step.unqueued)]).toEqual([h(ghost), h(ghost)]);
      const before = await tablesOf(db);
      const error = await db
        .transaction((tx) => writeAll(tx, { inserts: [], rootCounts: [] }, step))
        .catch((caught: unknown) => caught);
      expect(error).toMatchObject({
        code: "ledger-refcount-invalid",
        details: { reason: "row-count-mismatch", height: H, statement: "delete-nodes", expected: 1, actual: 0 },
      });
      expect(await tablesOf(db)).toEqual(before);
    });
  });

  it("halts with negative-count and missing-reference through the database's reads", async () => {
    await withTables(async (db) => {
      // m's count lowered to none: deleting the queued q takes it below 0.
      await seed(db, { rows: [[S.q, list(S.m)], [S.m, list()], [S.w, list()]], roots: [[S.w, 1]], queue: [S.q] });
      const halt = async (batch: NodeBatch): Promise<unknown> => stepOn(db, batch).catch((caught: unknown) => caught);
      const missing = key(0x99);
      expect(await halt({ inserts: [], rootCounts: [] })).toMatchObject({
        code: "ledger-refcount-invalid",
        details: { reason: "negative-count", height: H, key: `0x${hex(S.m)}` },
      });
      const cases: readonly NodeBatch[] = [
        { inserts: [node(S.s1, list(missing))], rootCounts: [] },
        { inserts: [node(S.w, list(missing))], rootCounts: [] },
        { inserts: [], rootCounts: [{ key: missing, delta: 1 }] },
      ];
      for (const batch of cases) {
        const step = db.read((read) => refcountStep(sqlRefcountTables(read), batch, { height: H, on: false }));
        expect(await step.catch((caught: unknown) => caught)).toMatchObject({
          code: "ledger-refcount-invalid",
          details: { reason: "missing-reference", height: H, key: `0x${hex(missing)}` },
        });
      }
    });
  });

  it(
    `keeps the tables equal to the reference model's after every block of R1's histories (seed ${SEED}, ${RUNS} runs)`,
    async () => {
      const { db } = await backend.database(SCHEMA);
      let blocks = 0;
      let deleted = 0;
      try {
        await fc.assert(
          fc.asyncProperty(historyScripts({ oneForm: false }), async (script) => {
            await clear(db);
            for (const block of driveHistory(script)) {
              const batch = nodeBatchOf(block.batch);
              const step = await db.read((read) =>
                refcountStep(sqlRefcountTables(read), batch, { height: BigInt(block.height), on: block.script.on }),
              );
              await db.transaction((tx) => writeAll(tx, batch, step));
              expect(await tablesOf(db)).toEqual(tablesOfModel(block.step.after));
              blocks += 1;
              deleted += step.deleted.length;
            }
          }),
          { seed: SEED, numRuns: RUNS },
        );
      } finally {
        await db.close();
      }
      expect(blocks).toBeGreaterThan(100);
      expect(deleted).toBeGreaterThan(100);
    },
    600_000,
  );
});

/** The model's batch as the step takes it; the payload plays no part in the step. */
function nodeBatchOf(batch: RefcountBatch): NodeBatch {
  return {
    inserts: batch.inserts.map(({ key: k, children }) => ({ key: bytes(k), data: new Uint8Array(0), children })),
    rootCounts: batch.rootCounts.map(({ key: k, delta }) => ({ key: bytes(k), delta })),
  };
}

const sortedKeys = (keys: ReadonlySet<string>): string[] => [...keys].sort();
