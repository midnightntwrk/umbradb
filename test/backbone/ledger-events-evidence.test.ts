import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_MIGRATIONS, EVENTS_TABLE, insertEvents } from "../../src/backbone/core-ledger-state/sql.js";
import type { Database } from "../../src/db/api.js";
import type { LedgerEvent } from "../../src/ledger/types.js";
import { BACKENDS } from "../db/backends.js";

/**
 * A zswap output's preimage evidence in `core_ledger_state.events` (migration `002`), on PostgreSQL 18 and PGlite
 * 0.5.10:
 * - `insertEvents` writes each event's `evidence` and `ciphertext`, read back as written;
 * - the table refuses a row whose evidence and kind, or ciphertext and evidence, disagree, an unknown evidence kind and
 *   a ciphertext of another length than 224 bytes;
 * - on a database with `001` only, `002` applies where no zswap output is stored and refuses one that holds a zswap
 *   output without its evidence (such a database is synced again).
 */

const migration = (id: string): { readonly sql: string } => {
  const found = CORE_LEDGER_STATE_MIGRATIONS.find((m) => m.id === id);
  if (found === undefined) throw new Error(`core-ledger-state has no migration ${id}`);
  return found;
};
const M001 = migration("001");
const M002 = migration("002");
const SCHEMA_001 = `CREATE SCHEMA core_ledger_state;\n${M001.sql}`;
const SCHEMA = `${SCHEMA_001}\n${M002.sql}`;

const CIPHERTEXT = Uint8Array.from({ length: 224 }, (_, i) => (i * 7) & 0xff);
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

const base = (transaction: number): Omit<LedgerEvent, "kind" | "evidence" | "ciphertext"> => ({
  transaction,
  logicalSegment: 0,
  physicalSegment: 0,
  bytes: Uint8Array.of(transaction),
  nullifier: null,
  commitment: null,
  treeIndex: null,
  contractAddress: null,
});

/** One event of each evidence and an event of another kind. */
const EVENTS: readonly LedgerEvent[] = [
  { ...base(0), kind: "zswap-output", commitment: new Uint8Array(32).fill(1), treeIndex: 0n, evidence: "ciphertext", ciphertext: CIPHERTEXT },
  { ...base(1), kind: "zswap-output", commitment: new Uint8Array(32).fill(2), treeIndex: 1n, evidence: "public", ciphertext: null },
  { ...base(2), kind: "zswap-output", commitment: new Uint8Array(32).fill(3), treeIndex: 2n, evidence: "none", ciphertext: null },
  { ...base(3), kind: "zswap-input", nullifier: new Uint8Array(32).fill(4), evidence: null, ciphertext: null },
];

/** A row of `core_ledger_state.events` at height 5 with the given kind, evidence and ciphertext (SQL literals). */
const row = (index: number, kind: string, evidence: string, ciphertext: string): string =>
  `INSERT INTO ${EVENTS_TABLE} (height, tx_index, event_index, kind, logical_segment, physical_segment, bytes, evidence, ciphertext)
   VALUES (5, ${index}, 0, '${kind}', 0, 0, '\\x00', ${evidence}, ${ciphertext})`;
const bytea = (length: number): string => `'\\x${"ab".repeat(length)}'`;

describe.each(BACKENDS)("a zswap output's evidence in core_ledger_state.events on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  async function withDatabase<T>(setup: string, body: (db: Database, exec: (sql: string) => Promise<void>) => Promise<T>): Promise<T> {
    const { db, exec } = await backend.database(setup);
    try {
      return await body(db, exec);
    } finally {
      await db.close();
    }
  }

  it("insertEvents writes each event's evidence and ciphertext, read back as written", async () => {
    await withDatabase(SCHEMA, async (db) => {
      await db.transaction((tx) => insertEvents(tx, 5n, EVENTS, EVENTS.map(() => 0n)));
      const rows = await db.read((read) =>
        read.query(`SELECT tx_index::int AS tx, kind, evidence, encode(ciphertext, 'hex') AS ciphertext FROM ${EVENTS_TABLE} ORDER BY tx_index`),
      );
      expect(rows).toEqual([
        { tx: 0, kind: "zswap-output", evidence: "ciphertext", ciphertext: hex(CIPHERTEXT) },
        { tx: 1, kind: "zswap-output", evidence: "public", ciphertext: null },
        { tx: 2, kind: "zswap-output", evidence: "none", ciphertext: null },
        { tx: 3, kind: "zswap-input", evidence: null, ciphertext: null },
      ]);
    });
  });

  it("refuses evidence that disagrees with the kind, a ciphertext that disagrees with the evidence, an unknown kind and another length", async () => {
    await withDatabase(SCHEMA, async (_db, exec) => {
      const refused: [string, string][] = [
        [row(0, "zswap-output", "NULL", "NULL"), "events_evidence_of_zswap_output"],
        [row(1, "zswap-input", "'none'", "NULL"), "events_evidence_of_zswap_output"],
        [row(2, "zswap-output", "'ciphertext'", "NULL"), "events_ciphertext_of_ciphertext"],
        [row(3, "zswap-output", "'public'", bytea(224)), "events_ciphertext_of_ciphertext"],
        [row(4, "zswap-input", "NULL", bytea(224)), "events_ciphertext_of_ciphertext"],
        [row(5, "zswap-output", "'other'", "NULL"), "events_evidence_kind"],
        [row(6, "zswap-output", "'ciphertext'", bytea(223)), "events_ciphertext_length"],
        [row(7, "zswap-output", "'ciphertext'", bytea(225)), "events_ciphertext_length"],
      ];
      for (const [sql, constraint] of refused) {
        await expect(exec(sql), sql).rejects.toThrow(new RegExp(constraint));
      }
      // The consistent rows are accepted.
      await exec(row(10, "zswap-output", "'ciphertext'", bytea(224)));
      await exec(row(11, "zswap-output", "'none'", "NULL"));
      await exec(row(12, "contract-deploy", "NULL", "NULL"));
    });
  });

  it("applies 002 to a database holding no zswap output, and refuses one holding an output without its evidence", async () => {
    const before002 = (kind: string): string =>
      `INSERT INTO ${EVENTS_TABLE} (height, tx_index, event_index, kind, logical_segment, physical_segment, bytes)
       VALUES (5, 0, 0, '${kind}', 0, 0, '\\x00')`;
    await withDatabase(SCHEMA_001, async (_db, exec) => {
      await exec(before002("zswap-input"));
      await exec(M002.sql);
      await exec(row(1, "zswap-output", "'none'", "NULL"));
    });
    await withDatabase(SCHEMA_001, async (_db, exec) => {
      await exec(before002("zswap-output"));
      await expect(exec(M002.sql)).rejects.toThrow(/events_evidence_of_zswap_output/);
    });
  });
});
