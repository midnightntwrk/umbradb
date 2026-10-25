import { createHash } from "node:crypto";
import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Database } from "../../../src/db/api.js";
import { CAPTURE_TRIGGER } from "../../../src/db/change-capture.js";
import { UmbraError } from "../../../src/db/errors.js";
import { encodeArrayHead, encodeCanonical, encodeRow } from "../../../src/determinism/cbor.js";
import type { ColumnType } from "../../../src/deterministic-postgresql/index.js";
import { BACKENDS } from "../../db/backends.js";
import { concatBytes } from "../../determinism/cbor-decoder.js";
import { type Chain, digestRows, runBlock, startChain, testModule } from "./chain.js";

/**
 * A56 (DT-4; task 7.1), property tests on both backends: for random sequences of inserts, updates, deletes and
 * same-value rewrites within one block — upserts, key changes, rows moved between partitions, several rows per
 * statement — the changes change capture records equal the difference between each table's state before and after the
 * block. The oracle reads each table whole at the start and at the end of the block (inside it, in the module's own
 * `on-db-write`), takes the difference by primary key, writes the changes' CBOR from DT-1's row encoding and hashes it
 * with `node:crypto` (DT-5's `SHA-256(previous ‖ CBOR(h) ‖ changes at h)`), and the block's digest must be that; a
 * table without changes must keep its row. `TRUNCATE`, which fires no row trigger, is refused in the block (A73), so
 * no change escapes the triggers. **Negative control:** with the capture trigger disabled on one table, the property
 * fails.
 *
 * Determinism: every property runs with a pinned, reported fast-check seed.
 */

const SEED = 20261025;
const RUNS = 100;

/** The tables of module `p`, each with its DT-1 column types and its key's columns (indexes) in key order. */
const TABLES = {
  "p.kv": { columns: ["k", "v", "n"], types: ["bigint", "text", "bigint"], key: [0] },
  "p.ck": { columns: ["a", "b", "doc"], types: ["text", "bigint", "jsonb"], key: [0, 1] },
  "p.part": { columns: ["k", "part", "v"], types: ["bigint", "integer", "text"], key: [0, 1] },
} as const satisfies Record<string, { columns: readonly string[]; types: readonly ColumnType[]; key: readonly number[] }>;
type TableName = keyof typeof TABLES;

const MIGRATION = `
  CREATE TABLE p.kv (k bigint PRIMARY KEY, v text NOT NULL, n bigint);
  CREATE TABLE p.ck (a text, b bigint, doc jsonb, PRIMARY KEY (a, b));
  CREATE TABLE p.part (k bigint, part integer, v text, PRIMARY KEY (k, part)) PARTITION BY LIST (part);
  CREATE TABLE p.part_1 PARTITION OF p.part FOR VALUES IN (1);
  CREATE TABLE p.part_2 PARTITION OF p.part FOR VALUES IN (2);`;

/** One statement of a block, as SQL and parameters. */
type Op = readonly [string, unknown[]];

const kvKey = fc.integer({ min: 0, max: 5 }).map(BigInt);
const word = fc.constantFrom("a", "b", "B", "é", "");
const ckKey = fc.tuple(fc.constantFrom("a", "B", "b", "é", "ab"), fc.integer({ min: 0, max: 2 }).map(BigInt));
const doc = fc.oneof(
  fc.constant(null),
  fc.record({ x: fc.integer({ min: -3, max: 3 }) }),
  fc.constant({ y: [1, { z: 2 }] }),
);

/** The statements a block may run: always valid, so the block commits. */
const opArb: fc.Arbitrary<Op> = fc.oneof(
  fc.tuple(kvKey, word, fc.option(fc.integer({ min: 0, max: 3 }).map(BigInt))).map(
    ([k, v, n]): Op => ["INSERT INTO p.kv (k, v, n) VALUES ($1, $2, $3) ON CONFLICT (k) DO NOTHING", [k, v, n]],
  ),
  fc.tuple(kvKey, word).map(([k, v]): Op => [
    "INSERT INTO p.kv (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v",
    [k, v],
  ]),
  fc.tuple(kvKey, word).map(([k, v]): Op => ["UPDATE p.kv SET v = $2 WHERE k = $1", [k, v]]),
  kvKey.map((k): Op => ["UPDATE p.kv SET v = v, n = n WHERE k = $1", [k]]),
  fc.constant<Op>(["UPDATE p.kv SET v = v", []]),
  kvKey.map((k): Op => ["DELETE FROM p.kv WHERE k = $1", [k]]),
  fc.tuple(kvKey, kvKey).map(([k, to]): Op => [
    "UPDATE p.kv SET k = $2 WHERE k = $1 AND NOT EXISTS (SELECT 1 FROM p.kv WHERE k = $2)",
    [k, to],
  ]),
  fc.tuple(kvKey, kvKey).map(([lo, hi]): Op => ["DELETE FROM p.kv WHERE k BETWEEN $1 AND $2", [lo, hi]]),
  fc.tuple(ckKey, doc).map(([[a, b], d]): Op => [
    "INSERT INTO p.ck (a, b, doc) VALUES ($1, $2, $3) ON CONFLICT (a, b) DO UPDATE SET doc = EXCLUDED.doc",
    [a, b, d],
  ]),
  ckKey.map(([a, b]): Op => ["UPDATE p.ck SET doc = doc WHERE a = $1 AND b = $2", [a, b]]),
  ckKey.map(([a, b]): Op => ["DELETE FROM p.ck WHERE a = $1 AND b = $2", [a, b]]),
  fc.tuple(kvKey, fc.constantFrom(1, 2), word).map(([k, part, v]): Op => [
    "INSERT INTO p.part (k, part, v) VALUES ($1, $2, $3) ON CONFLICT (k, part) DO UPDATE SET v = EXCLUDED.v",
    [k, part, v],
  ]),
  // A row moved to the other partition, when the key it moves to is free.
  kvKey.map((k): Op => [
    "UPDATE p.part AS r SET part = 3 - r.part WHERE r.k = $1 AND NOT EXISTS " +
      "(SELECT 1 FROM p.part AS o WHERE o.k = r.k AND o.part = 3 - r.part)",
    [k],
  ]),
  kvKey.map((k): Op => ["DELETE FROM p.part WHERE k = $1", [k]]),
);

/** Each table's rows, read whole in the block, by their key as JSON. */
type States = Record<TableName, Map<string, unknown[]>>;

async function readStates(w: BlockWriteHandle): Promise<States> {
  const states = {} as States;
  for (const [name, table] of Object.entries(TABLES) as [TableName, (typeof TABLES)[TableName]][]) {
    const rows = await w.query(`SELECT ${table.columns.join(", ")} FROM ${name}`);
    const map = new Map<string, unknown[]>();
    for (const row of rows) {
      const values = table.columns.map((column) => row[column]);
      map.set(keyId(table.key.map((i) => values[i])), values);
    }
    states[name] = map;
  }
  return states;
}

function keyId(key: readonly unknown[]): string {
  return JSON.stringify(key, (_, value: unknown) => (typeof value === "bigint" ? `${value}n` : value));
}

const utf8 = new TextEncoder();

/** DT-2's order of two keys of `table`, written here: text by its UTF-8 bytes, integers by value. */
function compareKeys(a: readonly unknown[], b: readonly unknown[]): number {
  for (let i = 0; i < a.length; i++) {
    const [x, y] = [a[i], b[i]];
    if (typeof x === "string" && typeof y === "string") {
      const [p, q] = [utf8.encode(x), utf8.encode(y)];
      for (let j = 0; j < Math.min(p.length, q.length); j++) if (p[j] !== q[j]) return (p[j] as number) - (q[j] as number);
      if (p.length !== q.length) return p.length - q.length;
    } else if (BigInt(x as bigint) !== BigInt(y as bigint)) {
      return BigInt(x as bigint) < BigInt(y as bigint) ? -1 : 1;
    }
  }
  return 0;
}

/** The oracle: `table`'s changes between two of its states, as DT-4's CBOR array, written out here. */
function expectedChanges(name: TableName, before: Map<string, unknown[]>, after: Map<string, unknown[]>): Uint8Array | null {
  const table = TABLES[name];
  const keys = [...new Set([...before.keys(), ...after.keys()])]
    .map((id) => (before.get(id) ?? after.get(id)) as unknown[])
    .map((row) => table.key.map((i) => row[i]))
    .sort(compareKeys);
  const changes: Uint8Array[] = [];
  for (const key of keys) {
    const [old, now] = [before.get(keyId(key)), after.get(keyId(key))];
    const row = (values: readonly unknown[]) => encodeRow(values, table.types);
    let change: [string, Uint8Array] | null = null;
    if (old === undefined && now !== undefined) change = ["insert", row(now)];
    else if (old !== undefined && now === undefined) change = ["delete", row(old)];
    else if (old !== undefined && now !== undefined && Buffer.compare(row(old), row(now)) !== 0) change = ["update", row(now)];
    if (change !== null) changes.push(concatBytes(encodeArrayHead(2), encodeCanonical(change[0]), change[1]));
  }
  return changes.length === 0 ? null : concatBytes(encodeArrayHead(changes.length), ...changes);
}

describe.each(BACKENDS)("A56: recorded changes equal the difference of the block's states, on $name (DT-4)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** The ops the next block runs, and the states the module reads at its start and end. */
  const next: { ops: readonly Op[]; before?: States; after?: States } = { ops: [] };

  const moduleP = testModule("p", {
    provides: [
      { name: "p-rows", lifetimes: ["table"], table: { schema: "p", tables: ["kv", "ck", "part"], kind: "mutable" } },
    ],
    migrations: [{ id: "001", sql: MIGRATION }],
    points: {
      async "on-db-write"(_p, _b, w) {
        next.before = await readStates(w);
        for (const [sql, params] of next.ops) await w.execute(sql, params);
        next.after = await readStates(w);
      },
    },
  });

  let chain: Chain;

  beforeAll(async () => {
    const { db } = await backend.database("SELECT 1");
    chain = await startChain(db, [moduleP]);
  }, 120_000);

  /** Runs one block with `ops` and checks every table's digest against the oracle; true when all agree. */
  async function blockAgrees(db: Database, ops: readonly Op[]): Promise<boolean> {
    const previous = await digestRows(db);
    next.ops = ops;
    const h = await runBlock(chain);
    const rows = await digestRows(db);
    for (const name of Object.keys(TABLES) as TableName[]) {
      const changes = expectedChanges(name, next.before?.[name] ?? new Map(), next.after?.[name] ?? new Map());
      const was = previous[name];
      if (changes === null) {
        if (JSON.stringify(rows[name], (_, v: unknown) => (typeof v === "bigint" ? String(v) : v)) !==
          JSON.stringify(was, (_, v: unknown) => (typeof v === "bigint" ? String(v) : v))) return false;
        continue;
      }
      const prior = was === undefined ? new Uint8Array(32) : Buffer.from(was.digest, "hex");
      const digest = createHash("sha256").update(concatBytes(prior, encodeCanonical(h), changes)).digest("hex");
      if (rows[name]?.digest !== digest || rows[name]?.height !== h) return false;
    }
    return true;
  }

  /** An error a block threw while a property ran (none is expected: every generated block is valid and commits). */
  let thrown: unknown;

  const property = () =>
    fc.asyncProperty(fc.array(opArb, { minLength: 1, maxLength: 14 }), async (ops) => {
      try {
        return await blockAgrees(chain.db, ops);
      } catch (error) {
        thrown ??= error;
        throw error;
      }
    });

  it("A56: for random blocks, every table's recorded changes equal the difference of its states", async () => {
    await fc.assert(property(), { seed: SEED, numRuns: RUNS });
    // Not vacuous: the blocks changed every table, and each table's digest moved on.
    const rows = await digestRows(chain.db);
    expect(Object.keys(rows).sort()).toEqual(["core_block_commit.blocks", "p.ck", "p.kv", "p.part"]);
  }, 300_000);

  it("A56: a block that only rewrites rows as they were, or inserts and deletes the same row, records no change", async () => {
    await fc.assert(property(), { seed: SEED, numRuns: 5 });
    const before = await digestRows(chain.db);
    expect(await blockAgrees(chain.db, [["UPDATE p.kv SET v = v", []], ["UPDATE p.ck SET doc = doc", []]])).toBe(true);
    expect(
      await blockAgrees(chain.db, [
        ["INSERT INTO p.kv (k, v) VALUES (100, 'tmp')", []],
        ["UPDATE p.kv SET v = 'tmp2' WHERE k = 100", []],
        ["DELETE FROM p.kv WHERE k = 100", []],
      ]),
    ).toBe(true);
    const after = await digestRows(chain.db);
    for (const name of Object.keys(TABLES)) expect(after[name], name).toEqual(before[name]);
  }, 120_000);

  it("A56 with A73: TRUNCATE in the block is refused, so no change escapes the triggers", async () => {
    const before = await digestRows(chain.db);
    next.ops = [["INSERT INTO p.kv (k, v) VALUES (200, 'x') ON CONFLICT (k) DO NOTHING", []], ["TRUNCATE p.kv", []]];
    const refused = await runBlock(chain).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).code).toBe("truncate-not-allowed");
    // The block rolled back with its digests (and the loop's cursor did not move).
    expect(await digestRows(chain.db)).toEqual(before);
  }, 60_000);

  it("negative control: with the capture trigger disabled on one table, the property fails", async () => {
    await chain.db.transaction((tx) => tx.execute(`ALTER TABLE p.kv DISABLE TRIGGER ${CAPTURE_TRIGGER}`));
    try {
      thrown = undefined;
      const outcome = await fc.assert(property(), { seed: SEED, numRuns: RUNS }).then(
        () => "held",
        (error: unknown) => error,
      );
      expect(outcome).toBeInstanceOf(Error);
      expect(String((outcome as Error).message)).toMatch(/Property failed/);
      // For the intended reason: a block's recorded changes differed from its states' (no block failed).
      expect(thrown).toBeUndefined();
      expect(await blockAgrees(chain.db, [["INSERT INTO p.kv (k, v) VALUES (300, 'x')", []]])).toBe(false);
    } finally {
      await chain.db.transaction((tx) => tx.execute(`ALTER TABLE p.kv ENABLE TRIGGER ${CAPTURE_TRIGGER}`));
    }
    // And with it enabled again, the property holds again (the digests went on from where they were).
    await fc.assert(property(), { seed: SEED + 1, numRuns: 10 });
  }, 300_000);
});
