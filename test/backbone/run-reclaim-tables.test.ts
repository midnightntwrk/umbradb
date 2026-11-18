import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type NetWrite, RunReclaim, sqlRunTables, writeNet } from "../../src/backbone/core-ledger-state/run-reclaim.js";
import {
  addRootCounts,
  CORE_LEDGER_STATE_MIGRATIONS,
  insertNodes,
  NODES_TABLE,
  REF_COUNTS_TABLE,
  ROOT_COUNTS_TABLE,
  UNREFERENCED_TABLE,
} from "../../src/backbone/core-ledger-state/sql.js";
import type { BlockWriteHandle, Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { BACKENDS } from "../db/backends.js";
import { encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import { type HistoryScript, historyScripts, type RefcountTables as ModelTables } from "./refcount-model.js";
import { refcountStep, sqlRefcountTables, writeRefcount } from "./refcount-step.js";
import { flushOf, made, madeBlocks, type MadeNode, type ModelBlock, modelBlocks, payloadOf, ref, runsOf } from "./run-reclaim.js";

/**
 * The run computation's reads (`sqlRunTables`) and its net write (`writeNet`) on `core_ledger_state`'s own tables (its
 * migration), on PostgreSQL 18 and PGlite 0.5.10, through the database API:
 * - the net write's statements: each list in statements of 1,000 keys, each statement's rows summed and checked
 *   (`row-count-mismatch`, naming the statement; left out by a negative control's `unchecked`);
 * - the property (fast-check): on the histories, each run in one transaction, each block's root-count changes written
 *   as its own rows, then the computation read through the transaction and its net write: the tables after every run
 *   are the reference model's after the run's last block;
 * - a net write whose rows differ from the database's halts and rolls its transaction back;
 * - one block on damaged tables, run by the per-block step (`refcountStep` and `writeRefcount`) and as a run of one
 *   block (`RunReclaim` and `writeNet`), each on a database of its own: the same outcome and tables, or the
 *   difference the note's section 4.9 lists.
 */

const SEED = 20261117;
const RUNS = 20;

const SCHEMA = `CREATE SCHEMA core_ledger_state;\n${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join("\n")}`;

/** Tables as hex: rows by key with their child list, and with their payload, the counts, the root counts, the queue. */
interface Tables {
  readonly rows: Readonly<Record<string, string>>;
  readonly data: Readonly<Record<string, string>>;
  readonly refs: Readonly<Record<string, number>>;
  readonly roots: Readonly<Record<string, number>>;
  readonly queue: readonly string[];
}

/** The model's tables, each row with the payload `payload` gives its key ({@link payloadOf} unless given). */
const tablesOfModel = (tables: ModelTables, payload: (key: string) => Uint8Array = payloadOf): Tables => ({
  rows: Object.fromEntries([...tables.rows].map(([k, children]) => [k, hex(children)])),
  data: Object.fromEntries([...tables.rows.keys()].map((k) => [k, hex(payload(k))])),
  refs: Object.fromEntries(tables.refs),
  roots: Object.fromEntries(tables.roots),
  queue: [...tables.queue].sort(),
});

async function tablesOf(db: Database): Promise<Tables> {
  return db.read(async (read) => {
    const rows = await read.query(`SELECT node_key, data, children FROM ${NODES_TABLE}`);
    const refs = await read.query(`SELECT node_key, count FROM ${REF_COUNTS_TABLE}`);
    const roots = await read.query(`SELECT node_key, count FROM ${ROOT_COUNTS_TABLE}`);
    const queue = await read.query(`SELECT node_key FROM ${UNREFERENCED_TABLE}`);
    const k = (row: Record<string, unknown>): string => hex(row.node_key as Uint8Array);
    return {
      rows: Object.fromEntries(rows.map((row) => [k(row), hex(row.children as Uint8Array)])),
      data: Object.fromEntries(rows.map((row) => [k(row), hex(row.data as Uint8Array)])),
      refs: Object.fromEntries(refs.map((row) => [k(row), row.count as number])),
      roots: Object.fromEntries(roots.map((row) => [k(row), row.count as number])),
      queue: queue.map(k).sort(),
    };
  });
}

/** Empties the four tables. */
async function clear(db: Database): Promise<void> {
  await db.transaction(async (tx) => {
    for (const table of [NODES_TABLE, REF_COUNTS_TABLE, ROOT_COUNTS_TABLE, UNREFERENCED_TABLE]) await tx.execute(`DELETE FROM ${table}`);
  });
}

/** A block's own rows of the node tables' kind: its root-count changes. */
async function writeOwnRows(w: Pick<BlockWriteHandle, "execute">, flushed: NodeBatch): Promise<void> {
  const counts = flushed.rootCounts.filter((count) => count.delta !== 0);
  if (counts.length > 0) await addRootCounts(w, counts);
}

/**
 * `run`'s blocks handed over and their own rows written, then the computation through the transaction and, unless
 * `net` changes it, its net write; one transaction for the run.
 */
async function settle(
  db: Database,
  run: readonly ModelBlock[],
  net: (computed: NetWrite) => NetWrite = (computed) => computed,
  flushOfBlock: (block: ModelBlock) => NodeBatch = (block) => flushOf(block.flushed),
): Promise<void> {
  await db.transaction(async (tx) => {
    const reclaim = new RunReclaim({ first: BigInt((run[0] as ModelBlock).height), on: (run[0] as ModelBlock).on });
    for (const block of run) {
      const flushed = flushOfBlock(block);
      reclaim.collect(BigInt(block.height), flushed, block.on);
      await writeOwnRows(tx, flushed);
    }
    const outcome = await reclaim.compute(sqlRunTables(tx));
    await writeNet(tx, net(outcome.net));
  });
}

/** Writes `tables` into the empty tables of `db`. */
async function seed(
  db: Database,
  tables: {
    readonly rows?: readonly (readonly [Uint8Array, Uint8Array])[];
    readonly refs?: readonly (readonly [Uint8Array, number])[];
    readonly roots?: readonly (readonly [Uint8Array, number])[];
    readonly queue?: readonly Uint8Array[];
  },
): Promise<void> {
  await db.transaction(async (tx) => {
    const { rows = [], refs = [], roots = [], queue = [] } = tables;
    await tx.execute(
      `INSERT INTO ${NODES_TABLE} (node_key, data, children) SELECT k, '\\x'::bytea, c FROM unnest($1::bytea[], $2::bytea[]) AS t (k, c)`,
      [rows.map(([k]) => k), rows.map(([, c]) => c)],
    );
    for (const [table, counts] of [[REF_COUNTS_TABLE, refs], [ROOT_COUNTS_TABLE, roots]] as const) {
      await tx.execute(`INSERT INTO ${table} (node_key, count) SELECT * FROM unnest($1::bytea[], $2::integer[])`, [counts.map(([k]) => k), counts.map(([, n]) => n)]);
    }
    await tx.execute(`INSERT INTO ${UNREFERENCED_TABLE} (node_key) SELECT unnest($1::bytea[])`, [[...queue]]);
  });
}

/** A halt's reason, with the statement for `row-count-mismatch`; any other error is thrown again. */
function reasonOf(error: unknown): string {
  if (!(error instanceof UmbraError) || error.code !== "ledger-refcount-invalid") throw error;
  const details = error.details as { reason: string; statement?: string };
  return details.statement === undefined ? details.reason : `${details.reason} (${details.statement})`;
}

/** The height of the one block the damaged-table cases run. */
const H = 7n;

/** Block `H` by the per-block step: its reads committed, then the block's node and root-count writes and the step's. */
async function byStep(db: Database, flush: NodeBatch, on: boolean): Promise<string> {
  try {
    const step = await db.read((read) => refcountStep(sqlRefcountTables(read), flush, { height: H, on }));
    await db.transaction(async (tx) => {
      const written = flush.inserts.length === 0 ? 0 : await insertNodes(tx, flush.inserts);
      await writeOwnRows(tx, flush);
      await writeRefcount(tx, step, written);
    });
    return "commits";
  } catch (error) {
    return reasonOf(error);
  }
}

/** Block `H` as a run of one block: its root counts, then the computation through the transaction and its net write. */
async function byRun(db: Database, flush: NodeBatch, on: boolean): Promise<string> {
  try {
    await db.transaction(async (tx) => {
      const reclaim = new RunReclaim({ first: H, on });
      reclaim.collect(H, flush, on);
      await writeOwnRows(tx, flush);
      await writeNet(tx, (await reclaim.compute(sqlRunTables(tx))).net);
    });
    return "commits";
  } catch (error) {
    return reasonOf(error);
  }
}

/** A 32-byte key named `tag`. */
const key = (tag: number): Uint8Array => new Uint8Array(32).fill(tag);
/** A child list referencing `keys`. */
const list = (...keys: Uint8Array[]): Uint8Array => encodeChildren(keys.map((k) => ({ ref: k })));

describe("writeNet's statements", () => {
  const keys = Array.from({ length: 2_500 }, (_, n) => nodeKey(Buffer.from(`key ${n}`), []));
  const net: NetWrite = {
    height: 9n,
    inserts: keys.map((key) => ({ key, data: Uint8Array.of(7), children: Uint8Array.of(0) })),
    written: 2_500,
    deltas: keys.map((key) => ({ key, delta: 1 })),
    counted: 2_500,
    unqueued: keys,
    queued: keys,
    deleted: keys,
  };
  /** A handle that answers each statement with the keys it was given, less `less` for the statements `which` picks. */
  const answering = (ran: { sql: string; keys: number }[], which: (sql: string) => boolean = () => false, less = 0): Pick<BlockWriteHandle, "execute"> => ({
    async execute(sql, params) {
      const given = ((params ?? [])[0] as readonly unknown[]).length;
      ran.push({ sql, keys: given });
      return which(sql) ? given - less : given;
    },
  });

  it("sends each list in statements of 1,000 keys, in its order of statements, and none for an empty list", async () => {
    const ran: { sql: string; keys: number }[] = [];
    await writeNet(answering(ran), net);
    expect(ran.map((statement) => statement.keys)).toEqual(Array.from({ length: 5 }, () => [1_000, 1_000, 500]).flat());
    const kinds = ran.map(({ sql }) => (sql.includes(`INTO ${NODES_TABLE}`) ? "nodes" : sql.includes(REF_COUNTS_TABLE) ? "counts" : sql.startsWith(`DELETE FROM ${UNREFERENCED_TABLE}`) ? "unqueue" : sql.includes(`INTO ${UNREFERENCED_TABLE}`) ? "queue" : "delete"));
    expect([...new Set(kinds)]).toEqual(["nodes", "counts", "unqueue", "queue", "delete"]);
    ran.length = 0;
    await writeNet(answering(ran), { height: 9n, inserts: [], written: 0, deltas: [], counted: 0, unqueued: [], queued: [], deleted: [] });
    expect(ran).toEqual([]);
  });

  it("halts with row-count-mismatch naming a statement whose rows, summed over its statements, differ from the computed; unless left out", async () => {
    for (const [statement, which] of [
      ["write-nodes", (sql: string) => sql.includes(`INTO ${NODES_TABLE}`)],
      ["merge-ref-counts", (sql: string) => sql.includes(REF_COUNTS_TABLE)],
      ["delete-unreferenced", (sql: string) => sql.startsWith(`DELETE FROM ${UNREFERENCED_TABLE}`)],
      ["insert-unreferenced", (sql: string) => sql.includes(`INTO ${UNREFERENCED_TABLE}`)],
      ["delete-nodes", (sql: string) => sql.startsWith(`DELETE FROM ${NODES_TABLE}`)],
    ] as const) {
      const halt = await writeNet(answering([], which, 1), net).catch((error: unknown) => error);
      expect(halt, statement).toMatchObject({
        code: "ledger-refcount-invalid",
        details: { reason: "row-count-mismatch", height: 9n, statement, expected: 2_500, actual: 2_497 },
      });
      expect((halt as Error).message).toMatch(new RegExp(`^the run ending at block 9: ${statement} affected 2497 rows where 2500 were computed`));
      await writeNet(answering([], which, 1), net, { unchecked: "row-count-mismatch" });
    }
  });
});

describe.each(BACKENDS)("the run computation's reads and net write on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  for (const [name, histories, sizes] of [
    ["in one form", historyScripts({ oneForm: true }), [1, 3]],
    ["in two forms under the flush rule", historyScripts({ oneForm: false, flushRule: true }), [1]],
  ] as const) {
    it(`keeps the tables equal to the reference model's after every run of the histories ${name}, in runs of ${sizes.join(" and ")} (seed ${SEED}, ${RUNS} runs)`, async () => {
      const { db } = await backend.database(SCHEMA);
      const seen = { runs: 0, deleted: 0, written: 0 };
      try {
        await fc.assert(
          fc.asyncProperty(histories as fc.Arbitrary<HistoryScript>, async (script) => {
            const blocks = modelBlocks(script);
            for (const size of sizes) {
              await clear(db);
              for (const run of runsOf(blocks, size)) {
                const before = await tablesOf(db);
                await settle(db, run);
                const after = await tablesOf(db);
                expect(after, `after ${(run.at(-1) as ModelBlock).height}, runs of ${size}`).toEqual(tablesOfModel((run.at(-1) as ModelBlock).step.after));
                seen.runs += 1;
                seen.deleted += Object.keys(before.rows).filter((key) => !(key in after.rows)).length;
                seen.written += Object.keys(after.rows).filter((key) => before.rows[key] !== after.rows[key]).length;
              }
            }
          }),
          { seed: SEED, numRuns: RUNS },
        );
      } finally {
        await db.close();
      }
      // Not vacuous: rows are written and deleted.
      expect(seen.runs).toBeGreaterThan(100);
      expect(seen.written).toBeGreaterThan(100);
      expect(seen.deleted).toBeGreaterThan(50);
    }, 600_000);
  }

  describe("one block on damaged tables, by the per-block step and as a run of one block", () => {
    /** The outcome and the tables after, for the step and for the run, each on its own database seeded with `found`. */
    async function both(found: Parameters<typeof seed>[1], flush: NodeBatch, on = true) {
      const result: Record<"step" | "run", { outcome: string; tables: Tables }> = {} as never;
      for (const [name, apply] of [["step", byStep], ["run", byRun]] as const) {
        const { db } = await backend.database(SCHEMA);
        try {
          await seed(db, found);
          const outcome = await apply(db, flush, on);
          result[name] = { outcome, tables: await tablesOf(db) };
        } finally {
          await db.close();
        }
      }
      return result;
    }
    const [g, q, k, p, x] = [key(0x67), key(0x71), key(0x6b), key(0x70), key(0x78)];

    it("a queued key with no row: both halt on the node delete, which affects no row, and store nothing", async () => {
      const result = await both({ queue: [g] }, { inserts: [], rootCounts: [] });
      expect(result.step.outcome).toBe("row-count-mismatch (delete-nodes)");
      expect(result.run).toEqual(result.step);
    }, 120_000);

    it("a key with a count and no row, reached by a deletion: both halt on the node delete and store nothing", async () => {
      // q is stored and queued and references k, which has a count and no row.
      const result = await both({ rows: [[q, list(k)]], refs: [[k, 1]], queue: [q] }, { inserts: [], rootCounts: [] });
      expect(result.step.outcome).toBe("row-count-mismatch (delete-nodes)");
      expect(result.run).toEqual(result.step);
    }, 120_000);

    it("a list flushed again unchanged that references a key stored nowhere: both store the block", async () => {
      // p is stored and persisted, and references x, which is no row; the block flushes p with its row's list and
      // persists it again.
      const result = await both({ rows: [[p, list(x)]], roots: [[p, 1]] }, { inserts: [{ key: p, data: Uint8Array.of(1), children: list(x) }], rootCounts: [{ key: p, delta: 1 }] });
      expect(result.step.outcome).toBe("commits");
      expect(result.run).toEqual(result.step);
    }, 120_000);

    it("others of the kind, each the same both ways: a count with no row that a written list references, a queued row with a root count or with a count, a root count with no row released, a row missing from the queue", async () => {
      const [r, n] = [key(0x72), key(0x6e)];
      const cases: [string, Parameters<typeof seed>[1], NodeBatch, string][] = [
        // k has a count and no row; the block writes a new root r over k.
        ["a count with no row, referenced", { refs: [[k, 1]] }, { inserts: [{ key: r, data: Uint8Array.of(1), children: list(k) }], rootCounts: [{ key: r, delta: 1 }] }, "missing-reference"],
        // q is stored, persisted and queued.
        ["a queued row with a root count", { rows: [[q, list()]], roots: [[q, 1]], queue: [q] }, { inserts: [], rootCounts: [] }, "commits"],
        // q is stored, queued and counted once, though nothing references it.
        ["a queued row with a count", { rows: [[q, list()]], refs: [[q, 1]], queue: [q] }, { inserts: [], rootCounts: [] }, "commits"],
        // n has a root count and no row; the block releases it.
        ["a root count with no row, released", { roots: [[n, 1]] }, { inserts: [], rootCounts: [{ key: n, delta: -1 }] }, "commits"],
        // q is stored with no reference and no root count, and not queued.
        ["a row missing from the queue", { rows: [[q, list()]] }, { inserts: [], rootCounts: [] }, "commits"],
      ];
      for (const [name, found, flush, outcome] of cases) {
        const result = await both(found, flush);
        expect(result.step.outcome, name).toBe(outcome);
        expect(result.run, name).toEqual(result.step);
      }
    }, 300_000);

    it("with sweep off, a queued key that should not be: the step takes it off the queue, the run, which reads the queue only for the keys it changes, leaves it", async () => {
      // g is queued with no row; k is stored, counted once though nothing references it, and queued.
      const result = await both({ rows: [[k, list()]], refs: [[k, 1]], queue: [g, k] }, { inserts: [], rootCounts: [] }, false);
      expect([result.step.outcome, result.run.outcome]).toEqual(["commits", "commits"]);
      expect(result.step.tables.queue).toEqual([]);
      expect(result.run.tables.queue).toEqual([hex(k), hex(g)].sort());
      expect({ ...result.run.tables, queue: [] }).toEqual(result.step.tables);
    }, 120_000);

    it("a count row lost (the TODO at the run's count read): the step reads the reached key's count as 0, deletes it and halts; the run does not read it and stores the block", async () => {
      // q is stored and queued and references k; r, persisted, references k too; k has no count row. The block writes a new root
      // p over k: deleting q takes back the reference p gives k, whose change is then 0.
      const r = key(0x72);
      const found: Parameters<typeof seed>[1] = { rows: [[q, list(k)], [r, list(k)], [k, list()]], roots: [[r, 1]], queue: [q] };
      const result = await both(found, { inserts: [{ key: p, data: Uint8Array.of(1), children: list(k) }], rootCounts: [{ key: p, delta: 1 }] });
      expect([result.step.outcome, result.run.outcome]).toEqual(["missing-reference", "commits"]);
      expect(Object.keys(result.run.tables.rows).sort()).toEqual([hex(k), hex(p), hex(r)].sort());
    }, 120_000);

    it("tables that break closure: the step protects a new node in its block, the run does not, deletes it and halts", async () => {
      // q is stored and queued and references n, which is no row and has no count. The block flushes n and a new root
      // p over n: deleting q takes back the reference p gives n.
      const n = key(0x6e);
      const result = await both({ rows: [[q, list(n)]], queue: [q] }, {
        inserts: [{ key: n, data: Uint8Array.of(1), children: list() }, { key: p, data: Uint8Array.of(2), children: list(n) }],
        rootCounts: [{ key: p, delta: 1 }],
      });
      expect([result.step.outcome, result.run.outcome]).toEqual(["commits", "missing-reference"]);
    }, 120_000);
  });

  describe("each node's own payload, a fixture of nodes whose keys are their payloads' and children's", () => {
    // A leaf and four states over it, each persisted by its block and released by the next.
    const leaf = made("leaf payload");
    const states = [0, 1, 2, 3].map((n) => made(`state ${n} payload`, [ref(leaf)]));
    const blocks = madeBlocks(states.map((state, n) => ({ inserts: n === 0 ? [leaf, state] : [state], persist: [state], ...(n === 0 ? {} : { release: [states[n - 1] as MadeNode] }) })));
    const byKey = new Map([leaf, ...states].map((node) => [node.key, node] as const));
    /** A block's flush with each node's own payload. */
    const withPayloads = (block: ModelBlock): NodeBatch => {
      const flush = flushOf(block.flushed);
      return { ...flush, inserts: flush.inserts.map((node) => ({ ...node, data: (byKey.get(hex(node.key)) as MadeNode).data })) };
    };
    /** The model's tables after `block`, each row with its node's own payload. */
    const want = (block: ModelBlock): Tables => tablesOfModel(block.step.after, (key) => (byKey.get(key) as MadeNode).data);
    const [first, second] = runsOf(blocks, 2) as [ModelBlock[], ModelBlock[]];

    it("carries each node's own payload through the net write, and keeps the stored ones through a run rolled back", async () => {
      const { db } = await backend.database(SCHEMA);
      try {
        await settle(db, first, undefined, withPayloads);
        const afterFirst = await tablesOf(db);
        expect(afterFirst).toEqual(want(first.at(-1) as ModelBlock));
        expect(Object.keys(afterFirst.data).length).toBeGreaterThan(1);
        // The second run's net write affects other rows than computed: rolled back, every payload as it was.
        const halt = await settle(db, second, (net) => ({ ...net, counted: net.counted + 1 }), withPayloads).catch((error: unknown) => error);
        expect(halt).toMatchObject({ details: { reason: "row-count-mismatch" } });
        expect(await tablesOf(db)).toEqual(afterFirst);
        await settle(db, second, undefined, withPayloads);
        expect(await tablesOf(db)).toEqual(want(second.at(-1) as ModelBlock));
      } finally {
        await db.close();
      }
    }, 120_000);

    it("a net write whose inserted payload is not the node's: the tables differ from the model's in nodes.data alone (a negative control of the comparison)", async () => {
      const { db } = await backend.database(SCHEMA);
      try {
        await settle(db, first, undefined, withPayloads);
        // The second run inserts states 2 and 3; the first insert's payload is made another.
        let corrupted = "";
        await settle(
          db,
          second,
          (net) => ({ ...net, inserts: net.inserts.map((node, at) => (at === 0 ? ((corrupted = hex(node.key)), { ...node, data: Uint8Array.of(0xde, 0xad) }) : node)) }),
          withPayloads,
        );
        const after = await tablesOf(db);
        const wanted = want(second.at(-1) as ModelBlock);
        expect(after).not.toEqual(wanted);
        expect({ ...after, data: wanted.data }).toEqual(wanted);
        expect(Object.entries(after.data).filter(([key, data]) => wanted.data[key] !== data)).toEqual([[corrupted, "dead"]]);
      } finally {
        await db.close();
      }
    }, 120_000);
  });

  it("rolls a run back whose net write affects other rows than computed: the tables are those before it", async () => {
    const { db } = await backend.database(SCHEMA);
    try {
      const script = fc.sample(historyScripts({ oneForm: true }), { seed: SEED, numRuns: 30 }).find((sample) => sample.blocks.length >= 6) as HistoryScript;
      const runs = runsOf(modelBlocks({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) }), 3);
      await settle(db, runs[0] as ModelBlock[]);
      const before = await tablesOf(db);
      const halt = await settle(db, runs[1] as ModelBlock[], (computed) => ({ ...computed, counted: computed.counted + 1 })).catch((error: unknown) => error);
      expect(halt).toMatchObject({ code: "ledger-refcount-invalid", details: { reason: "row-count-mismatch", statement: "merge-ref-counts" } });
      expect(await tablesOf(db)).toEqual(before);
      // The same run, as computed, commits.
      await settle(db, runs[1] as ModelBlock[]);
      expect(await tablesOf(db)).toEqual(tablesOfModel((runs[1]?.at(-1) as ModelBlock).step.after));
    } finally {
      await db.close();
    }
  }, 120_000);
});
