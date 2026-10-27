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
 * scheduled revision, which records id, start, stop and version only (CF-3), and otherwise both present (a `CHECK`);
 * `provides` the names of the `table` items the revision provides ({@link tableItemsOf}: a module's from the build's
 * declaration of it, `core`'s from the build's backbone parts), which a private process's graph counts as provided at
 * the revision's heights (PP-13, owner decision Q126 B, task 14.1a; `design.md` §8). Every module role reads it (the
 * database API's default privileges on `core_chain`, DB-6); none writes it.
 *
 * **Order at startup** (CF-6, CF-8): the runner reads the rows ({@link readHistory}, none before the table exists) and
 * checks the configuration with them before any migration runs; then `startDatabase` runs `core-chain` first — this
 * migration on a new database, then its `on-start-db`, which compares again with the rows its own transaction reads and,
 * in that same transaction, deletes the omitted rows above the cursor (CF-5, Q103 B) and records the check's writes
 * ({@link recordHistory}), each with its `provides`, then gives every other revision above the cursor this build's
 * `provides` where its row's differ (a scheduled revision recorded by an earlier build, say); a revision at or below the
 * cursor keeps its row as recorded, `provides` too (CF-6).
 */

import {
  canonicalJson,
  checkHistory,
  type ConfigHashRow,
  configHashOf,
  type HistoryCheck,
  type HistoryInput,
  type HistoryOptions,
  type HistoryRow,
} from "../../config/history.js";
import { CORE_ENTRY_ID } from "../../config/entries.js";
import type { PlainObject } from "../../config/plain-data.js";
import type { ReadHandle, Transaction } from "../../db/api.js";
import { keyOrderTerm } from "../../deterministic-postgresql/index.js";
import type { ModuleDeclaration } from "../../modules/declaration.js";
import { utf8Order } from "../../modules/graph.js";
import type { DeclarationSet } from "../../modules/validation.js";

/**
 * `core-chain`'s migration `001` (DB-9), the history's table: applied once, recorded under `core-chain`; never changed
 * once a database applied it (its checksum is fixed by the databases that applied it) — task 14.1a added `provides` in
 * place, before any database existed. The part's other migrations follow it (`CORE_CHAIN_MIGRATIONS`,
 * `./core-chain.ts`).
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
  provides text[] NOT NULL,
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

/** The columns the configuration hash reads (RN-16, PP-14): every row's, its data by its hash only. */
const CONFIG_HASH_SQL = "SELECT entry_id, start, stop, version, data_hash, provides FROM core_chain.config";

const RECORD_SQL = `INSERT INTO core_chain.config (entry_id, start, stop, version, data, data_hash, provides)
  VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7::text[])
  ON CONFLICT (entry_id, start) DO UPDATE
  SET stop = EXCLUDED.stop, version = EXCLUDED.version, data = EXCLUDED.data, data_hash = EXCLUDED.data_hash,
    provides = EXCLUDED.provides`;

/** A revision above the cursor given this build's `provides`, only where its row's differ (so nothing else is written). */
const PROVIDES_SQL = `UPDATE core_chain.config SET provides = $3::text[]
  WHERE entry_id = $1 AND start = $2 AND provides IS DISTINCT FROM $3::text[]`;

/**
 * What `core_chain.config.provides` records for a revision of `id` in a build of `declarations` (PP-13, task 14.1a):
 * the names of the `table` items — items whose lifetimes include `table` — of the build's backbone parts for `core`,
 * which run with the core entry, or of the build's declaration of the module `id` otherwise (for a scheduled revision,
 * whose version the build does not carry, the declaration it has, as the graph judges that revision); each once, by
 * their UTF-8 bytes. Throws for a module the build does not have (the configuration refuses its entry first, CF-3).
 */
export function tableItemsOf(declarations: DeclarationSet<ModuleDeclaration>, id: string): string[] {
  const parts =
    id === CORE_ENTRY_ID
      ? declarations.backbone
      : [...declarations.core, ...declarations.user].filter((declaration) => declaration.id === id);
  if (parts.length === 0 && id !== CORE_ENTRY_ID) {
    throw new Error(`tableItemsOf: the build has no module ${id}; the configuration refuses an entry for it (CF-3)`);
  }
  const names = parts.flatMap((part) =>
    part.provides.filter((item) => item.lifetimes.includes("table")).map((item) => item.name),
  );
  return [...new Set(names)].sort(utf8Order);
}

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
 * The rows of `core_chain.config` as the configuration hash reads them (RN-16, PP-14; task 14.1b, `design.md` §8), in
 * no order (`configHashOf` orders them); null while the table does not exist. Takes any handle that reads.
 */
export async function readConfigRows(read: Pick<ReadHandle, "query">): Promise<ConfigHashRow[] | null> {
  const [{ present }] = (await read.query(PRESENT_SQL)) as [{ present: boolean }];
  if (!present) return null;
  const rows = await read.query(CONFIG_HASH_SQL);
  return rows.map((row) =>
    Object.freeze({
      id: row.entry_id as string,
      start: row.start as bigint,
      stop: row.stop as bigint | null,
      version: row.version as string,
      dataHash: row.data_hash === null ? null : new Uint8Array(row.data_hash as Uint8Array),
      provides: Object.freeze([...(row.provides as string[])]),
    }),
  );
}

/**
 * The configuration hash of the database `read` reads (RN-16, PP-14; owner decision Q147, task 14.1b): `configHashOf`
 * its `core_chain.config` rows — none before the table exists. A process reads its own once, at startup, after
 * `core-chain`'s `on-start-db` recorded its configuration, and keeps it in memory for the run (`src/runner/process.ts`).
 */
export async function readConfigHash(read: Pick<ReadHandle, "query">): Promise<string> {
  return configHashOf((await readConfigRows(read)) ?? []);
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
  const written = new Set<string>();
  for (const row of check.writes) {
    const data = row.data === null ? null : canonicalJson(row.data);
    const provides = tableItemsOf(input.declarations, row.id);
    await tx.execute(RECORD_SQL, [row.id, row.start, row.stop, row.version, data, row.dataHash, provides]);
    written.add(`${row.id}\u0000${row.start}`);
  }
  // The other revisions above the cursor take this build's items too; those at or below it keep theirs (CF-6).
  for (const entry of check.entries) {
    const start = BigInt(entry.start);
    if (entry.started || written.has(`${entry.id}\u0000${start}`)) continue;
    await tx.execute(PROVIDES_SQL, [entry.id, start, tableItemsOf(input.declarations, entry.id)]);
  }
  return check;
}
