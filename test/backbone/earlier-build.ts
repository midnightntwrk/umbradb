import { createHash } from "node:crypto";
import { CORE_CHAIN_MIGRATIONS } from "../../src/backbone/core-chain/sql.js";
import { CORE_LEDGER_STATE_MIGRATIONS } from "../../src/backbone/core-ledger-state/sql.js";
import { CORE_PRIVATE_SOURCE_MIGRATIONS } from "../../src/backbone/core-private-source/sql.js";
import { type ManifestMigration, manifestLine, readManifestLine } from "../../src/backup/manifest.js";
import { UmbraError } from "../../src/db/errors.js";

/**
 * A database written by an earlier build, as this build's one migration per part meets it. [R16, DB-9, BK-3]
 *
 * The builds before one migration per part (`v0.10.0-rc.2`, and this branch before it) gave `core-chain`,
 * `core-ledger-state` and `core-private-source` two migrations each, `001` and `002`, and a database they wrote
 * recorded both. Their checksums are pinned here (SHA-256 of each migration's SQL as those builds declared it). This
 * build declares one migration per part, `001`, whose SQL creates every table of the two, so its checksum is not the
 * recorded `001`'s: startup refuses such a database before any migration runs (`migration-checksum-changed`), and a
 * restore refuses its backup (`backup-build-mismatch`).
 *
 * A test makes such a database by recording the earlier build's rows of a part in `core_chain.migrations` in place of
 * this build's ({@link earlierRowsSql}), and such a backup by rewriting the rows its manifest and dump hold
 * ({@link earlierBackup}).
 */

/** The parts whose two migrations this build folds into one. */
export type FoldedPart = "core-chain" | "core-ledger-state" | "core-private-source";

/** The checksums an earlier build recorded for each part's `001` and `002`, as lowercase hex. */
export const EARLIER_BUILD: Readonly<Record<FoldedPart, readonly [string, string]>> = Object.freeze({
  "core-chain": [
    "33861745ea470f413c9f6d042c2398e366d3b42be2e5dbf12e2c0147eff43a74",
    "c5474e25be7bdd0bf5a68965a20471039819cbb222750a5099252d130e074fc1",
  ],
  "core-ledger-state": [
    "03d6dfb6e31fc032b6968c47eb2aa56f70c7b4ee18817a21d5b81ea70e313309",
    "89fd6b3df548a5f7ea30b4489804496790d91386e80a18f78b8b12f38328ba47",
  ],
  "core-private-source": [
    "31673417978dfbf75bf29712de9623c553c5c15e4d0410786fd1b37edc103ffb",
    "0cd0b65c4ca164afa597534893f2190ac711a44c0eba1fe67b2e1622e2d2b329",
  ],
});

/** A recorded migration: its id, its place in the part's list and its checksum (hex). */
export interface RecordedMigration {
  readonly id: string;
  readonly position: number;
  readonly checksum: string;
}

const sha256 = (sql: string): string => createHash("sha256").update(sql, "utf8").digest("hex");

const recorded = (migrations: readonly { readonly id: string; readonly sql: string }[]): readonly RecordedMigration[] =>
  Object.freeze(migrations.map(({ id, sql }, index) => Object.freeze({ id, position: index + 1, checksum: sha256(sql) })));

/** The migrations this build records for each part: what a new database holds. */
export const THIS_BUILD: Readonly<Record<FoldedPart, readonly RecordedMigration[]>> = Object.freeze({
  "core-chain": recorded(CORE_CHAIN_MIGRATIONS),
  "core-ledger-state": recorded(CORE_LEDGER_STATE_MIGRATIONS),
  "core-private-source": recorded(CORE_PRIVATE_SOURCE_MIGRATIONS),
});

/** The migrations an earlier build recorded for `part`. */
export function earlierRows(part: FoldedPart): readonly RecordedMigration[] {
  const [first, second] = EARLIER_BUILD[part];
  return [
    { id: "001", position: 1, checksum: first },
    { id: "002", position: 2, checksum: second },
  ];
}

/** The statements (one each) that record `rows` as `part`'s migrations, in place of the ones recorded. */
export function rowsSql(part: FoldedPart, rows: readonly RecordedMigration[]): string[] {
  const values = rows.map((row) => `('${part}', '${row.id}', decode('${row.checksum}', 'hex'), ${row.position})`);
  return [
    `DELETE FROM core_chain.migrations WHERE module = '${part}'`,
    `INSERT INTO core_chain.migrations (module, migration_id, checksum, position) VALUES ${values.join(", ")}`,
  ];
}

/** The statements that record an earlier build's migrations of `part` in place of this build's. */
export const earlierRowsSql = (part: FoldedPart): string[] => rowsSql(part, earlierRows(part));

/**
 * The statements that make an empty database hold `core_chain.migrations`, as startup's bootstrap creates it, and in it
 * only an earlier build's rows of `parts`: what an earlier build recorded, with none of the tables its migrations made.
 */
export function earlierBootstrapSql(parts: readonly FoldedPart[]): string[] {
  return [
    "CREATE SCHEMA core_chain",
    `CREATE TABLE core_chain.migrations (
  module text NOT NULL,
  migration_id text NOT NULL,
  checksum bytea NOT NULL CHECK (octet_length(checksum) = 32),
  position integer NOT NULL CHECK (position >= 1),
  PRIMARY KEY (module, migration_id),
  UNIQUE (module, position)
)`,
    ...parts.flatMap(earlierRowsSql),
  ];
}

/**
 * What is wrong with `error` as the refusal of an earlier build's records of `part`, none when it is right: startup's
 * `migration-checksum-changed` (or, for a restore, `backup-build-mismatch` whose `details.refusal` is that code)
 * naming the part, its `001` at position 1, the checksum recorded and this build's, both also in its message.
 */
export function earlierRefusalProblems(
  error: unknown,
  part: FoldedPart,
  code: "migration-checksum-changed" | "backup-build-mismatch" = "migration-checksum-changed",
): string[] {
  if (!(error instanceof UmbraError)) return [`the start was not refused with an UmbraError: ${String(error)}`];
  const problems: string[] = [];
  const [applied] = EARLIER_BUILD[part];
  const build = THIS_BUILD[part][0]?.checksum as string;
  const { details } = error;
  if (error.code !== code) problems.push(`refused with ${error.code}, not ${code}`);
  if (code === "backup-build-mismatch" && details.refusal !== "migration-checksum-changed") {
    problems.push(`its refusal is ${String(details.refusal)}, not migration-checksum-changed`);
  }
  const named = { module: details.module, migration: details.migration, position: details.position, applied: details.applied, build: details.build };
  const expected = { module: part, migration: "001", position: 1, applied, build };
  if (JSON.stringify(named) !== JSON.stringify(expected)) {
    problems.push(`it names ${JSON.stringify(named)}, not ${JSON.stringify(expected)}`);
  }
  if (applied === build) problems.push(`this build's 001 of ${part} has the earlier build's checksum`);
  if (!error.message.includes(applied) || !error.message.includes(build)) problems.push("its message does not name both checksums");
  return problems;
}

/** The rows of `core_chain.migrations`, each as `module/id@position:checksum`, in module and position order. */
export const MIGRATION_ROWS_SQL = `SELECT module || '/' || migration_id || '@' || position || ':' || encode(checksum, 'hex') AS row
  FROM core_chain.migrations ORDER BY module COLLATE "C", position`;

/** Every schema and table of a database outside PostgreSQL's own, each as `schema` or `schema.table`, in order. */
export const CATALOG_SQL = `SELECT name FROM (
    SELECT nspname AS name FROM pg_namespace WHERE nspname NOT LIKE 'pg\\_%' AND nspname <> 'information_schema'
    UNION ALL
    SELECT schemaname || '.' || tablename FROM pg_tables WHERE schemaname NOT LIKE 'pg\\_%' AND schemaname <> 'information_schema'
  ) AS c ORDER BY name COLLATE "C"`;

/**
 * The text of a backup file with `part`'s recorded migrations an earlier build's: in its manifest (its first line) and
 * in the dump's `INSERT` of `core_chain.migrations`. Throws when the backup holds no row of `part`.
 */
export function earlierBackup(text: string, part: FoldedPart): string {
  const end = text.indexOf("\n");
  const manifest = readManifestLine(text.slice(0, end));
  const at = manifest.migrations.findIndex((row) => row.module === part);
  if (at < 0) throw new Error(`the backup's manifest records no migration of ${part}`);
  const earlier: ManifestMigration[] = earlierRows(part).map((row) => ({
    module: part,
    migration: row.id,
    checksum: row.checksum,
    position: row.position,
  }));
  const others = manifest.migrations.filter((row) => row.module !== part);
  const migrations = [...others.slice(0, at), ...earlier, ...others.slice(at)];
  const line = manifestLine({ ...manifest, migrations });
  const dump = text.slice(end + 1).split("\n");
  const inserts = dump.flatMap((statement, index) =>
    statement.startsWith("INSERT INTO core_chain.migrations ") && statement.includes(`'${part}'`) ? [index] : [],
  );
  if (inserts.length !== THIS_BUILD[part].length) {
    throw new Error(`the backup's dump holds ${inserts.length} rows of ${part}'s migrations, not ${THIS_BUILD[part].length}`);
  }
  const [first] = inserts as [number];
  const template = dump[first] as string;
  const own = THIS_BUILD[part][0] as RecordedMigration;
  if (!template.includes(own.checksum)) throw new Error(`the dump's row of ${part}'s 001 does not hold its checksum`);
  const rows = earlierRows(part).map((row) =>
    template
      .replace(own.checksum, row.checksum)
      .replace(`'${own.id}'`, `'${row.id}'`)
      .replace(new RegExp(`, ${own.position}\\);$`), `, ${row.position});`),
  );
  const rewritten = dump.flatMap((statement, index) => (index === first ? rows : inserts.includes(index) ? [] : [statement]));
  return line + rewritten.join("\n");
}
