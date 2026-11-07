import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { NODES_PER_STATEMENT, writeBlock } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_LEDGER_STATE_MIGRATIONS, insertNodes } from "../../src/backbone/core-ledger-state/sql.js";
import type { Database } from "../../src/db/api.js";
import type { StoredNode } from "../../src/ledger/types.js";
import type { AppliedState } from "../../src/ledger/worker/engine.js";
import { BACKENDS } from "../db/backends.js";

/**
 * `core-ledger-state`'s node write on PostgreSQL 18 and PGlite 0.5.10, through the database API's transactions on the
 * part's own tables (its migration): [LG-11; ledger-refcount design §2.2, §14]
 * - a node written again with its stored child list leaves its row untouched (the same row version) and is not
 *   counted;
 * - a node written with another child list replaces the stored one and is counted;
 * - a new node is inserted and counted;
 * - `writeBlock` returns the nodes it wrote, summed over its statements of {@link NODES_PER_STATEMENT} nodes.
 *
 * The node is its key's content, so a row's `data` never changes: only its child list (its form) can.
 */

const key = (byte: number, salt = 0): Uint8Array => {
  const bytes = new Uint8Array(32).fill(byte);
  bytes[0] = salt;
  return bytes;
};
const node = (byte: number, children: number, salt = 0): StoredNode => ({
  key: key(byte, salt),
  data: Uint8Array.of(byte, salt),
  children: Uint8Array.of(children),
});
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** Every row of `nodes`, by key in byte order: its child list and its row version (`xmin`), as hex and text. */
async function rowsOf(db: Database): Promise<Map<string, { readonly data: string; readonly children: string; readonly version: string }>> {
  const rows = await db.read((read) =>
    read.query(
      "SELECT node_key, data, children, xmin::text AS version FROM core_ledger_state.nodes ORDER BY node_key",
    ),
  );
  return new Map(
    rows.map((row) => [
      hex(row.node_key as Uint8Array),
      { data: hex(row.data as Uint8Array), children: hex(row.children as Uint8Array), version: row.version as string },
    ]),
  );
}

/** A block `height` whose batch inserts `inserts`, with no root count, result or event: its state row only besides. */
function applied(height: bigint, inserts: readonly StoredNode[]): AppliedState {
  return {
    height,
    hash: key(0xb0, Number(height)),
    ledger: "v9",
    stateKey: key(0xc0, Number(height)),
    stateRoot: Uint8Array.of(0xc1),
    summary: {
      zswapFirstFree: 0n,
      zswapRoot: Uint8Array.of(1),
      dustCommitmentFirstFree: 0n,
      dustCommitmentRoot: Uint8Array.of(2),
      dustGenerationFirstFree: 0n,
      dustGenerationRoot: Uint8Array.of(3),
    },
    output: { results: [], events: [], logs: [], parameters: Uint8Array.of(0) },
    batch: { inserts: [...inserts], rootCounts: [] },
    contracts: [],
  };
}

describe.each(BACKENDS)("the node write replaces a changed child list, on $name (LG-11)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const tables = (): Promise<Database> =>
    backend.database(`CREATE SCHEMA core_ledger_state;\n${CORE_LEDGER_STATE_MIGRATIONS.map((m) => m.sql).join("\n")}`).then((t) => t.db);

  it(
    "a node written again with its stored child list leaves its row untouched and is not counted; one written with " +
      "another child list replaces it and is counted; a new one is inserted and counted",
    async () => {
      const db = await tables();
      try {
        expect(await db.transaction((tx) => insertNodes(tx, [node(1, 0x0a), node(2, 0x14)]))).toBe(2);
        const before = await rowsOf(db);
        // k1 with its stored child list, k2 with another, k3 new: two rows written.
        const written = await db.transaction((tx) => insertNodes(tx, [node(1, 0x0a), node(2, 0x15), node(3, 0x1e)]));
        expect(written).toBe(2);
        const after = await rowsOf(db);
        expect([...after.keys()]).toEqual([key(1), key(2), key(3)].map(hex));
        const [k1, k2, k3] = [key(1), key(2), key(3)].map(hex) as [string, string, string];
        // Untouched: the same row version, so nothing was written to it (no change capture sees it). [DT-4]
        expect(after.get(k1)).toEqual(before.get(k1));
        expect(after.get(k2)).toMatchObject({ data: before.get(k2)?.data, children: "15" });
        expect(after.get(k2)?.version).not.toBe(before.get(k2)?.version);
        expect(after.get(k3)).toMatchObject({ data: hex(Uint8Array.of(3, 0)), children: "1e" });
        // Written again unchanged, every node of the statement: nothing counted, nothing touched.
        expect(await db.transaction((tx) => insertNodes(tx, [node(1, 0x0a), node(2, 0x15), node(3, 0x1e)]))).toBe(0);
        expect(await rowsOf(db)).toEqual(after);
      } finally {
        await db.close();
      }
    },
    120_000,
  );

  it(
    "writeBlock returns the nodes it wrote, new or with another child list, summed over its statements",
    async () => {
      const db = await tables();
      try {
        // More than one statement's nodes: NODES_PER_STATEMENT + 2, in two statements.
        const count = NODES_PER_STATEMENT + 2;
        const first = Array.from({ length: count }, (_, i) => node(i % 256, 0x01, Math.floor(i / 256)));
        expect(await db.transaction((tx) => writeBlock(tx, applied(1n, first)))).toBe(count);
        // Again: one node in each statement with another child list, two new ones, the rest unchanged.
        const changed = new Set([0, NODES_PER_STATEMENT + 1]);
        const second = [
          ...first.map((stored, i) => (changed.has(i) ? { ...stored, children: Uint8Array.of(0x02) } : stored)),
          node(0xfe, 0x01, 0xfe),
          node(0xff, 0x01, 0xfe),
        ];
        expect(await db.transaction((tx) => writeBlock(tx, applied(2n, second)))).toBe(changed.size + 2);
        // A block with no node writes none.
        expect(await db.transaction((tx) => writeBlock(tx, applied(3n, [])))).toBe(0);
        const rows = await rowsOf(db);
        expect(rows.size).toBe(count + 2);
        for (const at of changed) expect(rows.get(hex(first[at]?.key as Uint8Array))?.children).toBe("02");
      } finally {
        await db.close();
      }
    },
    120_000,
  );
});
