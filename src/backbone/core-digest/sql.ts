/**
 * The SQL of `core-digest` (`./core-digest.ts`): its tables, its migration, and the statements its `on-db-write` reads
 * and writes the digests with.
 *
 * **Its tables**, created by its migration as the writer's login (`core_digest` is a reserved schema, one of UmbraDB's
 * own parts'): [DB-8; design §10]
 * - `core_digest.tables (schema, table) → (height, digest)`: a table's row is set in the block that changes it, and
 *   kept as it is otherwise;
 * - `core_digest.checkpoints (height, schema, table) → digest`.
 *
 * The migration also creates `core_digest_shadow`, the schema of the shadow tables that change capture writes
 * (`src/db/change-capture.ts`). Every module role may read `core_digest` (the database API grants it, as it does
 * `core_chain`).
 */

import type { BlockWriteHandle } from "../../db/api.js";
import { SHADOW_SCHEMA } from "../../db/change-capture.js";

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

/** A table's digest, as a row of `core_digest.tables` holds it. */
export interface TableDigest {
  readonly schema: string;
  readonly table: string;
  readonly digest: Uint8Array;
}

/** A row of `core_digest.tables`, as {@link setDigest} writes it: a table's digest and the height that set it. */
export interface TableDigestRow extends TableDigest {
  readonly height: bigint;
}

/** Every row of `core_digest.tables`, in no order. */
export async function readDigests(w: Pick<BlockWriteHandle, "query">): Promise<TableDigest[]> {
  const rows = await w.query(DIGESTS_SQL);
  return rows.map((row) => ({
    schema: row.schema as string,
    table: row.table as string,
    digest: row.digest as Uint8Array,
  }));
}

/** Sets a table's row of `core_digest.tables`, inserting it or replacing the one there. */
export async function setDigest(w: Pick<BlockWriteHandle, "execute">, row: TableDigestRow): Promise<void> {
  await w.execute(SET_DIGEST_SQL, [row.schema, row.table, row.height, row.digest]);
}

/** Copies every row of `core_digest.tables` into `core_digest.checkpoints` at `height`. */
export async function checkpointDigests(w: Pick<BlockWriteHandle, "execute">, height: bigint): Promise<void> {
  await w.execute(CHECKPOINT_SQL, [height]);
}
