import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { LEDGER_NODE_TABLES, nodeTablesContent } from "../../src/backbone/core-ledger-state/node-set.js";
import { CORE_LEDGER_STATE_MIGRATIONS } from "../../src/backbone/core-ledger-state/sql.js";
import { CORE_MODULES, PUBLIC_BACKBONE } from "../../src/cli/build-modules.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import * as umbra from "../../src/index.js";
import { contentsHashOf } from "../../src/library/contents-hash.js";
import { declaredContentDefined } from "../../src/modules/adapters.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { DETERMINISM_BACKENDS } from "../determinism/backends.js";
import { startPglite } from "../determinism/pglite-database.js";
import { startPostgres, type TestDatabase, type TestServer } from "../determinism/postgres-database.js";
import { type Child, childKey, encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import { contentDefinedLedgerState, countsAndQueue, type StoredRow } from "./content-defined-build.js";

/**
 * The contents hash of `core-ledger-state`'s node tables, content-defined (`src/backbone/core-ledger-state/node-set.ts`),
 * on PostgreSQL 18 and PGlite 0.5.10, with the build's own declaration (`CORE_LEDGER_STATE`'s `ledger-state` item), on
 * databases built for it: the part's own migration, rows of real node format (`../ledger/node-format.ts`, independent
 * of `src/`), and the counts and queue its rows give.
 *
 * - Two databases holding the same nodes, one with a small node embedded in its parent and the other with it
 *   referenced and stored as its own row, hash equal; one more queued node (its row and its `unreferenced` entry) makes
 *   the hash differ; one byte of a row's payload or child list changed fails the computation with
 *   `ledger-refcount-invalid` (`details.check` `node-key`), as does a child list with a length in more bytes than it
 *   needs (the ledger refuses it), and counts or a queue its rows do not give fail it with
 *   reason `tables-inconsistent` (`closure`, `roots`, `counts`, `queue`) — here through the exported `contentsHash`
 *   itself; the backup and the restore are `../backup/restore-content-defined.test.ts`. Its three negative controls,
 *   each a test build (`./content-defined-build.ts`) declaring the tables otherwise: `nodes` hashed by its raw rows, a
 *   constant in place of the node set, the key check skipped. The clause of `src/ledger/node-key.ts` on the tapes is
 *   `../ledger/node-key-tape-*.test.ts`.
 * - The same rows give the same hash on both backends; one byte of a table that is not content-defined changes
 *   it; one byte of a `nodes` row fails the computation.
 */

/** The build whose declarations the hash is computed with: the build's own `core-ledger-state`. */
const BUILD: readonly ModuleDeclaration[] = [CORE_LEDGER_STATE];

/** The contents hash: the exported function, which takes the build's own declarations. */
const buildHash = umbra.contentsHash;

/** A node: its payload and its children. */
interface Node {
  readonly data: Uint8Array;
  readonly children: Child[];
}

const text = (value: string): Uint8Array => new TextEncoder().encode(value);
const keyOf = (node: Node): Uint8Array => nodeKey(node.data, node.children.map(childKey));
const rowOf = (node: Node): StoredRow => ({ key: keyOf(node), data: node.data, children: encodeChildren(node.children) });

const LEAF_ONE: Node = { data: text("leaf one"), children: [] };
const LEAF_TWO: Node = { data: text("leaf two"), children: [] };
/** Embedded in {@link SMALL} in both spellings. */
const TINY: Node = { data: text("tiny"), children: [] };
/** The small node one spelling embeds in the parent and the other stores as its own row. */
const SMALL: Node = { data: text("small"), children: [{ direct: TINY }, { ref: keyOf(LEAF_ONE) }] };
/** The parent, persisted, with the small node embedded; `LEAF_ONE` is referenced twice through it. */
const EMBEDDING: Node = {
  data: text("parent"),
  children: [{ direct: SMALL }, { ref: keyOf(LEAF_ONE) }, { ref: keyOf(LEAF_TWO) }],
};
/** The same parent with the small node referenced. */
const REFERENCING: Node = {
  data: text("parent"),
  children: [{ ref: keyOf(SMALL) }, { ref: keyOf(LEAF_ONE) }, { ref: keyOf(LEAF_TWO) }],
};
/** A node nothing references or persists: queued. */
const QUEUED: Node = { data: text("queued"), children: [] };

const PARENT = hex(keyOf(EMBEDDING));
const ROOTS: readonly (readonly [string, number])[] = [[PARENT, 1]];

/** The rows of each spelling. */
const EMBEDDED_ROWS: readonly StoredRow[] = [rowOf(EMBEDDING), rowOf(LEAF_ONE), rowOf(LEAF_TWO)];
const REFERENCED_ROWS: readonly StoredRow[] = [rowOf(REFERENCING), rowOf(SMALL), rowOf(LEAF_ONE), rowOf(LEAF_TWO)];

/** The node set both spellings hold, in byte order. */
const NODE_SET = [EMBEDDING, SMALL, TINY, LEAF_ONE, LEAF_TWO].map((node) => hex(keyOf(node))).sort();

/** One database's ledger tables: its rows, root counts and, unless given, the counts and queue its rows give. */
interface Tables {
  readonly rows: readonly StoredRow[];
  readonly roots?: readonly (readonly [string, number])[];
  readonly counts?: readonly (readonly [string, number])[];
  readonly queue?: readonly string[];
  /** One byte of the states row's root changed. */
  readonly otherState?: boolean;
}

const literal = (bytes: Uint8Array | string): string => `'\\x${typeof bytes === "string" ? bytes : hex(bytes)}'`;
const state = (byte: string): string => literal(byte.repeat(32));

/** The SQL of a database holding `tables` in `core_ledger_state`, made by the part's own migration. */
function databaseSql(tables: Tables): string {
  const roots = tables.roots ?? ROOTS;
  const given = () => countsAndQueue(tables.rows, new Set(roots.map(([key]) => key)));
  const counts = tables.counts ?? given().counts;
  const queue = tables.queue ?? given().queue;
  const values = (rows: readonly string[]) => (rows.length === 0 ? "" : `VALUES ${rows.join(", ")}`);
  const insert = (table: string, rows: readonly string[]) => (rows.length === 0 ? "" : `INSERT INTO core_ledger_state.${table} ${values(rows)};`);
  return [
    "CREATE SCHEMA core_ledger_state;",
    (CORE_LEDGER_STATE_MIGRATIONS[0] as { sql: string }).sql,
    insert("nodes", tables.rows.map((row) => `(${literal(row.key)}, ${literal(row.data)}, ${literal(row.children)})`)),
    insert("root_counts", roots.map(([key, count]) => `(${literal(key)}, ${count})`)),
    insert("ref_counts", counts.map(([key, count]) => `(${literal(key)}, ${count})`)),
    insert("unreferenced", queue.map((key) => `(${literal(key)})`)),
    insert("states", [
      `(7, ${state("11")}, ${tables.otherState === true ? state("23") : state("22")}, 0, ${state("33")}, 0, ${state("44")}, 0, ${state("55")})`,
    ]),
  ].join("\n");
}

/** `rows` with the row of `key` changed by `change`. */
function changedRow(rows: readonly StoredRow[], key: string, change: (row: StoredRow) => StoredRow): StoredRow[] {
  return rows.map((row) => (hex(row.key) === key ? change(row) : row));
}

/** `bytes` with its byte at `at` (from the end when negative) flipped. */
function flipped(bytes: Uint8Array, at: number): Uint8Array {
  const out = Uint8Array.from(bytes);
  const index = at < 0 ? out.length + at : at;
  out[index] = (out[index] as number) ^ 0x01;
  return out;
}

const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/**
 * `bytes` with the SCALE length at `at`, in one byte, spelled in `width` bytes instead: the same number in more bytes
 * than it needs, which the ledger refuses ("non-canonical scale encoding").
 */
function widened(bytes: Uint8Array, at: number, width: 2 | 4): Uint8Array {
  const first = bytes[at] as number;
  const spelled = width === 2 ? [first | 0b01, 0] : [first | 0b10, 0, 0, 0];
  return Uint8Array.from([...bytes.subarray(0, at), ...spelled, ...bytes.subarray(at + 1)]);
}

/** What computing the hash with `hash` rejects with, or "hashed". */
async function outcome(db: TestDatabase, hash = buildHash): Promise<unknown> {
  return db.read((read) => hash(read)).then(
    () => "hashed",
    (error: unknown) => error,
  );
}

/** `ledger-refcount-invalid` with reason `tables-inconsistent`, naming `check` and `key`. */
const inconsistent = (check: string, key: string) =>
  expect.objectContaining({ code: "ledger-refcount-invalid", details: { reason: "tables-inconsistent", check, key: `0x${key}` } });

describe("the two spellings of the fixture", () => {
  it("hold one parent key, one node set, and differ in their rows, counts and queue", () => {
    expect(hex(keyOf(REFERENCING))).toBe(PARENT);
    expect(hex(EMBEDDED_ROWS[0]?.children as Uint8Array)).not.toBe(hex(REFERENCED_ROWS[0]?.children as Uint8Array));
    const roots = new Set([PARENT]);
    expect(countsAndQueue(EMBEDDED_ROWS, roots)).toEqual({
      counts: [
        [hex(keyOf(LEAF_ONE)), 2],
        [hex(keyOf(LEAF_TWO)), 1],
      ].sort(([a], [b]) => (String(a) < String(b) ? -1 : 1)),
      queue: [],
    });
    expect(countsAndQueue(REFERENCED_ROWS, roots).counts).toHaveLength(3);
    expect(NODE_SET).toHaveLength(5);
  });
});

describe.each(DETERMINISM_BACKENDS)("core-ledger-state's node tables in the contents hash, on $name", (backend) => {
  let server: TestServer;

  beforeAll(async () => {
    server = await backend.start();
  }, 180_000);

  afterAll(async () => {
    await server?.stop();
  }, 60_000);

  async function database(tables: Tables): Promise<TestDatabase> {
    const db = await server.create();
    await db.exec(databaseSql(tables));
    return db;
  }

  const hashOf = async (db: TestDatabase, hash = buildHash): Promise<string> => hexOf(await db.read((read) => hash(read)));

  it("the content: nodes by its node set (rows and embedded nodes, each once, in byte order), ref_counts and unreferenced by name", async () => {
    for (const rows of [EMBEDDED_ROWS, REFERENCED_ROWS]) {
      const db = await database({ rows });
      for (const pageSize of [1, 2, undefined]) {
        const content = await db.read((read) => nodeTablesContent()(read, pageSize === undefined ? {} : { pageSize }));
        expect([...content.keys()].sort()).toEqual(["nodes", "ref_counts", "unreferenced"]);
        const nodes = content.get("nodes");
        expect(nodes?.columns).toEqual([{ name: "node_key", type: "bytea" }]);
        expect(nodes?.rows.map(([key]) => hexOf(key as Uint8Array))).toEqual(NODE_SET);
        expect(content.get("ref_counts")).toBeNull();
        expect(content.get("unreferenced")).toBeNull();
      }
    }
    expect(LEDGER_NODE_TABLES.tables).toEqual(["nodes", "ref_counts", "unreferenced"]);
    const db = await database({ rows: EMBEDDED_ROWS });
    for (const pageSize of [0, 1.5]) {
      await expect(db.read((read) => nodeTablesContent()(read, { pageSize }))).rejects.toThrow(RangeError);
    }
  }, 120_000);

  it(
    "two databases holding the same ledger nodes, one with a small node embedded in its parent and the other with " +
      "it referenced and stored as its own row, each with the counts and queue its rows give, have equal contents hashes",
    async () => {
      const embedded = await database({ rows: EMBEDDED_ROWS });
      const referenced = await database({ rows: REFERENCED_ROWS });
      expect(await hashOf(referenced)).toBe(await hashOf(embedded));
      // Not vacuous: by their bytes (today's rule) the two differ.
      const bytes = (db: TestDatabase) => db.read(async (read) => hexOf(await contentsHash(read)));
      expect(await bytes(referenced)).not.toBe(await bytes(embedded));
    },
    120_000,
  );

  it(
    "with every other table held fixed, one that also holds one more queued node (its row and its unreferenced " +
      "entry, no reference, no root count) has a different hash",
    async () => {
      const base = await database({ rows: EMBEDDED_ROWS });
      const more = await database({ rows: [...EMBEDDED_ROWS, rowOf(QUEUED)] });
      const queued = await more.read((read) => read.query("SELECT node_key FROM core_ledger_state.unreferenced"));
      expect(queued.map((row) => hexOf(row.node_key as Uint8Array))).toEqual([hex(keyOf(QUEUED))]);
      expect(await hashOf(more)).not.toBe(await hashOf(base));
    },
    120_000,
  );

  it(
    "one byte of a nodes row's payload or child list changed makes the computation fail with " +
      "ledger-refcount-invalid (details.check node-key), naming the row's key",
    async () => {
      const cases: readonly (readonly [string, (row: StoredRow) => StoredRow])[] = [
        ["a payload byte", (row) => ({ ...row, data: flipped(row.data, 0) })],
        ["a referenced key's byte in the child list", (row) => ({ ...row, children: flipped(row.children, -1) })],
        // The embedded node's payload, "small", starts after the list's length, the child's kind, its payload's length.
        ["an embedded node's payload byte in the child list", (row) => ({ ...row, children: flipped(row.children, 3) })],
        ["a byte added after the child list", (row) => ({ ...row, children: Uint8Array.from([...row.children, 0]) })],
      ];
      // The counts and the queue stay those of the rows as they were: only the one byte changes.
      const { counts, queue } = countsAndQueue(EMBEDDED_ROWS, new Set([PARENT]));
      for (const [what, change] of cases) {
        const db = await database({ rows: changedRow(EMBEDDED_ROWS, PARENT, change), counts, queue });
        expect(await outcome(db), what).toEqual(inconsistent("node-key", PARENT));
      }
    },
    120_000,
  );

  it(
    "a nodes row whose child list has a length in more bytes than it needs, which the ledger refuses, its " +
      "key, payload, counts and queue unchanged, makes the computation fail with ledger-refcount-invalid " +
      "(details.check node-key), naming the row's key",
    async () => {
      const leaf = hex(keyOf(LEAF_ONE));
      const cases: readonly (readonly [string, string, (row: StoredRow) => StoredRow])[] = [
        // A leaf's empty list, `00`, as `01 00` and as `02 00 00 00`.
        ["a leaf's empty list in 2 bytes", leaf, (row) => ({ ...row, children: widened(row.children, 0, 2) })],
        ["a leaf's empty list in 4 bytes", leaf, (row) => ({ ...row, children: widened(row.children, 0, 4) })],
        ["the parent's number of children in 2 bytes", PARENT, (row) => ({ ...row, children: widened(row.children, 0, 2) })],
        // The embedded node's payload length, after the list's length and the child's kind.
        ["the embedded node's payload length in 2 bytes", PARENT, (row) => ({ ...row, children: widened(row.children, 2, 2) })],
        ["the embedded node's payload length in 4 bytes", PARENT, (row) => ({ ...row, children: widened(row.children, 2, 4) })],
      ];
      const { counts, queue } = countsAndQueue(EMBEDDED_ROWS, new Set([PARENT]));
      for (const [what, key, change] of cases) {
        const db = await database({ rows: changedRow(EMBEDDED_ROWS, key, change), counts, queue });
        expect(await outcome(db), what).toEqual(inconsistent("node-key", key));
        expect(((await outcome(db)) as Error).message, what).toMatch(/more than it needs/);
      }
    },
    120_000,
  );

  it(
    "ref_counts or unreferenced that differ from what the rows give make the computation fail with " +
      "ledger-refcount-invalid (reason tables-inconsistent), naming the check and the key",
    async () => {
      const roots = new Set([PARENT]);
      const { counts, queue } = countsAndQueue(EMBEDDED_ROWS, roots);
      const one = hex(keyOf(LEAF_ONE));
      const two = hex(keyOf(LEAF_TWO));
      const queuedKey = hex(keyOf(QUEUED));
      const cases: readonly (readonly [string, Tables, string, string])[] = [
        ["a count changed", { rows: EMBEDDED_ROWS, counts: counts.map(([k, c]) => [k, k === one ? c + 1 : c] as const) }, "counts", one],
        ["a count missing", { rows: EMBEDDED_ROWS, counts: counts.filter(([k]) => k !== two) }, "counts", two],
        ["a count for a key nothing references", { rows: EMBEDDED_ROWS, counts: [...counts, [PARENT, 1]] }, "counts", PARENT],
        ["a queued row missing from the queue", { rows: [...EMBEDDED_ROWS, rowOf(QUEUED)], queue }, "queue", queuedKey],
        ["a referenced row in the queue", { rows: EMBEDDED_ROWS, queue: [one] }, "queue", one],
        ["a queued key that is no row", { rows: EMBEDDED_ROWS, queue: [queuedKey] }, "queue", queuedKey],
        ["a reference to a key that is no row", { rows: EMBEDDED_ROWS.filter((row) => hex(row.key) !== two), counts }, "closure", two],
        ["a root count of a key that is no row", { rows: EMBEDDED_ROWS, roots: [...ROOTS, [queuedKey, 1]] }, "roots", queuedKey],
      ];
      for (const [what, tables, check, key] of cases) {
        const db = await database(tables);
        expect(await outcome(db), what).toEqual(inconsistent(check, key));
        expect(((await outcome(db)) as Error).message, what).toContain(`0x${key}`);
      }
    },
    180_000,
  );

  it(
    "changing one byte of one row of a table that is not content-defined changes the hash; changing one byte of a " +
      "core_ledger_state.nodes row makes the computation fail with ledger-refcount-invalid",
    async () => {
      const base = await database({ rows: EMBEDDED_ROWS });
      const other = await database({ rows: EMBEDDED_ROWS, otherState: true });
      expect(await hashOf(other)).not.toBe(await hashOf(base));
      const changed = await database({ rows: changedRow(EMBEDDED_ROWS, hex(keyOf(LEAF_TWO)), (row) => ({ ...row, data: flipped(row.data, 2) })) });
      expect(await outcome(changed)).toEqual(inconsistent("node-key", hex(keyOf(LEAF_TWO))));
    },
    120_000,
  );

  it("the exported contentsHash is the build's: its content-defined tables are those UmbraDB's own declarations name", async () => {
    const db = await database({ rows: EMBEDDED_ROWS });
    const build = [...PUBLIC_BACKBONE, ...CORE_MODULES];
    const own = await db.read(async (read) => hexOf(await contentsHash(read, { contentDefined: declaredContentDefined(build) })));
    expect(await hashOf(db, umbra.contentsHash)).toBe(own);
    // With the build's own declarations, the exported function takes the node tables by their content.
    const content = await db.read(async (read) => hexOf(await contentsHash(read, { contentDefined: declaredContentDefined(BUILD) })));
    expect(await hashOf(db)).toBe(content);
    expect(declaredContentDefined(BUILD)).toEqual([
      { schema: "core_ledger_state", tables: ["nodes", "ref_counts", "unreferenced"], content: LEDGER_NODE_TABLES.content },
    ]);
  }, 120_000);

  describe("negative controls", () => {
    it("nodes hashed by its raw rows (today's rule; ref_counts and unreferenced still checked) makes the two spellings' hashes differ", async () => {
      const raw = contentsHashOf([
        contentDefinedLedgerState({ contentDefined: { tables: ["ref_counts", "unreferenced"], content: LEDGER_NODE_TABLES.content } }),
      ]);
      const embedded = await database({ rows: EMBEDDED_ROWS });
      const referenced = await database({ rows: REFERENCED_ROWS });
      expect(await hashOf(referenced, raw)).not.toBe(await hashOf(embedded, raw));
    }, 120_000);

    it("a constant in place of the node set's contribution makes the one-more-node case's hashes equal", async () => {
      const constant = contentsHashOf([
        contentDefinedLedgerState({ contentDefined: { ...LEDGER_NODE_TABLES, content: nodeTablesContent({ fault: "constant-node-set" }) } }),
      ]);
      const base = await database({ rows: EMBEDDED_ROWS });
      const more = await database({ rows: [...EMBEDDED_ROWS, rowOf(QUEUED)] });
      expect(await hashOf(more, constant)).toBe(await hashOf(base, constant));
    }, 120_000);

    it("skipping the key check lets the changed-payload case through", async () => {
      const unchecked = contentsHashOf([
        contentDefinedLedgerState({ contentDefined: { ...LEDGER_NODE_TABLES, content: nodeTablesContent({ fault: "no-key-check" }) } }),
      ]);
      const base = await database({ rows: EMBEDDED_ROWS });
      const changed = await database({ rows: changedRow(EMBEDDED_ROWS, PARENT, (row) => ({ ...row, data: flipped(row.data, 0) })) });
      expect(await outcome(changed, unchecked)).toBe("hashed");
      expect(await hashOf(changed, unchecked)).toBe(await hashOf(base, unchecked));
    }, 120_000);
  });
});

describe("the node tables' rows give the same contents hash on PostgreSQL 18 and PGlite 0.5.10", () => {
  let postgres: TestServer;
  let pglite: TestServer;

  beforeAll(async () => {
    const started = await Promise.allSettled([
      startPostgres().then((server) => (postgres = server)),
      startPglite().then((server) => (pglite = server)),
    ]);
    for (const result of started) if (result.status === "rejected") throw result.reason;
  }, 180_000);

  afterAll(async () => {
    await Promise.all([postgres?.stop(), pglite?.stop()]);
  }, 60_000);

  /** The hash, or the refusal's code and details, of `tables` on each backend. */
  async function onBoth(tables: Tables): Promise<[unknown, unknown]> {
    const sql = databaseSql(tables);
    const results = await Promise.all(
      [postgres, pglite].map(async (server) => {
        const db = await server.create();
        await db.exec(sql);
        return db.read((read) => buildHash(read)).then(
          (hash) => hexOf(hash),
          (error: unknown) => ({ code: (error as { code?: unknown }).code, details: (error as { details?: unknown }).details }),
        );
      }),
    );
    return results as [unknown, unknown];
  }

  it("the same rows give the same hash on both backends, and the same refusal", async () => {
    const cases: readonly (readonly [string, Tables])[] = [
      ["embedded", { rows: EMBEDDED_ROWS }],
      ["referenced", { rows: REFERENCED_ROWS }],
      ["one more queued node", { rows: [...EMBEDDED_ROWS, rowOf(QUEUED)] }],
      ["another state", { rows: EMBEDDED_ROWS, otherState: true }],
      ["a payload byte changed", { rows: changedRow(EMBEDDED_ROWS, PARENT, (row) => ({ ...row, data: flipped(row.data, 0) })) }],
      ["no queue", { rows: [...EMBEDDED_ROWS, rowOf(QUEUED)], queue: [] }],
    ];
    const hashes = new Map<string, unknown>();
    for (const [what, tables] of cases) {
      const [onPostgres, onPglite] = await onBoth(tables);
      expect(onPglite, what).toEqual(onPostgres);
      hashes.set(what, onPostgres);
    }
    expect(hashes.get("referenced")).toBe(hashes.get("embedded"));
    expect(new Set([hashes.get("embedded"), hashes.get("one more queued node"), hashes.get("another state")]).size).toBe(3);
    expect(hashes.get("a payload byte changed")).toEqual({
      code: "ledger-refcount-invalid",
      details: { reason: "tables-inconsistent", check: "node-key", key: `0x${PARENT}` },
    });
  }, 180_000);
});
