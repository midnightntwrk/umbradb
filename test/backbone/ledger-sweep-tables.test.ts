import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_MIGRATIONS } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import {
  GREY_TABLE,
  MARKS_TABLE,
  SWEEP_TABLE,
  sqlSweepTables,
  sweepReset,
  type SweepWrites,
  writeSweep,
} from "../../src/backbone/core-ledger-state/sweep.js";
import type { Database, ReadHandle } from "../../src/db/api.js";
import { openPgliteOn, PGLITE_START_PARAMS } from "../../src/db/pglite.js";

/**
 * The sweep's tables (task 17.5b; LG-14, `design.md` §10, owner decision Q158 A): `sqlSweepTables`' reads and
 * `writeSweep`'s statements on `core_ledger_state`'s own tables (its two migrations, on an in-memory PGlite), each
 * read on its own — the process tests (`ledger-sweep-process.test.ts`) run them only inside a whole step — and the
 * refusals no step reaches: a missing sweep row, a column that is not bytes, the requests for no key, and a step that
 * writes neither marks nor a cleared set.
 */

const key = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const NODES = "core_ledger_state.nodes";
const ROOT_COUNTS = "core_ledger_state.root_counts";

/** A step's writes: nothing but `after` unless given. */
function writes(rest: Partial<SweepWrites>): SweepWrites {
  return {
    before: { cycle: 0n, phase: "idle", sweepAfter: null },
    after: { cycle: 0n, phase: "idle", sweepAfter: null },
    greyInserted: [],
    greyDeleted: [],
    greyAll: false,
    marksInserted: [],
    marksCleared: false,
    deleted: [],
    units: 0,
    ...rest,
  };
}

/** A read whose every statement returns `rows`, recording what it was asked. */
function cannedRead(rows: Record<string, unknown>[]): { read: Pick<ReadHandle, "query">; asked: string[] } {
  const asked: string[] = [];
  return { asked, read: { query: async (sql: string) => (asked.push(sql), rows) } as Pick<ReadHandle, "query"> };
}

describe("the sweep's tables on PGlite (task 17.5b, Q158 A)", () => {
  let engine: PGlite;
  let db: Database;
  const read = <T>(body: (tables: ReturnType<typeof sqlSweepTables>) => Promise<T>): Promise<T> =>
    db.read((handle) => body(sqlSweepTables(handle)));
  const exec = (sql: string, params: unknown[] = []): Promise<number> => db.transaction((tx) => tx.execute(sql, params));

  beforeAll(async () => {
    engine = await PGlite.create({ startParams: [...PGLITE_START_PARAMS] });
    await engine.exec(`CREATE SCHEMA core_ledger_state; ${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join(";\n")}`);
    db = await openPgliteOn(engine, { committedHeight: async () => null });
  });
  afterAll(async () => {
    await db?.close();
  });
  beforeEach(async () => {
    for (const table of [NODES, ROOT_COUNTS, GREY_TABLE, MARKS_TABLE]) await exec(`DELETE FROM ${table}`);
    await exec(`UPDATE ${SWEEP_TABLE} SET cycle = 0, phase = 'idle', sweep_after = NULL WHERE id = 1`);
  });

  it("reads the row as its migration inserts it, and as a step wrote it: the cycle a bigint, the position bytes", async () => {
    expect(await read((t) => t.state())).toEqual({ cycle: 0n, phase: "idle", sweepAfter: null });
    await db.transaction((tx) => writeSweep(tx, writes({ after: { cycle: 7n, phase: "sweep", sweepAfter: key(9) } })));
    const state = await read((t) => t.state());
    expect(state).toEqual({ cycle: 7n, phase: "sweep", sweepAfter: key(9) });
    expect(state.sweepAfter).toBeInstanceOf(Uint8Array);
  });

  it("refuses a database whose sweep row is missing, naming the table", async () => {
    await exec(`DELETE FROM ${SWEEP_TABLE}`);
    try {
      await expect(read((t) => t.state())).rejects.toThrow(
        "core_ledger_state.sweep holds no row (its migration inserts it)",
      );
    } finally {
      await exec(`INSERT INTO ${SWEEP_TABLE} (id, cycle, phase, sweep_after) VALUES (1, 0, 'idle', NULL)`);
    }
  });

  it("reads the roots, the smallest grey keys and every grey key in byte order", async () => {
    for (const byte of [0x30, 0x02, 0xf0]) await exec(`INSERT INTO ${ROOT_COUNTS} (node_key, count) VALUES ($1, 1)`, [key(byte)]);
    await db.transaction((tx) => writeSweep(tx, writes({ greyInserted: [key(0x90), key(0x05), key(0x41)] })));
    expect((await read((t) => t.roots())).map(hex)).toEqual([key(0x02), key(0x30), key(0xf0)].map(hex));
    expect((await read((t) => t.smallestGrey(2))).map(hex)).toEqual([key(0x05), key(0x41)].map(hex));
    expect((await read((t) => t.smallestGrey(5))).map(hex)).toEqual([key(0x05), key(0x41), key(0x90)].map(hex));
    expect((await read((t) => t.allGrey())).map(hex)).toEqual([key(0x05), key(0x41), key(0x90)].map(hex));
  });

  it("tells for each key asked whether it is grey and whether it is marked, in one statement", async () => {
    await db.transaction((tx) => writeSweep(tx, writes({ greyInserted: [key(1), key(3)], marksInserted: [key(2), key(3)] })));
    const flags = await read((t) => t.flags([key(1), key(2), key(3), key(4)]));
    expect(Object.fromEntries(flags)).toEqual({
      [hex(key(1))]: { grey: true, marked: false },
      [hex(key(2))]: { grey: false, marked: true },
      [hex(key(3))]: { grey: true, marked: true },
      [hex(key(4))]: { grey: false, marked: false },
    });
  });

  it("asks nothing for no key: flags and children give an empty map without a statement", async () => {
    const { read: canned, asked } = cannedRead([{ node_key: key(1), grey: true, marked: true, children: key(2) }]);
    const tables = sqlSweepTables(canned);
    expect((await tables.flags([])).size).toBe(0);
    expect((await tables.children([])).size).toBe(0);
    expect(asked).toEqual([]);
    expect((await tables.flags([key(1)])).size).toBe(1);
    expect((await tables.children([key(1)])).size).toBe(1);
    expect(asked).toHaveLength(2);
  });

  it("gives the child lists of the stored nodes asked for, none for a key not stored", async () => {
    await exec(`INSERT INTO ${NODES} (node_key, data, children) VALUES ($1, $2, $3), ($4, $5, $6)`, [
      key(1), Uint8Array.of(1), Uint8Array.of(0xaa, 0xbb), key(2), Uint8Array.of(2), Uint8Array.of(),
    ]);
    const children = await read((t) => t.children([key(1), key(2), key(3)]));
    expect([...children.keys()].sort()).toEqual([hex(key(1)), hex(key(2))]);
    expect(children.get(hex(key(1)))).toEqual(Uint8Array.of(0xaa, 0xbb));
    expect(children.get(hex(key(2)))).toEqual(Uint8Array.of());
  });

  it("scans the stored nodes in byte order from the start or after a position, at most the limit, with their marks", async () => {
    for (const byte of [5, 1, 9, 3]) {
      await exec(`INSERT INTO ${NODES} (node_key, data, children) VALUES ($1, $2, $3)`, [key(byte), Uint8Array.of(byte), Uint8Array.of()]);
    }
    await db.transaction((tx) => writeSweep(tx, writes({ marksInserted: [key(3), key(9)] })));
    const shown = (rows: { key: Uint8Array; marked: boolean }[]) => rows.map((row) => [row.key[0], row.marked]);
    expect(shown(await read((t) => t.scan(null, 3)))).toEqual([[1, false], [3, true], [5, false]]);
    expect(shown(await read((t) => t.scan(key(3), 10)))).toEqual([[5, false], [9, true]]);
    expect(shown(await read((t) => t.scan(key(3), 1)))).toEqual([[5, false]]);
    expect(await read((t) => t.scan(key(9), 10))).toEqual([]);
  });

  it("writes a step that only moves the row: no grey, marks or node statement", async () => {
    await exec(`INSERT INTO ${NODES} (node_key, data, children) VALUES ($1, $2, $3)`, [key(1), Uint8Array.of(1), Uint8Array.of()]);
    await db.transaction((tx) => writeSweep(tx, writes({ greyInserted: [key(4)], marksInserted: [key(5)] })));
    const statements: string[] = [];
    await db.transaction((tx) =>
      writeSweep(
        { execute: (sql, params) => (statements.push(sql.split(" ").slice(0, 3).join(" ")), tx.execute(sql, params)) },
        writes({ after: { cycle: 2n, phase: "mark", sweepAfter: null } }),
      ),
    );
    expect(statements).toEqual(["UPDATE core_ledger_state.sweep SET"]);
    expect((await read((t) => t.allGrey())).map(hex)).toEqual([hex(key(4))]);
    expect(Object.fromEntries(await read((t) => t.flags([key(5)])))).toEqual({ [hex(key(5))]: { grey: false, marked: true } });
    expect((await read((t) => t.scan(null, 5))).map((row) => hex(row.key))).toEqual([hex(key(1))]);
    expect(await read((t) => t.state())).toEqual({ cycle: 2n, phase: "mark", sweepAfter: null });
  });

  it("deletes the grey keys that left, the nodes swept, and clears the marks or every set as told", async () => {
    for (const byte of [1, 2, 3]) {
      await exec(`INSERT INTO ${NODES} (node_key, data, children) VALUES ($1, $2, $3)`, [key(byte), Uint8Array.of(byte), Uint8Array.of()]);
    }
    await db.transaction((tx) => writeSweep(tx, writes({ greyInserted: [key(6), key(7)], marksInserted: [key(8), key(9)] })));
    await db.transaction((tx) =>
      writeSweep(tx, writes({ greyDeleted: [key(6)], deleted: [key(2)], marksCleared: true, marksInserted: [key(4)] })),
    );
    expect((await read((t) => t.allGrey())).map(hex)).toEqual([hex(key(7))]);
    expect(Object.fromEntries(await read((t) => t.flags([key(4), key(8)])))).toEqual({
      [hex(key(4))]: { grey: false, marked: false },
      [hex(key(8))]: { grey: false, marked: false },
    });
    expect((await read((t) => t.scan(null, 5))).map((row) => row.key[0])).toEqual([1, 3]);
    await db.transaction((tx) => writeSweep(tx, writes({ greyInserted: [key(5)], marksInserted: [key(5)] })));
    await db.transaction((tx) => writeSweep(tx, { ...sweepReset({ cycle: 4n, phase: "sweep", sweepAfter: key(3) }) }));
    expect(await read((t) => t.allGrey())).toEqual([]);
    expect(Object.fromEntries(await read((t) => t.flags([key(5)])))).toEqual({ [hex(key(5))]: { grey: false, marked: false } });
    expect(await read((t) => t.state())).toEqual({ cycle: 4n, phase: "idle", sweepAfter: null });
  });
});

describe("the sweep's tables refuse a column that is not bytes (task 17.5b, Q158 A)", () => {
  it("names the table and column of a key, a child list and the position that are not bytes", async () => {
    const text = (rows: Record<string, unknown>[]) => sqlSweepTables(cannedRead(rows).read);
    await expect(text([{ node_key: "0a" }]).roots()).rejects.toThrow(new TypeError("core_ledger_state.root_counts.node_key is not bytes"));
    await expect(text([{ node_key: "0a" }]).smallestGrey(1)).rejects.toThrow(new TypeError("core_ledger_state.grey.node_key is not bytes"));
    await expect(text([{ node_key: "0a" }]).allGrey()).rejects.toThrow(new TypeError("core_ledger_state.grey.node_key is not bytes"));
    await expect(text([{ node_key: "0a", grey: true, marked: false }]).flags([key(1)])).rejects.toThrow(new TypeError("a key is not bytes"));
    await expect(text([{ node_key: key(1), children: "0a" }]).children([key(1)])).rejects.toThrow(
      new TypeError("core_ledger_state.nodes.children is not bytes"),
    );
    await expect(text([{ node_key: [1], children: key(1) }]).children([key(1)])).rejects.toThrow(
      new TypeError("core_ledger_state.nodes.node_key is not bytes"),
    );
    await expect(text([{ node_key: "0a", marked: false }]).scan(null, 1)).rejects.toThrow(
      new TypeError("core_ledger_state.nodes.node_key is not bytes"),
    );
    await expect(text([{ cycle: 1, phase: "sweep", sweep_after: "0a" }]).state()).rejects.toThrow(
      new TypeError("core_ledger_state.sweep.sweep_after is not bytes"),
    );
  });

  it("reads a flag that is not exactly true as false, and a cycle given as text or a number as a bigint", async () => {
    const { read } = cannedRead([{ node_key: key(1), grey: "t", marked: 1 }]);
    expect(Object.fromEntries(await sqlSweepTables(read).flags([key(1)]))).toEqual({ [hex(key(1))]: { grey: false, marked: false } });
    for (const cycle of ["12", 12, 12n]) {
      const state = await sqlSweepTables(cannedRead([{ cycle, phase: "mark", sweep_after: null }]).read).state();
      expect(state).toEqual({ cycle: 12n, phase: "mark", sweepAfter: null });
    }
    const scan = await sqlSweepTables(cannedRead([{ node_key: key(1), marked: "t" }]).read).scan(key(0), 1);
    expect(scan).toEqual([{ key: key(1), marked: false }]);
  });
});
