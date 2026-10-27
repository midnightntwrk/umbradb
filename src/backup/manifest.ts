/**
 * A backup's manifest (`openspec/changes/core-arch/specs/backups/spec.md` BK-2; `design.md` §9.1; owner decisions Q83,
 * Q85): the first line of a backup file, an SQL comment holding one JSON object, so that the file stays plain SQL that
 * the tool wrote and a restore can check the backup before running any of it (BK-3).
 *
 * **The line:** `-- umbradb-backup ` and the JSON on one line, then `\n`; the dump follows. **The fields** (format 1):
 * `format` (1); `genesisHash`, `start` (S), `height`, `blockHash` — the chain's identity (`core_chain.identity`) and the
 * committed height the dump holds, with its block's hash —; `stateRoot`, the ledger state root stored for that height
 * when `core-ledger-state` keeps one (`core_ledger_state.states`), else null; `history`, every `core_chain.config` row;
 * `migrations`, every `core_chain.migrations` row; `contentsHash` (DT-3), computed in the same snapshot as the dump;
 * `umbradb`, `postgres` and `tool`: the versions of UmbraDB, of the PostgreSQL server and of the tool that wrote the
 * dump. Heights are decimal text and hashes `0x`-prefixed lowercase hex; a history row's `data` is its data fields as
 * JSON, an integer outside ±(2^53 − 1) written exactly (read back with the `deterministic_postgresql` component's
 * lossless reader).
 */

import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import type { PlainObject } from "../config/plain-data.js";
import { UmbraError } from "../db/errors.js";

/** The one format this build writes and reads. */
export const BACKUP_FORMAT = 1;

/** What a backup file's first line starts with. */
export const MANIFEST_PREFIX = "-- umbradb-backup ";

/** A `core_chain.config` row as a manifest holds it. */
export interface ManifestHistoryRow {
  readonly id: string;
  readonly start: string;
  readonly stop: string | null;
  readonly version: string;
  readonly data: PlainObject | null;
  readonly dataHash: string | null;
  readonly provides: readonly string[];
}

/** A `core_chain.migrations` row as a manifest holds it. */
export interface ManifestMigration {
  readonly module: string;
  readonly migration: string;
  /** SHA-256 of the migration's SQL, lowercase hex (DB-9). */
  readonly checksum: string;
  readonly position: number;
}

/** The tool that wrote the dump: `pg_dump` (PostgreSQL's client) or `pglite-tools` (its `pg_dump`), with its version. */
export interface ManifestTool {
  readonly name: "pg_dump" | "pglite-tools";
  readonly version: string;
}

/** A backup's manifest (see the module comment). */
export interface Manifest {
  readonly format: typeof BACKUP_FORMAT;
  readonly genesisHash: string;
  readonly start: string;
  readonly height: string;
  readonly blockHash: string;
  readonly stateRoot: string | null;
  readonly history: readonly ManifestHistoryRow[];
  readonly migrations: readonly ManifestMigration[];
  readonly contentsHash: string;
  readonly umbradb: string;
  readonly postgres: string;
  readonly tool: ManifestTool;
}

/** `JSON.rawJSON` (Node.js 21 and later), which the TypeScript library in use does not declare yet. */
const raw = (JSON as unknown as { rawJSON(text: string): unknown }).rawJSON;

/** The manifest's line, `\n` included: an integer of a row's data outside the safe integers written exactly. */
export function manifestLine(manifest: Manifest): string {
  const json = JSON.stringify(manifest, (_key, value: unknown) =>
    typeof value === "bigint" ? raw(value.toString()) : value,
  );
  return `${MANIFEST_PREFIX}${json}\n`;
}

/** `backup-format-unknown` (BK-3), naming what is wrong with the file; nothing of it was run. */
export function formatUnknown(why: string, details: Readonly<Record<string, unknown>> = {}): UmbraError {
  return new UmbraError(
    "backup-format-unknown",
    `the file is not a backup this build can restore: ${why}; nothing of it was run (BK-3). A backup is the file ` +
      `\`umbradb backup\` writes: its first line is the manifest (format ${BACKUP_FORMAT}), then the dump`,
    details,
  );
}

const HEIGHT = /^(0|[1-9][0-9]*)$/;
const HASH = /^0x[0-9a-f]{64}$/;
const HEX = /^0x(?:[0-9a-f]{2})*$/;
const CHECKSUM = /^[0-9a-f]{64}$/;

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** The manifest of a file whose first line is `line` (without its `\n`); `backup-format-unknown` otherwise. */
export function readManifestLine(line: string): Manifest {
  if (!line.startsWith(MANIFEST_PREFIX)) throw formatUnknown("its first line is not an UmbraDB backup's manifest");
  let value: unknown;
  try {
    value = parseJsonLossless(line.slice(MANIFEST_PREFIX.length));
  } catch {
    throw formatUnknown("its manifest is not JSON");
  }
  if (!isObject(value)) throw formatUnknown("its manifest is not a JSON object");
  if (value.format !== BACKUP_FORMAT) {
    throw formatUnknown(`its manifest's format is ${JSON.stringify(value.format ?? null)}, not ${BACKUP_FORMAT}`, {
      format: value.format ?? null,
    });
  }
  const problems: string[] = [];
  const check = (ok: boolean, field: string) => {
    if (!ok) problems.push(field);
  };
  const text = (field: string, pattern: RegExp, nullable = false) => {
    const v = value[field];
    check((nullable && v === null) || (typeof v === "string" && pattern.test(v)), field);
  };
  text("genesisHash", HASH);
  text("start", HEIGHT);
  text("height", HEIGHT);
  text("blockHash", HASH);
  text("stateRoot", HEX, true);
  text("contentsHash", HASH);
  for (const field of ["umbradb", "postgres"]) check(typeof value[field] === "string", field);
  const tool = value.tool;
  check(
    isObject(tool) &&
      (tool.name === "pg_dump" || tool.name === "pglite-tools") &&
      typeof tool.version === "string",
    "tool",
  );
  const history = value.history;
  check(
    Array.isArray(history) &&
      history.every(
        (row) =>
          isObject(row) &&
          typeof row.id === "string" &&
          typeof row.start === "string" &&
          HEIGHT.test(row.start) &&
          (row.stop === null || (typeof row.stop === "string" && HEIGHT.test(row.stop))) &&
          typeof row.version === "string" &&
          (row.data === null || isObject(row.data)) &&
          (row.dataHash === null || (typeof row.dataHash === "string" && HASH.test(row.dataHash))) &&
          Array.isArray(row.provides) &&
          row.provides.every((item) => typeof item === "string"),
      ),
    "history",
  );
  const migrations = value.migrations;
  check(
    Array.isArray(migrations) &&
      migrations.every(
        (row) =>
          isObject(row) &&
          typeof row.module === "string" &&
          typeof row.migration === "string" &&
          typeof row.checksum === "string" &&
          CHECKSUM.test(row.checksum) &&
          Number.isSafeInteger(row.position) &&
          (row.position as number) >= 1,
      ),
    "migrations",
  );
  if (problems.length > 0) {
    throw formatUnknown(`its manifest's ${problems.join(", ")} ${problems.length === 1 ? "is" : "are"} missing or malformed`, {
      fields: problems,
    });
  }
  return Object.freeze(value) as unknown as Manifest;
}
