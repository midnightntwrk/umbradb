/**
 * The backbone part `core-digest` (`openspec/changes/core-arch/specs/determinism/spec.md` DT-4, DT-5; `design.md` §4
 * "Change capture for digests", §6, §10; CORE-ARCH §4.11 and §4.13; owner decisions Q84, Q86, Q95): one digest per
 * module table, chained at every height that changes the table, and a checkpoint of every table's digest at each height
 * h with h mod 14,400 = 0, so that two instances fed the same chain can compare, table by table, which table differs
 * and in which 14,400-height window it began to.
 *
 * **Its tables** (`design.md` §10), created by its migration as the writer's login (`core_digest` is a reserved schema,
 * one of UmbraDB's own parts', DB-8): `core_digest.tables (schema, table) → (height, digest)`, a table's row set in the
 * block that changes it, kept as it is otherwise; and `core_digest.checkpoints (height, schema, table) → digest`. The
 * migration also creates `core_digest_shadow`, the schema of the shadow tables change capture writes
 * (`src/db/change-capture.ts`). Every module role may read `core_digest` (the database API grants it, as it does
 * `core_chain`): a module that requires `digest-tables` or `digest-checkpoints` reads them in its `on-db-write`, which
 * runs before `core-digest`'s, so it sees h − 1's digests.
 *
 * **Its `on-db-write`**, last of the block (RN-3; the runner calls it through `writes.write("core-digest", …)`, which runs
 * it as the login): for each table whose changes are captured, in DT-3's order, the keys the block touched with their
 * rows before and after ({@link takeChanges}, which also empties the shadow table), its changes and new digest
 * (`src/determinism/digest.ts`), its row of `core_digest.tables` set when it changed; then, at a checkpoint height, a
 * copy of every row of `core_digest.tables` into `core_digest.checkpoints`. Inside the block transaction, so the digests
 * commit with the block. It has no `on-start-db`: what startup must do for the digests must follow every module's
 * migrations, which come after `core-digest`'s (Q95), so the database API does it (`src/db/migrate.ts`: change capture
 * after each part, the shadow tables emptied when startup ends).
 */

import { z } from "zod";
import type { BlockWriteHandle } from "../../db/api.js";
import { capturedTables, SHADOW_SCHEMA, takeChanges } from "../../db/change-capture.js";
import { isCheckpointHeight, nextDigest, tableChanges } from "../../determinism/digest.js";
import { defineModule } from "../../modules/declaration.js";
import { CHECKPOINT_INTERVAL } from "./build-flags.js";

/**
 * `core-digest`'s migrations (DB-9): applied once, in order, recorded under `core-digest`; never changed (each checksum
 * is fixed by the databases that applied it).
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
 * `core-digest`'s work for the block at `height` (DT-4, DT-5; see the module comment), on the block's write handle,
 * after every other part's `on-db-write`.
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
 * `core-digest`, the backbone part (CORE-ARCH §4.11): it requires `blocks` (`core-block-commit`'s) and provides
 * `digest-tables` and `digest-checkpoints`, its two tables. Its version is UmbraDB's (task 17.4 sets the release's).
 */
export const CORE_DIGEST = defineModule({
  id: "core-digest",
  version: "0.10.0",
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
  // Every backbone part starts at S, which is a mid-chain start when S is above genesis (task 3.2's note (e), Q96).
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_DIGEST_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-db-write"(_p, b, w) {
      await digestBlock(w, b.height);
    },
  },
});
