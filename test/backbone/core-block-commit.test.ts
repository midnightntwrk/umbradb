import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  BLOCKS_TABLE,
  checkParent,
  commitBlock,
  CORE_BLOCK_COMMIT,
  CORE_BLOCK_COMMIT_MIGRATIONS,
  CURSOR_TABLE,
  cursorHeight,
  HASHES_TABLE,
  MAX_BLOCK_TIME_MS,
  readCursor,
  writeBlockRow,
  writeHashRow,
} from "../../src/backbone/core-block-commit/core-block-commit.js";
import {
  HEIGHT_PARTITION_SIZE,
  heightPartitionsSql,
  PRECREATED_HEIGHT_PARTITIONS,
} from "../../src/backbone/height-partitions.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import type { BlockWriteHandle, Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import type { SchemaPlan } from "../../src/db/roles.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import type { BlockContext } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { BACKENDS, type TestBackend } from "../db/backends.js";
import { STAND_IN_LEDGER, STAND_IN_SPEC_VERSION, standInHeader, standInItems } from "./block-fetch-stand-in.js";

/**
 * `core-block-commit` (task 10.2; CD-3, IN-4, Q74; `design.md` §3, §10; CORE-ARCH §4.11): the `blocks` table — height,
 * hash, parent hash, spec version, ledger version and block time, range-partitioned by height as 0.9.5's
 * `chain_archive` store was (1,000,000 heights per partition, five of them and a default) — whose last row is the
 * cursor; the unpartitioned `hashes` table, whose primary key makes a repeated hash fail the block with
 * `duplicate-block-hash`; and the parent check, after it, which fails a block whose parent is not the block stored at
 * h − 1 with `parent-mismatch`. The block time is the node's milliseconds, converted to `timestamptz` exactly — by
 * PostgreSQL's integer interval input, never through a floating-point value — and read back as RFC 3339 text (DB-2).
 *
 * The blocks here are written as the finalized loop writes them: `core-block-commit`'s `on-db-write` through its block
 * write handle (`openBlockWrites`), one block transaction per block, with the block items the stand-in `core-block-fetch`
 * puts (`./block-fetch-stand-in.ts`). The same checks through the real process are `chain-process.test.ts`'s (A90).
 */

const CONTEXT = { items: new Map(), revisions: [], publish: () => undefined };

/** The block context of `block`, with the stand-in's items unless `items` are given. */
function contextOf(block: BlockRef, items: ReadonlyMap<string, unknown> = standInItems(block.height)): BlockContext {
  return Object.freeze({ ...block, items, settings: Object.freeze({}), active: () => true });
}

/** A block at `height` whose hash and parent are the given ones (the default chain's otherwise). */
function blockAt(height: bigint, rest: { hash?: Uint8Array; parentHash?: Uint8Array } = {}): BlockRef {
  return { ...inMemoryBlock(height), ...rest };
}

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** `on-db-write` callbacks for the block: the part's, or a negative control's. */
type Commit = (w: BlockWriteHandle, b: BlockContext) => Promise<void>;

/** A database with `core-block-commit` started (its migration, as the runner runs it), and blocks written through it. */
interface Committed {
  readonly db: Database;
  readonly plan: SchemaPlan;
  /** One block transaction writing `b` through `commit` (the part's own `on-db-write` unless given). */
  block(b: BlockContext, commit?: Commit): Promise<void>;
  /** Rows of `sql` through a read. */
  rows(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
}

const partWrite: Commit = (w, b) => {
  const write = CORE_BLOCK_COMMIT.points["on-db-write"];
  if (write === undefined) throw new Error("core-block-commit registers no on-db-write");
  return write.call(CORE_BLOCK_COMMIT.points, CONTEXT, b, w);
};

async function committed(backend: TestBackend): Promise<Committed> {
  const { db } = await backend.database("SELECT 1", cursorHeight);
  const plan = schemaPlan([CORE_BLOCK_COMMIT]);
  await startDatabase(db, {
    plan,
    parts: [migrationPart(CORE_BLOCK_COMMIT, CONTEXT)],
    committedVersions: new Map(),
    handles: { height: null },
  });
  return {
    db,
    plan,
    async block(b, commit = partWrite) {
      const previous = await db.read((read) => readCursor(read));
      await db.transaction((tx) =>
        openBlockWrites(tx, plan, { height: previous?.height ?? null }).write("core-block-commit", (w) => commit(w, b)),
      );
    },
    rows: (sql, params) => db.read((read) => read.query(sql, params)),
  };
}

/** What a block failed with: its error (the test fails if it committed). */
async function failureOf(run: Promise<void>): Promise<unknown> {
  try {
    await run;
  } catch (error) {
    return error;
  }
  throw new Error("expected the block to fail");
}

/** The code of an error, or its message for one without a code. */
const codeOf = (error: unknown): string =>
  error instanceof UmbraError ? error.code : error instanceof Error ? `${error.name}: ${error.message}` : String(error);

describe("core-block-commit's declaration (CD-3, design §10)", () => {
  it("is a valid backbone part with defineModule's entry builder, starting mid-chain, at UmbraDB's version", () => {
    const set = validateDeclarations({ backbone: [CORE_BLOCK_COMMIT], core: [], user: [] });
    expect(set.backbone).toEqual([CORE_BLOCK_COMMIT]);
    expect(CORE_BLOCK_COMMIT.id).toBe("core-block-commit");
    expect(CORE_BLOCK_COMMIT.version).toBe(UMBRADB_VERSION);
    expect(CORE_BLOCK_COMMIT.side).toBe("public");
    // Every backbone part starts at S, a mid-chain start when S is above 0 (Q96).
    expect(CORE_BLOCK_COMMIT.startsMidChain).toBe(true);
    expect(typeof (CORE_BLOCK_COMMIT as { entry?: unknown }).entry).toBe("function");
    expect(Object.keys(CORE_BLOCK_COMMIT)).not.toContain("entry");
  });

  it("requires block-header and ledger-version, provides the append-only table item blocks, and writes at on-db-write only", () => {
    expect(CORE_BLOCK_COMMIT.requires).toEqual(["block-header", "ledger-version"]);
    expect(CORE_BLOCK_COMMIT.provides).toEqual([
      {
        name: "blocks",
        lifetimes: ["table"],
        table: { schema: "core_block_commit", tables: ["blocks", "hashes"], kind: "append-only" },
      },
    ]);
    expect(Object.keys(CORE_BLOCK_COMMIT.points)).toEqual(["on-db-write"]);
    expect(CORE_BLOCK_COMMIT.migrations).toEqual(CORE_BLOCK_COMMIT_MIGRATIONS.map(({ id, sql }) => ({ id, sql })));
  });

  it("names its tables the blocks table and the hashes table; the cursor is the blocks table's last row (task 6.1's note)", () => {
    expect(BLOCKS_TABLE).toBe("core_block_commit.blocks");
    expect(HASHES_TABLE).toBe("core_block_commit.hashes");
    // The old name, kept for the finalized loop's message until it says BLOCKS_TABLE (the cursor-table helper is
    // another thing, `cursorTable`).
    expect(CURSOR_TABLE).toBe(BLOCKS_TABLE);
  });

  it("has one migration, 001, whose text is fixed: its SHA-256 is in every database's record (DB-9)", () => {
    expect(CORE_BLOCK_COMMIT_MIGRATIONS.map(({ id }) => id)).toEqual(["001"]);
    const [migration] = CORE_BLOCK_COMMIT_MIGRATIONS;
    const sql = migration?.sql as string;
    expect(sql).toContain("PARTITION BY RANGE (height)");
    expect(sql).toContain(heightPartitionsSql("core_block_commit.blocks"));
    expect(sql).toContain("block_time timestamptz NOT NULL");
    expect(createHash("sha256").update(sql, "utf8").digest("hex")).toBe(MIGRATION_001_SHA256);
  });
});

/** The pinned SHA-256 of migration 001's text: changing the text changes every database's checksum (DB-9). */
const MIGRATION_001_SHA256 = "709223680f3fa5cdc25fd580b8c9eab24cf3cef6cd3891618b54a9e16a85d3da";

describe("the height partitions (0.9.5's chain_archive layout, kept)", () => {
  it("are 1,000,000 heights each, five of them from 0, and a default partition for every height above", () => {
    expect(HEIGHT_PARTITION_SIZE).toBe(1_000_000);
    expect(PRECREATED_HEIGHT_PARTITIONS).toBe(5);
    expect(heightPartitionsSql("s.t")).toBe(
      [
        "CREATE TABLE s.t_p0 PARTITION OF s.t FOR VALUES FROM (0) TO (1000000);",
        "CREATE TABLE s.t_p1 PARTITION OF s.t FOR VALUES FROM (1000000) TO (2000000);",
        "CREATE TABLE s.t_p2 PARTITION OF s.t FOR VALUES FROM (2000000) TO (3000000);",
        "CREATE TABLE s.t_p3 PARTITION OF s.t FOR VALUES FROM (3000000) TO (4000000);",
        "CREATE TABLE s.t_p4 PARTITION OF s.t FOR VALUES FROM (4000000) TO (5000000);",
        "CREATE TABLE s.t_default PARTITION OF s.t DEFAULT;",
      ].join("\n"),
    );
  });

  it("refuses a table name that is not schema.table in lowercase identifiers, before any SQL is made", () => {
    for (const name of ["t", "S.t", "s.t; DROP TABLE x", 's."t"', "s.t.u", "s.", ".t", "s.1t"]) {
      expect(() => heightPartitionsSql(name), name).toThrow(/schema\.table/);
    }
  });
});

describe("the block items core-block-commit reads (CD-2's block-header and ledger-version)", () => {
  // Refused before anything is sent: a handle that records every statement shows none.
  const recording = (): { readonly w: BlockWriteHandle; readonly sent: string[] } => {
    const sent: string[] = [];
    return {
      sent,
      w: {
        height: null,
        query: async (sql) => {
          sent.push(sql);
          return [];
        },
        execute: async (sql) => {
          sent.push(sql);
          return 1;
        },
      },
    };
  };
  // Each item given, or left out for undefined (no default parameter: an explicit undefined must stay absent).
  const items = (header: unknown, ledger: unknown): Map<string, unknown> =>
    new Map<string, unknown>([
      ...(header === undefined ? [] : ([["block-header", header]] as const)),
      ...(ledger === undefined ? [] : ([["ledger-version", ledger]] as const)),
    ]);
  const good = standInHeader(1n);

  for (const [what, header, ledger, says] of [
    ["no block-header item", undefined, STAND_IN_LEDGER, /block-header/],
    ["a block-header that is no object", 7, STAND_IN_LEDGER, /block-header/],
    ["a spec version that is no integer", { ...good, specVersion: 1.5 }, STAND_IN_LEDGER, /spec version/],
    ["a negative spec version", { ...good, specVersion: -1 }, STAND_IN_LEDGER, /spec version/],
    ["a spec version above 2^31 − 1 (an int column)", { ...good, specVersion: 2 ** 31 }, STAND_IN_LEDGER, /spec version/],
    ["a time in a number, not a bigint", { ...good, timestampMs: 1_750_000_000_000 }, STAND_IN_LEDGER, /time/],
    ["a time before 1970", { ...good, timestampMs: -1n }, STAND_IN_LEDGER, /time/],
    ["a time after 9999-12-31T23:59:59.999Z", { ...good, timestampMs: MAX_BLOCK_TIME_MS + 1n }, STAND_IN_LEDGER, /time/],
    ["no ledger-version item", good, undefined, /ledger-version/],
    ["an empty ledger version", good, "", /ledger-version/],
    ["a ledger version that is no text", good, 9, /ledger-version/],
  ] as const) {
    it(`fails the block for ${what}, sending nothing`, async () => {
      const { w, sent } = recording();
      const error = await failureOf(writeBlockRow(w, contextOf(inMemoryBlock(1n), items(header, ledger))));
      expect(error).toBeInstanceOf(TypeError);
      expect((error as Error).message).toMatch(says);
      expect((error as Error).message).toContain("height 1");
      expect(sent).toEqual([]);
    });
  }

  it("accepts the bounds: spec versions 0 and 2^31 − 1, times 0 and 9999-12-31T23:59:59.999Z", async () => {
    for (const header of [
      { specVersion: 0, timestampMs: 0n },
      { specVersion: 2 ** 31 - 1, timestampMs: MAX_BLOCK_TIME_MS },
    ]) {
      const { w, sent } = recording();
      await writeBlockRow(w, contextOf(inMemoryBlock(1n), items(header, STAND_IN_LEDGER)));
      expect(sent).toHaveLength(1);
    }
    expect(MAX_BLOCK_TIME_MS).toBe(253_402_300_799_999n);
  });
});

describe("the hashes table's error translation", () => {
  const failing = (error: unknown): BlockWriteHandle => ({
    height: null,
    query: async () => [],
    execute: async () => {
      throw error;
    },
  });
  const b = contextOf(inMemoryBlock(4n));

  it("passes every other failure of the hash's row on unchanged: another constraint, another code, a lost connection", async () => {
    for (const error of [
      new UmbraError("database-error", "check", { sqlstate: "23514", constraint: "hashes_hash_check" }),
      new UmbraError("database-error", "unique", { sqlstate: "23505", constraint: "blocks_pkey" }),
      // The hashes table's key named with another code: only its unique violation is a repeated hash.
      new UmbraError("database-error", "other code", { sqlstate: "23514", constraint: "hashes_pkey" }),
      new UmbraError("database-error", "no details"),
      new UmbraError("connection-lost", "gone"),
      new Error("not an UmbraError"),
      "a thrown string",
    ]) {
      expect(await failureOf(writeHashRow(failing(error), b))).toBe(error);
    }
  });

  it("turns only the hashes table's primary-key violation into duplicate-block-hash, its cause kept", async () => {
    const violation = new UmbraError("database-error", "duplicate", { sqlstate: "23505", constraint: "hashes_pkey" });
    const error = await failureOf(writeHashRow(failing(violation), b));
    expect(codeOf(error)).toBe("duplicate-block-hash");
    expect((error as UmbraError).cause).toBe(violation);
  });
});

describe.each(BACKENDS)("core_block_commit's tables on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("creates blocks partitioned by range on height, its partitions and bounds, and hashes unpartitioned", async () => {
    const { rows } = await committed(backend);
    expect(
      await rows(
        "SELECT p.partstrat AS strategy, a.attname AS key FROM pg_partitioned_table p " +
          "JOIN pg_attribute a ON a.attrelid = p.partrelid AND a.attnum = p.partattrs[0] " +
          "WHERE p.partrelid = 'core_block_commit.blocks'::regclass",
      ),
    ).toEqual([{ strategy: "r", key: "height" }]);
    const partitions = await rows(
      "SELECT c.relname AS name, pg_get_expr(c.relpartbound, c.oid) AS bound FROM pg_inherits i " +
        "JOIN pg_class c ON c.oid = i.inhrelid WHERE i.inhparent = 'core_block_commit.blocks'::regclass ORDER BY 1",
    );
    expect(partitions).toEqual([
      { name: "blocks_default", bound: "DEFAULT" },
      { name: "blocks_p0", bound: "FOR VALUES FROM ('0') TO ('1000000')" },
      { name: "blocks_p1", bound: "FOR VALUES FROM ('1000000') TO ('2000000')" },
      { name: "blocks_p2", bound: "FOR VALUES FROM ('2000000') TO ('3000000')" },
      { name: "blocks_p3", bound: "FOR VALUES FROM ('3000000') TO ('4000000')" },
      { name: "blocks_p4", bound: "FOR VALUES FROM ('4000000') TO ('5000000')" },
    ]);
    expect(
      await rows(
        "SELECT relkind AS kind, relispartition AS partition FROM pg_class WHERE oid = 'core_block_commit.hashes'::regclass",
      ),
    ).toEqual([{ kind: "r", partition: false }]);
  }, 60_000);

  it("gives both tables design §10's columns, keys and checks, owned by the part's role", async () => {
    const { rows } = await committed(backend);
    const columns = await rows(
      "SELECT table_name AS t, column_name AS c, data_type AS type, is_nullable AS nullable FROM information_schema.columns " +
        "WHERE table_schema = 'core_block_commit' AND table_name IN ('blocks', 'hashes') ORDER BY table_name, ordinal_position",
    );
    expect(columns).toEqual([
      { t: "blocks", c: "height", type: "bigint", nullable: "NO" },
      { t: "blocks", c: "hash", type: "bytea", nullable: "NO" },
      { t: "blocks", c: "parent_hash", type: "bytea", nullable: "NO" },
      { t: "blocks", c: "spec_version", type: "integer", nullable: "NO" },
      { t: "blocks", c: "ledger_version", type: "text", nullable: "NO" },
      { t: "blocks", c: "block_time", type: "timestamp with time zone", nullable: "NO" },
      { t: "hashes", c: "hash", type: "bytea", nullable: "NO" },
      { t: "hashes", c: "height", type: "bigint", nullable: "NO" },
    ]);
    const keys = await rows(
      "SELECT conrelid::regclass::text AS t, pg_get_constraintdef(oid) AS def FROM pg_constraint " +
        "WHERE conrelid IN ('core_block_commit.blocks'::regclass, 'core_block_commit.hashes'::regclass) " +
        "AND contype IN ('p', 'c') ORDER BY 1, 2",
    );
    expect(keys).toEqual([
      { t: "core_block_commit.blocks", def: "CHECK ((height >= 0))" },
      { t: "core_block_commit.blocks", def: "CHECK ((ledger_version <> ''::text))" },
      { t: "core_block_commit.blocks", def: "CHECK ((octet_length(hash) = 32))" },
      { t: "core_block_commit.blocks", def: "CHECK ((octet_length(parent_hash) = 32))" },
      { t: "core_block_commit.blocks", def: "CHECK ((spec_version >= 0))" },
      { t: "core_block_commit.blocks", def: "PRIMARY KEY (height)" },
      { t: "core_block_commit.hashes", def: "CHECK ((height >= 0))" },
      { t: "core_block_commit.hashes", def: "CHECK ((octet_length(hash) = 32))" },
      { t: "core_block_commit.hashes", def: "PRIMARY KEY (hash)" },
    ]);
    const owners = await rows(
      "SELECT tablename AS t, tableowner AS owner FROM pg_tables WHERE schemaname = 'core_block_commit' ORDER BY 1",
    );
    expect(owners.map((row) => row.owner)).toEqual(Array(owners.length).fill("umbradb_m_core_block_commit"));
    expect(owners.map((row) => row.t)).toEqual([
      "blocks",
      "blocks_default",
      "blocks_p0",
      "blocks_p1",
      "blocks_p2",
      "blocks_p3",
      "blocks_p4",
      "hashes",
    ]);
  }, 60_000);

  it("writes each block's row and its hash's row in the block's transaction, under the part's role (CD-3)", async () => {
    const { block, rows } = await committed(backend);
    for (const height of [1n, 2n, 3n]) await block(contextOf(inMemoryBlock(height)));
    const blocks = await rows(
      "SELECT height, hash, parent_hash, spec_version, ledger_version, block_time, xmin::text AS x FROM core_block_commit.blocks ORDER BY height",
    );
    const hashes = await rows("SELECT hash, height, xmin::text AS x FROM core_block_commit.hashes ORDER BY height");
    expect(blocks.map(({ x: _x, ...row }) => row)).toEqual(
      [1n, 2n, 3n].map((height) => ({
        height,
        hash: inMemoryBlock(height).hash,
        parent_hash: inMemoryBlock(height).parentHash,
        spec_version: STAND_IN_SPEC_VERSION,
        ledger_version: STAND_IN_LEDGER,
        block_time: new Date(Number(standInHeader(height).timestampMs)).toISOString().replace(".000Z", "Z"),
      })),
    );
    expect(hashes.map(({ x: _x, ...row }) => row)).toEqual(
      [1n, 2n, 3n].map((height) => ({ hash: inMemoryBlock(height).hash, height })),
    );
    // One transaction per block wrote both of its rows.
    expect(blocks.map((row) => row.x)).toEqual(hashes.map((row) => row.x));
    expect(new Set(blocks.map((row) => row.x)).size).toBe(3);
  }, 60_000);

  it("stores the node's block time in milliseconds exactly, also where a floating-point conversion rounds (A145, Q74)", async () => {
    const { block, rows } = await committed(backend);
    for (const [index, { ms }] of A145_TIMES.entries()) {
      const height = BigInt(index + 1);
      const header = { specVersion: STAND_IN_SPEC_VERSION, timestampMs: ms };
      await block(contextOf(inMemoryBlock(height), new Map<string, unknown>([["block-header", header], ["ledger-version", "v9"]])));
    }
    expect(await a145Stored(rows)).toEqual(A145_TIMES.map(({ ms, text }) => ({ text, microseconds: ms * 1000n })));
  }, 60_000);

  it("negative control: a block time converted through a float (to_timestamp) fails A145's exactness", async () => {
    const { block, rows } = await committed(backend);
    const throughFloat: Commit = async (w, b) => {
      const header = b.items.get("block-header") as { specVersion: number; timestampMs: bigint };
      await w.execute(
        "INSERT INTO core_block_commit.blocks (height, hash, parent_hash, spec_version, ledger_version, block_time) " +
          "VALUES ($1, $2, $3, $4, $5, to_timestamp($6::bigint / 1000.0))",
        [b.height, b.hash, b.parentHash, header.specVersion, "v9", header.timestampMs],
      );
    };
    for (const [index, { ms }] of A145_TIMES.entries()) {
      const header = { specVersion: STAND_IN_SPEC_VERSION, timestampMs: ms };
      await block(
        contextOf(inMemoryBlock(BigInt(index + 1)), new Map<string, unknown>([["block-header", header], ["ledger-version", "v9"]])),
        throughFloat,
      );
    }
    const stored = await a145Stored(rows);
    const wrong = stored.filter((row, index) => row.microseconds !== (A145_TIMES[index]?.ms as bigint) * 1000n);
    // The times of the current era survive the float; the far ones do not.
    expect(wrong.map((row) => row.text)).toEqual(["5138-11-16T09:46:39.998992Z", "9999-12-31T23:59:59.999008Z"]);
  }, 60_000);

  it("refuses a hash a block already has — in another height partition too — with duplicate-block-hash (CD-3)", async () => {
    const { block, rows } = await committed(backend);
    const p0 = HEIGHT_PARTITION_SIZE - 2;
    for (const height of [p0, p0 + 1, p0 + 2].map(BigInt)) await block(contextOf(inMemoryBlock(height)));
    // Height 1,000,001 (partition p1) repeats 999,999's hash (partition p0); its parent is 1,000,000's: it links.
    const repeated = blockAt(1_000_001n, { hash: inMemoryBlock(999_999n).hash });
    const error = await failureOf(block(contextOf(repeated)));
    expect(codeOf(error)).toBe("duplicate-block-hash");
    expect((error as UmbraError).details).toEqual({ height: 1_000_001n, hash: hex(repeated.hash) });
    expect((error as UmbraError).retryable).toBe(false);
    expect((error as UmbraError).message).toContain("height 1000001");
    expect((error as UmbraError).message).toContain(hex(repeated.hash));
    // Raised from the hashes table's primary key.
    expect((error as UmbraError).cause).toMatchObject({ code: "database-error", details: { sqlstate: "23505", constraint: "hashes_pkey" } });
    expect(await rows("SELECT max(height) AS h FROM core_block_commit.blocks")).toEqual([{ h: 1_000_000n }]);
    expect(await rows("SELECT count(*)::int AS n FROM core_block_commit.hashes")).toEqual([{ n: 3 }]);
    // The same block with a fresh hash commits, in p1.
    await block(contextOf(blockAt(1_000_001n)));
    expect(
      await rows(
        "SELECT height, tableoid::regclass::text AS partition FROM core_block_commit.blocks WHERE height IN (999999, 1000001) ORDER BY 1",
      ),
    ).toEqual([
      { height: 999_999n, partition: "core_block_commit.blocks_p0" },
      { height: 1_000_001n, partition: "core_block_commit.blocks_p1" },
    ]);
  }, 60_000);

  it("refuses a block whose parent is not the block stored at h − 1 with parent-mismatch (IN-4)", async () => {
    const { block, rows } = await committed(backend);
    for (const height of [5n, 6n]) await block(contextOf(inMemoryBlock(height)));
    const other = new Uint8Array(32).fill(9);
    const error = await failureOf(block(contextOf(blockAt(7n, { parentHash: other }))));
    expect(codeOf(error)).toBe("parent-mismatch");
    expect((error as UmbraError).details).toEqual({
      height: 7n,
      parentHash: hex(other),
      stored: hex(inMemoryBlock(6n).hash),
    });
    expect((error as UmbraError).message).toContain("height 7");
    expect(await rows("SELECT max(height) AS h FROM core_block_commit.blocks")).toEqual([{ h: 6n }]);
    expect(await rows("SELECT count(*)::int AS n FROM core_block_commit.hashes")).toEqual([{ n: 2 }]);
  }, 60_000);

  it("checks no parent for the anchor, the first block, whose parent the database does not hold", async () => {
    const { block, rows } = await committed(backend);
    await block(contextOf(blockAt(40n, { parentHash: new Uint8Array(32).fill(3) })));
    expect(await rows("SELECT height FROM core_block_commit.blocks")).toEqual([{ height: 40n }]);
  }, 60_000);

  it("names duplicate-block-hash before parent-mismatch for a block that is both: an earlier block delivered again", async () => {
    const { block } = await committed(backend);
    for (const height of [1n, 2n, 3n]) await block(contextOf(inMemoryBlock(height)));
    // Block 2 again at height 4: its hash repeats 2's and its parent is 1's, not 3's.
    const again = blockAt(4n, { hash: inMemoryBlock(2n).hash, parentHash: inMemoryBlock(1n).hash });
    expect(codeOf(await failureOf(block(contextOf(again))))).toBe("duplicate-block-hash");
  }, 60_000);

  it("negative controls: the parent check before the hash's row names parent-mismatch; no hash row lets the repeat commit", async () => {
    const { block, rows } = await committed(backend);
    for (const height of [1n, 2n, 3n]) await block(contextOf(inMemoryBlock(height)));
    const again = contextOf(blockAt(4n, { hash: inMemoryBlock(2n).hash, parentHash: inMemoryBlock(1n).hash }));
    const parentFirst: Commit = async (w, b) => {
      await writeBlockRow(w, b);
      await checkParent(w, b);
      await writeHashRow(w, b);
    };
    expect(codeOf(await failureOf(block(again, parentFirst)))).toBe("parent-mismatch");
    const noHashRow: Commit = async (w, b) => {
      await writeBlockRow(w, b);
      await checkParent(w, b);
    };
    const linking = contextOf(blockAt(4n, { hash: inMemoryBlock(2n).hash }));
    await block(linking, noHashRow);
    expect(await rows("SELECT count(*)::int AS n FROM core_block_commit.blocks WHERE hash = $1", [inMemoryBlock(2n).hash])).toEqual([
      { n: 2 },
    ]);
    // The part itself, in its order, is what refuses it.
    const { block: fresh } = await committed(backend);
    for (const height of [1n, 2n, 3n]) await fresh(contextOf(inMemoryBlock(height)));
    expect(codeOf(await failureOf(fresh(linking, commitBlock)))).toBe("duplicate-block-hash");
  }, 60_000);

  it("reads the cursor as the highest height across partitions, none before the table exists or while it is empty", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    expect(await db.read((read) => readCursor(read))).toBeNull();
    expect(await db.read(async (read) => read.height)).toBeNull();
    const plan = schemaPlan([CORE_BLOCK_COMMIT]);
    await startDatabase(db, {
      plan,
      parts: [migrationPart(CORE_BLOCK_COMMIT, CONTEXT)],
      committedVersions: new Map(),
      handles: { height: null },
    });
    expect(await db.read((read) => readCursor(read))).toBeNull();
    const write = (b: BlockRef) =>
      db.transaction((tx) => openBlockWrites(tx, plan, { height: null }).write("core-block-commit", (w) => partWrite(w, contextOf(b))));
    // The anchor in the default partition, then lower heights in p0 and p4: the highest is the cursor.
    for (const height of [5_000_007n, 3n, 4_999_999n]) await write(inMemoryBlock(height));
    const cursor = await db.read((read) => readCursor(read));
    expect(cursor).toEqual(inMemoryBlock(5_000_007n));
    expect(Object.isFrozen(cursor)).toBe(true);
    expect(await db.read(async (read) => read.height)).toBe(5_000_007n);
    // Inside a block, the block's own row is already the cursor.
    await db.transaction(async (tx) => {
      await openBlockWrites(tx, plan, { height: 5_000_007n }).write("core-block-commit", (w) =>
        partWrite(w, contextOf(inMemoryBlock(5_000_008n))),
      );
      expect(await readCursor(tx)).toEqual(inMemoryBlock(5_000_008n));
    });
    expect(
      await db.read((read) =>
        read.query("SELECT tableoid::regclass::text AS p FROM core_block_commit.blocks WHERE height = 5000007"),
      ),
    ).toEqual([{ p: "core_block_commit.blocks_default" }]);
  }, 60_000);

  it("fails a block whose height is already there", async () => {
    const { block } = await committed(backend);
    await block(contextOf(inMemoryBlock(1n)));
    expect(await failureOf(block(contextOf(inMemoryBlock(1n))))).toMatchObject({
      code: "database-error",
      details: { sqlstate: "23505" },
    });
  }, 60_000);
});

/** A145's block times: the milliseconds, and the RFC 3339 text the database API reads back (DB-2). */
const A145_TIMES: readonly { readonly ms: bigint; readonly text: string }[] = [
  { ms: 0n, text: "1970-01-01T00:00:00Z" },
  { ms: 1n, text: "1970-01-01T00:00:00.001Z" },
  { ms: 1_747_837_800_123n, text: "2025-05-21T14:30:00.123Z" },
  { ms: 99_999_999_999_999n, text: "5138-11-16T09:46:39.999Z" },
  { ms: MAX_BLOCK_TIME_MS, text: "9999-12-31T23:59:59.999Z" },
];

/** The stored block times, in height order: the text read back and the microseconds since 1970, both exact. */
async function a145Stored(
  rows: Committed["rows"],
): Promise<{ readonly text: unknown; readonly microseconds: unknown }[]> {
  const stored = await rows(
    "SELECT block_time AS text, (extract(epoch FROM block_time) * 1000000)::bigint AS microseconds " +
      "FROM core_block_commit.blocks ORDER BY height",
  );
  return stored.map((row) => ({ text: row.text, microseconds: row.microseconds }));
}
