/**
 * The cursor table of the backbone part `core-block-commit` (`openspec/changes/core-arch/specs/chain-data/spec.md`
 * CD-3, `specs/runner/spec.md` RN-6, RN-14; `design.md` §3, §10; CORE-ARCH §4.5, §4.11), task 5.2's part of it:
 * `core_block_commit.blocks`, one row per committed block — its height, hash and parent hash — written by the part's
 * `on-db-write`, which runs first among the parts writing in every block (RN-3's fixed order), inside the block's one
 * transaction (RN-6). The table's last row is the cursor: the block sources read it through the read they are given
 * ({@link readCursor}), and so does the database API's committed height ({@link cursorHeight}, DB-2), so a read's height
 * and its snapshot are one.
 *
 * The part reads only the block context — the block source's height, hash and parent hash (`design.md` §3) — so it
 * requires no item. Task 10.2 completes it from CD-3 and design §10: the columns `spec_version`, `ledger_version` and
 * `block_time` from the items `block-header` and `ledger-version`, which it then requires; the table
 * `core_block_commit.hashes` with `duplicate-block-hash`; partitioning by height. No database exists yet, so its
 * migration `001` may still change.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { CommittedHeight, ReadHandle } from "../../db/api.js";
import type { ModuleDeclaration } from "../../modules/declaration.js";
import type { BlockRef } from "../../runner/block-source.js";

/** The cursor table. */
export const CURSOR_TABLE = "core_block_commit.blocks";

const PRESENT_SQL = "SELECT to_regclass('core_block_commit.blocks') IS NOT NULL AS present";
const CURSOR_SQL = "SELECT height, hash, parent_hash FROM core_block_commit.blocks ORDER BY height DESC LIMIT 1";
const INSERT_SQL = "INSERT INTO core_block_commit.blocks (height, hash, parent_hash) VALUES ($1, $2, $3)";

/**
 * `core-block-commit` (see the module comment): a backbone part — it runs with the core, from S, a mid-chain start
 * whenever S is above 0 (Q96) — that provides the `table` item `blocks` in its own schema.
 */
export const CORE_BLOCK_COMMIT: ModuleDeclaration = {
  id: "core-block-commit",
  version: UMBRADB_VERSION,
  side: "public",
  requires: [],
  provides: [
    {
      name: "blocks",
      lifetimes: ["table"],
      table: { schema: "core_block_commit", tables: ["blocks"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [
    {
      id: "001",
      sql:
        "CREATE TABLE core_block_commit.blocks " +
        "(height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL)",
    },
  ],
  points: {
    async "on-db-write"(_p, b, w) {
      await w.execute(INSERT_SQL, [b.height, b.hash, b.parentHash]);
    },
  },
};

/**
 * The cursor, read through `read` (a read handle, or the block's transaction): the cursor table's row of the highest
 * height; null before the table exists (a database before its first startup) or while it holds no row.
 */
export async function readCursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
  const [table] = await read.query(PRESENT_SQL);
  if (table?.present !== true) return null;
  const [row] = await read.query(CURSOR_SQL);
  if (row === undefined) return null;
  return Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
}

/** The database API's committed height (DB-2): the cursor's height, read through the read's own handle. */
export const cursorHeight: CommittedHeight = async (read) => (await readCursor(read))?.height ?? null;
