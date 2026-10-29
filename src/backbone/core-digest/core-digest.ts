/**
 * The backbone part `core-digest`. It keeps one digest per module table, chained at every height that changes the
 * table, and a checkpoint of every table's digest at each height h with h mod 14,400 = 0. Two instances fed the same
 * chain can then compare table by table: which table differs, and in which 14,400-height window it began to.
 * [DT-4, DT-5, Q84, Q86; CORE-ARCH §4.11, §4.13; design §4 "Change capture for digests", §6]
 *
 * **Its tables**, created by its migration as the writer's login (`core_digest` is a reserved schema, one of UmbraDB's
 * own parts'): [DB-8; design §10]
 * - `core_digest.tables (schema, table) → (height, digest)`: a table's row is set in the block that changes it, and
 *   kept as it is otherwise;
 * - `core_digest.checkpoints (height, schema, table) → digest`.
 *
 * The migration also creates `core_digest_shadow`, the schema of the shadow tables that change capture writes
 * (`src/db/change-capture.ts`). Every module role may read `core_digest` (the database API grants it, as it does
 * `core_chain`). A module that requires `digest-tables` or `digest-checkpoints` reads them in its `on-db-write`, which
 * runs before `core-digest`'s, so it sees the digests of h − 1.
 *
 * **Its `on-db-write`** runs last in the block. The runner calls it through `writes.write("core-digest", …)`, which
 * runs it as the login. For each table whose changes are captured, in the fixed table order: [RN-3, DT-3]
 * - it takes the keys the block touched, with their rows before and after ({@link takeChanges}, which also empties the
 *   shadow table);
 * - it computes the table's changes and new digest (`src/determinism/digest.ts`);
 * - it sets the table's row of `core_digest.tables` when the table changed.
 *
 * Then, at a checkpoint height, it copies every row of `core_digest.tables` into `core_digest.checkpoints`. All of this
 * runs inside the block transaction, so the digests commit with the block.
 *
 * It has no `on-start-db`. What startup must do for the digests must follow every module's migrations, which come after
 * `core-digest`'s, so the database API does it (`src/db/migrate.ts`: change capture after each part, and the shadow
 * tables emptied when startup ends). [Q95]
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { capturedTables, SHADOW_SCHEMA, takeChanges } from "../../db/change-capture.js";
import { isCheckpointHeight, nextDigest, tableChanges } from "../../determinism/digest.js";
import { defineModule } from "../../modules/declaration.js";
import { CHECKPOINT_INTERVAL } from "./build-flags.js";

/**
 * `core-digest`'s migrations: applied once, in order, and recorded under `core-digest`. They never change, since each
 * checksum is fixed by the databases that applied it. [DB-9]
 */
export const CORE_DIGEST_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE SCHEMA core_digest;
CREATE SCHEMA ${SHADOW_SCHEMA};
CREATE TABLE core_digest.tables (
  "schema" text NOT NULL,
  "table" text NOT NULL,
  height bigint NOT NULL,
  digest bytea NOT NULL CHECK (octet_length(digest) = 32),
  PRIMARY KEY ("schema", "table")
);
CREATE TABLE core_digest.checkpoints (
  height bigint NOT NULL,
  "schema" text NOT NULL,
  "table" text NOT NULL,
  digest bytea NOT NULL CHECK (octet_length(digest) = 32),
  PRIMARY KEY (height, "schema", "table")
);`,
  },
]);

const DIGESTS_SQL = `SELECT "schema", "table", digest FROM core_digest.tables`;

const SET_DIGEST_SQL = `INSERT INTO core_digest.tables ("schema", "table", height, digest) VALUES ($1, $2, $3, $4)
  ON CONFLICT ("schema", "table") DO UPDATE SET height = EXCLUDED.height, digest = EXCLUDED.digest`;

const CHECKPOINT_SQL = `INSERT INTO core_digest.checkpoints (height, "schema", "table", digest)
  SELECT $1::bigint, "schema", "table", digest FROM core_digest.tables`;

/**
 * `core-digest`'s work for the block at `height` (see the module comment), on the block's write handle, after every
 * other part's `on-db-write`. [DT-4, DT-5]
 */
export async function digestBlock(w: BlockWriteHandle, height: bigint): Promise<void> {
  const tables = await capturedTables(w);
  const previous = new Map<string, Uint8Array>();
  for (const row of await w.query(DIGESTS_SQL)) {
    previous.set(JSON.stringify([row.schema, row.table]), row.digest as Uint8Array);
  }
  for (const table of tables) {
    const touched = await takeChanges(w, table);
    const changes = tableChanges(
      table.columns.map((column) => column.type),
      touched,
    );
    if (changes.count === 0) continue;
    const digest = nextDigest(previous.get(JSON.stringify([table.schema, table.name])) ?? null, height, changes.bytes);
    await w.execute(SET_DIGEST_SQL, [table.schema, table.name, height, digest]);
  }
  if (isCheckpointHeight(height, CHECKPOINT_INTERVAL)) await w.execute(CHECKPOINT_SQL, [height]);
}

/**
 * `core-digest`, the backbone part. It requires `blocks` (from `core-block-commit`) and provides `digest-tables` and
 * `digest-checkpoints`, its two tables. Its version is the build's (`UMBRADB_VERSION`), like every backbone part's and
 * core module's. [CORE-ARCH §4.11]
 */
export const CORE_DIGEST = defineModule({
  id: "core-digest",
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["blocks"],
  provides: [
    {
      name: "digest-tables",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["tables"], kind: "mutable" },
    },
    {
      name: "digest-checkpoints",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["checkpoints"], kind: "append-only" },
    },
  ],
  // Every backbone part starts at S, which is a mid-chain start when S is above genesis. [Q96]
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_DIGEST_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-db-write"(_p, b, w) {
      await digestBlock(w, b.height);
    },
  },
});
