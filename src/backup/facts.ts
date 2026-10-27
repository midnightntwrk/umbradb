/**
 * What a backup's manifest records of its database (`openspec/changes/core-arch/specs/backups/spec.md` BK-2;
 * `design.md` §9.1), read through one read handle — the snapshot the dump is taken in (BK-1) —: the committed height
 * and its block's hash (the cursor: `core-block-commit`'s, or a private process's own, `core_private_source.cursor`),
 * the chain's identity (`core_chain.identity`), every `core_chain.config` and `core_chain.migrations` row, the ledger
 * state root stored for that height when `core_ledger_state.states` exists, the server's version, whether the database
 * is a private process's (PP-12: it holds `core_private_source.cursor`), and the contents hash (DT-3) with the tables
 * declared `deterministic: false` recorded by name only (Q76).
 */

import { readCursor } from "../backbone/core-block-commit/core-block-commit.js";
import { readIdentity } from "../backbone/core-chain/core-chain.js";
import { readPrivateCursor } from "../backbone/core-private-source/core-private-source.js";
import type { PlainObject } from "../config/plain-data.js";
import type { ReadHandle } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { contentsHash } from "../determinism/contents-hash.js";
import { keyOrderTerm, type TableName } from "../deterministic-postgresql/index.js";
import type { Manifest, ManifestHistoryRow, ManifestMigration } from "./manifest.js";

/** `0x`-prefixed lowercase hex of `bytes`. */
export function hex(bytes: Uint8Array): string {
  return `0x${Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex")}`;
}

const PRIVATE_SQL = "SELECT to_regclass('core_private_source.cursor') IS NOT NULL AS private";
const STATES_PRESENT_SQL = "SELECT to_regclass('core_ledger_state.states') IS NOT NULL AS present";
const STATE_ROOT_SQL = "SELECT state_root FROM core_ledger_state.states WHERE height = $1";
const VERSION_SQL = "SELECT current_setting('server_version') AS version";
const HISTORY_SQL = `SELECT entry_id, start, stop, version, data, data_hash, provides FROM core_chain.config
  ORDER BY ${keyOrderTerm("entry_id", "text")}, ${keyOrderTerm("start", "bigint")}`;
const MIGRATIONS_SQL = `SELECT module, migration_id, encode(checksum, 'hex') AS checksum, position
  FROM core_chain.migrations ORDER BY ${keyOrderTerm("module", "text")}, position`;
const PRESENT_SQL = "SELECT to_regclass($1) IS NOT NULL AS present";

/** Whether the relation `name` (`schema.table`) exists, as `read` sees it. */
async function present(read: Pick<ReadHandle, "query">, name: string): Promise<boolean> {
  const [row] = await read.query(PRESENT_SQL, [name]);
  return row?.present === true;
}

/** What {@link readBackupFacts} reads: the manifest's fields of the database, and whether it is private. */
export interface BackupFacts {
  /** True for a private process's database (PP-12). */
  readonly private: boolean;
  readonly manifest: Omit<Manifest, "format" | "umbradb" | "tool">;
}

/** Whether the database `read` sees is a private process's (PP-12: it holds `core_private_source.cursor`). */
export async function isPrivateDatabase(read: Pick<ReadHandle, "query">): Promise<boolean> {
  const [row] = await read.query(PRIVATE_SQL);
  return row?.private === true;
}

/**
 * Reads the manifest's fields of the database `read` sees (see the module comment). Rejects with
 * `no-committed-height` when nothing is committed yet: a backup holds one committed height.
 */
export async function readBackupFacts(
  read: Pick<ReadHandle, "query">,
  options: { readonly optedOut: readonly TableName[] },
): Promise<BackupFacts> {
  const isPrivate = await isPrivateDatabase(read);
  const cursor = isPrivate ? await readPrivateCursor(read) : await readCursor(read);
  const identity = await readIdentity(read);
  if (cursor === null || identity === null) {
    throw new UmbraError(
      "no-committed-height",
      "the database has no committed height yet, and a backup holds one: back it up once its first block (S) has " +
        "committed (BK-1)",
    );
  }
  const history: ManifestHistoryRow[] = !(await present(read, "core_chain.config"))
    ? []
    : (await read.query(HISTORY_SQL)).map((row) =>
        Object.freeze({
          id: row.entry_id as string,
          start: String(row.start),
          stop: row.stop === null ? null : String(row.stop),
          version: row.version as string,
          data: row.data as PlainObject | null,
          dataHash: row.data_hash === null ? null : hex(row.data_hash as Uint8Array),
          provides: Object.freeze([...((row.provides as string[] | null) ?? [])]),
        }),
      );
  const migrations: ManifestMigration[] = !(await present(read, "core_chain.migrations"))
    ? []
    : (await read.query(MIGRATIONS_SQL)).map((row) =>
        Object.freeze({
          module: row.module as string,
          migration: row.migration_id as string,
          checksum: row.checksum as string,
          position: Number(row.position),
        }),
      );
  let stateRoot: string | null = null;
  const [states] = await read.query(STATES_PRESENT_SQL);
  if (states?.present === true) {
    const [row] = await read.query(STATE_ROOT_SQL, [cursor.height]);
    stateRoot = row === undefined ? null : hex(row.state_root as Uint8Array);
  }
  const [server] = await read.query(VERSION_SQL);
  const hash = await contentsHash(read, { optedOut: options.optedOut });
  return Object.freeze({
    private: isPrivate,
    manifest: Object.freeze({
      genesisHash: hex(identity.genesisHash),
      start: String(identity.start),
      height: String(cursor.height),
      blockHash: hex(cursor.hash),
      stateRoot,
      history: Object.freeze(history),
      migrations: Object.freeze(migrations),
      contentsHash: hex(hash),
      postgres: String(server?.version),
    }),
  });
}
