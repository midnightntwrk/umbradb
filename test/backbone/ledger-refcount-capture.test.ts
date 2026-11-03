import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { CAPTURE_TRIGGER, SHADOW_SCHEMA, shadowTableName } from "../../src/db/change-capture.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { BACKUP_BACKENDS, type BackupDatabase } from "../backup/backup-fixtures.js";
import { LAST, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { buildContentsHash, bytesContentsHash, CONTENT_DEFINED_TABLES, dagOptedOut } from "./refcount-contents.js";
import { type DagRun, runDag } from "./refcount-process.js";
import type { TableSnapshot } from "./sweep-tapes.js";

/**
 * R17: `core-ledger-state`'s node tables are content-defined in the running process, on PostgreSQL 18.6 and PGlite
 * 0.5.10. The extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`) is run from genesis by the real process
 * with the build's `core-ledger-state` (`./refcount-process.ts`), a module beside the fixture's watcher recording the
 * rows of `core_digest.tables` at every cursor. [R17, DT-3, DT-4, DT-5, LG-11]
 * - TO_REF and TO_EMBEDDED are blocks that insert, rewrite and delete nodes (the tables before and after show each).
 *   Change capture records nothing for `nodes`, `ref_counts` and `unreferenced` — none carries the capture trigger or
 *   has a shadow table — and `core_digest.tables` holds no row for them, at those blocks or any other.
 * - `root_counts`' changes are recorded and digested as before: it carries the trigger and has its shadow table, and its
 *   row of `core_digest.tables` after every block is the digest DT-4 gives, recomputed here from its rows before and
 *   after the block (`SHA-256(previous ‖ CBOR(h) ‖ changes at h)`, the CBOR written out by this test); its row is set
 *   at TO_REF and at TO_EMBEDDED.
 * - The two backends give equal contents hashes after the fixture (the package's exported `contentsHash`).
 *
 * A `TRUNCATE` of each of the three in a callback is refused (`truncate-not-allowed`, DB-14) by
 * `./core-digest/digests.test.ts` ("keeps DT-6's rules and the TRUNCATE guard on content-defined tables"), on the
 * build's own `ledger-state` item.
 */

const DAG = "extended";

/** A row of `core_digest.tables`: the height of its table's last change and its digest (hex). */
interface DigestRow {
  readonly height: bigint;
  readonly digest: string;
}

/** The rows of `core_digest.tables`, by `schema.table`. */
type DigestRows = ReadonlyMap<string, DigestRow>;

const DIGESTS_SQL = `SELECT "schema" AS s, "table" AS t, height::text AS h, encode(digest, 'hex') AS d FROM core_digest.tables`;

type Reader = { query(sql: string): Promise<Record<string, unknown>[]> };

/** `core_digest.tables` read through `read`. */
async function digestRows(read: Reader): Promise<DigestRows> {
  const rows = await read.query(DIGESTS_SQL);
  return new Map(rows.map((r) => [`${r.s as string}.${r.t as string}`, { height: BigInt(r.h as string), digest: r.d as string }]));
}

/** A user module recording, at each height's `on-compute`, `core_digest.tables` as committed at the cursor h − 1. [R17] */
function digestWatcher(seen: Map<bigint, DigestRows>): ModuleDeclaration {
  return {
    id: "digest-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "digest-watch-rows", lifetimes: ["table"], table: { schema: "digest_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE digest_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height > 0n) seen.set(b.height - 1n, await digestRows(read));
      },
    },
  };
}

// ── DT-4's digest, written out (RFC 8949's canonical form: each head in its shortest length) ─────────────────────────

/** A value this test encodes: a non-negative integer, a byte string, a text string, or an array of them. */
type Cbor = bigint | number | Uint8Array | string | readonly Cbor[];

/** A CBOR head of major type `major` with argument `n`. */
function head(major: number, n: bigint): Uint8Array {
  if (n < 24n) return Uint8Array.of((major << 5) | Number(n));
  const length = n < 0x100n ? 1 : n < 0x10000n ? 2 : n < 0x100000000n ? 4 : 8;
  const argument = Array.from({ length }, (_, i) => Number((n >> BigInt(8 * (length - 1 - i))) & 0xffn));
  return Uint8Array.of((major << 5) | (24 + Math.log2(length)), ...argument);
}

/** `value`'s CBOR. */
function cbor(value: Cbor): Uint8Array {
  if (typeof value === "bigint" || typeof value === "number") return head(0, BigInt(value));
  if (typeof value === "string") return Buffer.concat([head(3, BigInt(Buffer.byteLength(value))), Buffer.from(value, "utf8")]);
  if (value instanceof Uint8Array) return Buffer.concat([head(2, BigInt(value.length)), value]);
  return Buffer.concat([head(4, BigInt(value.length)), ...value.map(cbor)]);
}

/**
 * `root_counts`' row of `core_digest.tables` after every height to `last` by DT-4 and DT-5, from its rows after each
 * height in `tables`: the changes at h are the keys whose row differs between h − 1 and h, in key order, each
 * `["insert", row]`, `["update", row]` or `["delete", old row]`, a row `[node_key, count]`; a height with changes sets
 * `SHA-256(previous ‖ CBOR(h) ‖ changes)` (`previous` 32 zero bytes before the first), one without keeps the row
 * before; no row before the table's first change. [DT-4, DT-5]
 */
function rootCountDigests(tables: ReadonlyMap<bigint, TableSnapshot>, last: number): Map<bigint, DigestRow | undefined> {
  const out = new Map<bigint, DigestRow | undefined>();
  let row: DigestRow | undefined;
  let before: ReadonlyMap<string, number> = new Map();
  for (let h = 0n; h <= BigInt(last); h++) {
    const after = (tables.get(h) as TableSnapshot).roots;
    const changes: Cbor[] = [];
    for (const key of [...new Set([...before.keys(), ...after.keys()])].sort()) {
      const [was, is] = [before.get(key), after.get(key)];
      const bytes = Uint8Array.from(Buffer.from(key, "hex"));
      if (was === undefined && is !== undefined) changes.push(["insert", [bytes, is]]);
      else if (was !== undefined && is === undefined) changes.push(["delete", [bytes, was]]);
      else if (was !== is) changes.push(["update", [bytes, is as number]]);
    }
    if (changes.length > 0) {
      const previous = row === undefined ? new Uint8Array(32) : Uint8Array.from(Buffer.from(row.digest, "hex"));
      row = { height: h, digest: createHash("sha256").update(previous).update(cbor(h)).update(cbor(changes)).digest("hex") };
    }
    out.set(h, row);
    before = after;
  }
  return out;
}

/** What change capture has set up for `core_ledger_state.<table>`: its capture trigger, its shadow table. */
async function captureOf(db: BackupDatabase, table: string): Promise<{ readonly trigger: boolean; readonly shadow: boolean }> {
  const [row] = await db.read((read) =>
    read.query(
      `SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = $1 AND tgrelid = $2::regclass) AS trigger,
              to_regclass($3) IS NOT NULL AS shadow`,
      [CAPTURE_TRIGGER, `core_ledger_state.${table}`, `${SHADOW_SCHEMA}.${shadowTableName("core_ledger_state", table)}`],
    ),
  );
  return { trigger: row?.trigger === true, shadow: row?.shadow === true };
}

/** The keys a block inserted, rewrote (stored with another child list) and deleted, from the tables before and after. */
function blockWrites(before: TableSnapshot, after: TableSnapshot): { inserted: string[]; rewritten: string[]; deleted: string[] } {
  const inserted = [...after.rows.keys()].filter((key) => !before.rows.has(key));
  const rewritten = [...after.rows].filter(([key, children]) => before.rows.has(key) && Buffer.compare(before.rows.get(key) as Uint8Array, children) !== 0).map(([key]) => key);
  const deleted = [...before.rows.keys()].filter((key) => !after.rows.has(key));
  return { inserted, rewritten, deleted };
}

describe("R17 (DT-3, DT-4, DT-5): nodes, ref_counts and unreferenced are content-defined in the running process, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(BACKUP_BACKENDS.map((backend) => backend.start())), 300_000);
  afterAll(() => Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop())), 120_000);

  it(
    "R17: a block that inserts, rewrites and deletes nodes records no change for them and core_digest.tables holds no " +
      "row for them, while root_counts' changes at that block are recorded and digested as before; the two backends " +
      "give equal contents hashes after the DAG fixture",
    async () => {
      const hashes: string[] = [];
      for (const backend of BACKUP_BACKENDS) {
        const db = await backend.database();
        const seen = new Map<bigint, DigestRows>();
        const watch = digestWatcher(seen);
        const run: DagRun = await runDag(db, { dag: DAG, user: [watch] });
        expect(run.status, backend.name).toMatchObject({ cursor: BigInt(LAST), reason: null });
        seen.set(BigInt(LAST), await db.read((read) => digestRows(read)));
        expect([...seen.keys()].sort((a, b) => (a < b ? -1 : 1)), backend.name).toEqual(Array.from({ length: LAST + 1 }, (_, h) => BigInt(h)));

        // The blocks: each inserts, rewrites and deletes nodes.
        for (const h of [TO_REF, TO_EMBEDDED]) {
          const writes = blockWrites(run.tables.get(BigInt(h - 1)) as TableSnapshot, run.tables.get(BigInt(h)) as TableSnapshot);
          for (const [what, keys] of Object.entries(writes)) expect(keys.length, `${backend.name}: ${what} at ${h}`).toBeGreaterThan(0);
        }

        // No change is recorded for the content-defined tables, and no digest kept, at any height.
        for (const table of CONTENT_DEFINED_TABLES) {
          expect(await captureOf(db, table), `${backend.name}: ${table}`).toEqual({ trigger: false, shadow: false });
          for (const [h, rows] of seen) expect(rows.has(`core_ledger_state.${table}`), `${backend.name}: ${table} at ${h}`).toBe(false);
        }

        // root_counts' changes are recorded and digested as before: DT-4's digest after every block.
        expect(await captureOf(db, "root_counts"), backend.name).toEqual({ trigger: true, shadow: true });
        const expected = rootCountDigests(run.tables, LAST);
        for (const [h, rows] of seen) expect(rows.get("core_ledger_state.root_counts"), `${backend.name}: root_counts at ${h}`).toEqual(expected.get(h));
        for (const h of [TO_REF, TO_EMBEDDED]) expect(seen.get(BigInt(h))?.get("core_ledger_state.root_counts")?.height, `${backend.name} at ${h}`).toBe(BigInt(h));

        // The contents hash as the build computes it: the node tables by their content, not their bytes.
        const optedOut = dagOptedOut([watch]);
        const hash = await buildContentsHash(db, optedOut);
        expect(await bytesContentsHash(db, optedOut), backend.name).not.toBe(hash);
        hashes.push(hash);
      }
      // Equal contents hashes on the two backends after the fixture.
      expect(hashes[0]).toBe(hashes[1]);
    },
    PATIENCE_MS * 4,
  );
});
