import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  CORE_BLOCK_COMMIT,
  CURSOR_TABLE,
  cursorHeight,
  readCursor,
} from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { BlockContext } from "../../src/modules/declaration.js";
import { startDatabase } from "../../src/db/migrate.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { BACKENDS } from "../db/backends.js";

/**
 * The cursor table (task 5.2; CD-3's cursor, RN-6, RN-14, `design.md` §3 and §10): `core-block-commit` creates
 * `core_block_commit.blocks` and writes the row of each block — its height, hash and parent hash — in the block's
 * transaction, through its block write handle; the last row is the cursor, which `readCursor` reads through the read or
 * transaction it is given (none before the table exists or holds a row), and `cursorHeight` is its height for the
 * database API's committed height (DB-2). Task 10.2 completes the part (the other columns of design §10, `hashes`,
 * `duplicate-block-hash`, its block items).
 */

const CONTEXT = { items: new Map(), revisions: [], publish: () => undefined };

/** The block context of `block` (no items or settings: the part reads neither). */
function contextOf(height: bigint): BlockContext {
  const block = inMemoryBlock(height);
  return { ...block, items: new Map(), settings: {}, active: () => true };
}

describe("the cursor table's declaration", () => {
  it("is a valid backbone part that provides the append-only table item blocks and writes at on-db-write only", () => {
    const set = validateDeclarations({ backbone: [CORE_BLOCK_COMMIT], core: [], user: [] });
    expect(set.backbone).toEqual([CORE_BLOCK_COMMIT]);
    expect(CORE_BLOCK_COMMIT.id).toBe("core-block-commit");
    expect(CORE_BLOCK_COMMIT.requires).toEqual([]);
    expect(CORE_BLOCK_COMMIT.startsMidChain).toBe(true);
    expect(CORE_BLOCK_COMMIT.provides).toEqual([
      {
        name: "blocks",
        lifetimes: ["table"],
        table: { schema: "core_block_commit", tables: ["blocks"], kind: "append-only" },
      },
    ]);
    expect(Object.keys(CORE_BLOCK_COMMIT.points)).toEqual(["on-db-write"]);
    expect(CURSOR_TABLE).toBe("core_block_commit.blocks");
  });
});

describe.each(BACKENDS)("the cursor table on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("reads no cursor before the table exists, nor while it is empty, then the last row", async () => {
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
    for (const height of [1n, 2n, 3n]) {
      await db.transaction(async (tx) => {
        const writes = openBlockWrites(tx, plan, { height: height === 1n ? null : height - 1n });
        await writes.write("core-block-commit", (w) =>
          (CORE_BLOCK_COMMIT.points["on-db-write"] as NonNullable<(typeof CORE_BLOCK_COMMIT.points)["on-db-write"]>).call(
            CORE_BLOCK_COMMIT.points,
            CONTEXT,
            contextOf(height),
            w,
          ),
        );
        // Inside the block, the block's own row is already the cursor.
        expect(await readCursor(tx)).toEqual(inMemoryBlock(height));
      });
    }
    expect(await db.read((read) => readCursor(read))).toEqual(inMemoryBlock(3n));
    expect(await db.read(async (read) => read.height)).toBe(3n);
    // Each row was written under the part's role, through its block write handle (DB-6).
    const owners = await db.read((read) =>
      read.query(
        "SELECT tableowner FROM pg_tables WHERE schemaname = 'core_block_commit' AND tablename = 'blocks'",
      ),
    );
    expect(owners).toEqual([{ tableowner: "umbradb_m_core_block_commit" }]);
  }, 60_000);

  it("reads the highest height, not the last row written", async () => {
    const { db } = await backend.database(
      "CREATE SCHEMA core_block_commit; " +
        "CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL); " +
        "INSERT INTO core_block_commit.blocks VALUES (9, '\\x09', '\\x08'), (2, '\\x02', '\\x01')",
      cursorHeight,
    );
    const cursor = await db.read((read) => readCursor(read));
    expect(cursor).toEqual({ height: 9n, hash: new Uint8Array([9]), parentHash: new Uint8Array([8]) });
    expect(Object.isFrozen(cursor)).toBe(true);
    expect(await db.read(async (read) => read.height)).toBe(9n);
  }, 60_000);

  it("its block's row fails the block when the height is already there", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const plan = schemaPlan([CORE_BLOCK_COMMIT]);
    await startDatabase(db, {
      plan,
      parts: [migrationPart(CORE_BLOCK_COMMIT, CONTEXT)],
      committedVersions: new Map(),
      handles: { height: null },
    });
    const write = CORE_BLOCK_COMMIT.points["on-db-write"] as NonNullable<(typeof CORE_BLOCK_COMMIT.points)["on-db-write"]>;
    const block = (height: bigint) =>
      db.transaction((tx) =>
        openBlockWrites(tx, plan, { height: null }).write("core-block-commit", (w) =>
          write.call(CORE_BLOCK_COMMIT.points, CONTEXT, contextOf(height), w),
        ),
      );
    await block(1n);
    await expect(block(1n)).rejects.toMatchObject({ code: "database-error", details: { sqlstate: "23505" } });
    expect(await db.read((read) => readCursor(read))).toEqual(inMemoryBlock(1n));
  }, 60_000);
});
