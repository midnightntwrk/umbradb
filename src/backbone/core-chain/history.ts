/**
 * `core-chain`'s configuration history in `core_chain.config` (`openspec/changes/core-arch/specs/configuration/spec.md`
 * CF-5 to CF-8; `design.md` §7, §10; CORE-ARCH §4.12): the table, created by `core-chain`'s migration as the writer's
 * login (`core_chain` is a reserved schema, one of UmbraDB's own parts', DB-8, task 2.4's note (i)); reading its rows;
 * and recording a startup's configuration in it. What is compared and recorded is `src/config/history.ts`'s
 * (`checkHistory`); the backbone part `core-chain` itself (`./core-chain.ts`, task 10.2) lists {@link CONFIG_MIGRATION}
 * first among its migrations and calls {@link recordHistory} in its `on-start-db`.
 *
 * **The table** (`design.md` §10): `(entry_id, start)` the key; `stop` null when absent and always for `core` (a
 * `CHECK`: its stop is operational, CF-4); `version` text, a module's semver or the core version's canonical JSON;
 * `data` the data fields as `jsonb` (written as their canonical JSON) and `data_hash` their SHA-256, both null for a
 * scheduled revision, which records id, start, stop and version only (CF-3), and otherwise both present (a `CHECK`).
 * Every module role reads it (the database API's default privileges on `core_chain`, DB-6); none writes it.
 *
 * **Order at startup** (CF-6, CF-8): the runner reads the rows ({@link readHistory}, none before the table exists) and
 * checks the configuration with them before any migration runs; then `startDatabase` runs `core-chain` first — this
 * migration on a new database, then its `on-start-db`, which compares again with the rows its own transaction reads and,
 * in that same transaction, deletes the omitted rows above the cursor (CF-5, Q103 B) and records the check's writes
 * ({@link recordHistory}).
 */

import {
  canonicalJson,
  checkHistory,
  type HistoryCheck,
  type HistoryInput,
  type HistoryOptions,
  type HistoryRow,
} from "../../config/history.js";
import type { PlainObject } from "../../config/plain-data.js";
import type { ReadHandle, Transaction } from "../../db/api.js";
import { keyOrderTerm } from "../../deterministic-postgresql/index.js";

/**
 * `core-chain`'s migration `001` (DB-9), the history's table: applied once, recorded under `core-chain`; never changed
 * (its checksum is fixed by the databases that applied it). The part's other migrations follow it
 * (`CORE_CHAIN_MIGRATIONS`, `./core-chain.ts`).
 */
export const CONFIG_MIGRATION: { readonly id: string; readonly sql: string } = Object.freeze({
  id: "001",
  sql: `CREATE TABLE core_chain.config (
  entry_id text NOT NULL,
  start bigint NOT NULL CHECK (start >= 0),
  stop bigint CHECK (stop >= start),
  version text NOT NULL,
  data jsonb,
  data_hash bytea,
  PRIMARY KEY (entry_id, start),
  CHECK ((data IS NULL AND data_hash IS NULL) OR (data IS NOT NULL AND octet_length(data_hash) = 32)),
  CHECK (entry_id <> 'core' OR stop IS NULL)
);`,
});

const PRESENT_SQL = "SELECT to_regclass('core_chain.config') IS NOT NULL AS present";

/** In the key's DT-2 order (the component's `keyOrderTerm`: ids by their bytes): refusals list rows alike anywhere. */
const ROWS_SQL = `SELECT entry_id, start, stop, version, data, data_hash FROM core_chain.config
  ORDER BY ${keyOrderTerm("entry_id", "text")}, ${keyOrderTerm("start", "bigint")}`;

const DELETE_SQL = "DELETE FROM core_chain.config WHERE entry_id = $1 AND start = $2";

const RECORD_SQL = `INSERT INTO core_chain.config (entry_id, start, stop, version, data, data_hash)
  VALUES ($1, $2, $3, $4, $5::jsonb, $6)
  ON CONFLICT (entry_id, start) DO UPDATE
  SET stop = EXCLUDED.stop, version = EXCLUDED.version, data = EXCLUDED.data, data_hash = EXCLUDED.data_hash`;

/**
 * The rows of `core_chain.config`, by id (in UTF-8 byte order) and start; none while the table does not exist (a new
 * database, before `core-chain`'s migration). Takes a read handle, a transaction or a write handle.
 */
export async function readHistory(read: Pick<ReadHandle, "query">): Promise<HistoryRow[]> {
  const [{ present }] = (await read.query(PRESENT_SQL)) as [{ present: boolean }];
  if (!present) return [];
  const rows = await read.query(ROWS_SQL);
  return rows.map((row) =>
    Object.freeze({
      id: row.entry_id as string,
      start: row.start as bigint,
      stop: row.stop as bigint | null,
      version: row.version as string,
      data: row.data as PlainObject | null,
      dataHash: row.data_hash === null ? null : new Uint8Array(row.data_hash as Uint8Array),
    }),
  );
}

/**
 * `core-chain`'s work in its `on-start-db` (CF-6): reads the rows in `tx` — its schema write handle, or any transaction
 * —, checks the configuration against them (`checkHistory`, refusing as it does, so the transaction rolls back with
 * nothing recorded), then in `tx` deletes the check's deletes — the omitted rows above the cursor (CF-5, Q103 B) — and
 * records its writes, each inserted or replacing the row of its `(id, start)`: a failure anywhere rolls back both.
 * Resolves with the check. `options` are `checkHistory`'s (the negative controls').
 */
export async function recordHistory(
  tx: Pick<Transaction, "query" | "execute">,
  input: Omit<HistoryInput, "history">,
  options: HistoryOptions = {},
): Promise<HistoryCheck> {
  const check = checkHistory({ ...input, history: await readHistory(tx) }, options);
  for (const row of check.deletes) await tx.execute(DELETE_SQL, [row.id, row.start]);
  for (const row of check.writes) {
    const data = row.data === null ? null : canonicalJson(row.data);
    await tx.execute(RECORD_SQL, [row.id, row.start, row.stop, row.version, data, row.dataHash]);
  }
  return check;
}
