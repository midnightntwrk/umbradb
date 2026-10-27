/**
 * Restoring a backup (`openspec/changes/core-arch/specs/backups/spec.md` BK-3, BK-4; `design.md` §9.1; owner decisions
 * Q83, Q85; task 15.2) into an empty database, checked before and after loading, in BK-3's order:
 *
 * **Before loading anything:**
 * 1. `restore-target-not-empty` — the target holds a schema other than PostgreSQL's own and `public`, or anything in
 *    `public`, or an extension other than `plpgsql` ({@link isEmptyDatabase}); a PGlite directory with no database in it
 *    yet is empty (and not opened, which would create one);
 * 2. `backup-format-unknown` — the first line is no manifest of format 1 (`./manifest.ts`), or the dump after it is not
 *    one a restore runs (`./statements.ts`: a `psql` meta-command other than `\restrict`/`\unrestrict`, a `COPY … FROM
 *    stdin`, a file ending inside a statement); the whole file is read for this, none of it run;
 * 3. `backup-history-mismatch` — the configuration's S is not the manifest's, or its history differs from the
 *    manifest's up to the manifest's height, versions included: the configuration history's own check
 *    (`checkHistory`, CF-5, CF-6) against the manifest's rows at its height, whose refusals (`missing-entry`,
 *    `changes-past`) it names;
 * 4. `backup-build-mismatch` — the build does not carry the versions of the revisions covering height + 1
 *    (`upgrade-required` of the same check, CF-8), a version that requires a resync on heights another covers
 *    (DB-10), or every recorded migration with the same ids, positions and checksums (`checkRecordedMigrations`, DB-9);
 * 5. `backup-genesis-mismatch` — the chain's block 0 (the block source: the node's) has another hash than the
 *    manifest's genesis hash;
 * 6. `backup-block-not-finalized` — the chain's finalized head is below the manifest's height, or its block there has
 *    another hash than the manifest's block hash.
 * **Then, in one transaction on the writer connection** (on PGlite one job of its queue; DB-4, DB-5), after the writer
 * started (its lock and the durability probe, DB-11, DB-12): the target checked empty again; the file's statements run
 * one by one; every setting the file set reset (`RESET ALL`); the owners and grants of DB-6 and DB-7 given
 * (`restoreOwnership`, `src/db/roles.ts`, and `restoreGrants`, `src/db/migrate.ts`: the module roles created where the
 * server lacks them); the contents hash recomputed with the tables declared `deterministic: false` by name only and
 * compared with the manifest's (`contents-hash-mismatch`); and, when `core-ledger-state` is in the history, the stored
 * state root at the manifest's height compared with the chain's (`backup-root-mismatch`, the node's root read before
 * the transaction). Any failure rolls all of it back: the target is as it was (empty). Only then it commits.
 *
 * A restore runs the file's SQL with the writer's rights: the operator guide (`docs/operator-guide.md`) says to restore
 * only backups from a trusted source. The restored database keeps the backup's S and cursor; its first startup checks
 * it like any other (IN-3, CF-5 to CF-8, DB-9) and resumes from the height + 1 (BK-4).
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { isBlockLedgerSource } from "../backbone/core-block-fetch/ledger-source.js";
import { CORE_LEDGER_STATE_ID } from "../backbone/core-ledger-state/core-ledger-state.js";
import { checkHistory, graphInputOf, type HistoryRow } from "../config/history.js";
import type { PlainObject } from "../config/plain-data.js";
import type { CheckedConfig } from "../config/validate.js";
import type { Database, Transaction } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { checkRecordedMigrations, restoreGrants } from "../db/migrate.js";
import { restoreOwnership, type SchemaPlan } from "../db/roles.js";
import { startWriter } from "../db/writer-lock.js";
import { contentsHash } from "../determinism/contents-hash.js";
import { schemaPlan } from "../modules/adapters.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { resolveGraph } from "../modules/graph.js";
import type { DeclarationSet } from "../modules/validation.js";
import type { BlockSource } from "../runner/block-source.js";
import { hex } from "./facts.js";
import { type Manifest, readManifestLine } from "./manifest.js";
import { checkStatements, statementsOf } from "./statements.js";
import { firstLine } from "./backup.js";

/** Where the target is: a PGlite directory with no database in it yet is empty and opened only to load. */
export type RestoreTarget =
  | { readonly backend: "postgres" }
  | { readonly backend: "pglite"; readonly exists: boolean };

/** What {@link restoreBackup} restores, into what, and against which chain. */
export interface RestoreInput {
  /** The backup file. */
  readonly file: string;
  readonly target: RestoreTarget;
  /** Opens the target database (called at most once; a PGlite directory's is created by it). */
  readonly open: () => Promise<Database>;
  /** The validated configuration and the build's declarations (the configuration file's, CF-1). */
  readonly config: CheckedConfig;
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** The chain the checks read: the node's block source (genesis, finalized blocks, the ledger state root). */
  readonly source: BlockSource;
}

/** What the tests replace: the committed negative controls' and A127's. */
export interface RestoreSeams {
  /** Called after each statement of the file ran, with how many ran (A127's kill point). */
  readonly statementRan?: (count: number) => Promise<void> | void;
  /** A126/A127's negative controls only: skip the contents hash's check, or the state root's. */
  readonly skip?: { readonly contentsHash?: boolean; readonly stateRoot?: boolean };
  /** A127's negative control only: each statement in a transaction of its own, so a kill leaves what ran. */
  readonly statementByStatement?: boolean;
}

/** A restore that committed: its manifest. */
export interface Restored {
  readonly manifest: Manifest;
  /** How many statements of the file ran. */
  readonly statements: number;
}

/** Whether the database `query` reads holds nothing (see the module comment). */
const EMPTY_SQL = `SELECT
  NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname NOT IN ('public', 'information_schema')
    AND nspname NOT LIKE 'pg\\_%') AS no_schemas,
  NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public')
    AS no_relations,
  NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public')
    AS no_routines,
  NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public')
    AS no_types,
  NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname <> 'plpgsql') AS no_extensions`;

/** Whether the database `read` sees is empty (see the module comment). */
export async function isEmptyDatabase(read: Pick<Transaction, "query">): Promise<boolean> {
  const [row] = await read.query(EMPTY_SQL);
  return Object.values(row ?? {}).every((value) => value === true);
}

/** `restore-target-not-empty`. */
function notEmpty(): UmbraError {
  return new UmbraError(
    "restore-target-not-empty",
    "the target database is not empty: a backup is restored into an empty database only (BK-3), and nothing was " +
      "changed. Restore into a new database, or drop this one's schemas first",
  );
}

/** The manifest's history as the configuration history's rows. */
function historyRows(manifest: Manifest): HistoryRow[] {
  return manifest.history.map((row) =>
    Object.freeze({
      id: row.id,
      start: BigInt(row.start),
      stop: row.stop === null ? null : BigInt(row.stop),
      version: row.version,
      data: row.data as PlainObject | null,
      dataHash: row.dataHash === null ? null : Buffer.from(row.dataHash.slice(2), "hex"),
    }),
  );
}

/** The lines of `file` from its second on (the dump), as a stream. */
function dumpLines(file: string): AsyncIterable<string> {
  const lines = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  return (async function* () {
    let first = true;
    for await (const line of lines) {
      if (first) {
        first = false;
        continue;
      }
      yield line;
    }
  })();
}

/** A refusal of the history check, as a restore names it (see the module comment). */
function historyRefusal(error: unknown, manifest: Manifest): unknown {
  if (!(error instanceof UmbraError)) return error;
  const at = `at the backup's height ${manifest.height}`;
  if (error.code === "missing-entry" || error.code === "changes-past") {
    return new UmbraError(
      "backup-history-mismatch",
      `the configuration's history differs from the backup's ${at} (BK-3; ${error.code}): ${error.message}`,
      { ...error.details, refusal: error.code },
      { cause: error },
    );
  }
  if (error.code === "upgrade-required" || error.code === "requires-resync") {
    return new UmbraError(
      "backup-build-mismatch",
      `this build cannot continue the backup ${at} (BK-3; ${error.code}): ${error.message}`,
      { ...error.details, refusal: error.code },
      { cause: error },
    );
  }
  return error;
}

/** What the checks before loading found: the plan of the backup's modules and the chain's root at its height. */
interface Checked {
  readonly manifest: Manifest;
  readonly plan: SchemaPlan;
  /** The chain's ledger state root at the backup's height, when `core-ledger-state` is in the history. */
  readonly nodeRoot: Uint8Array | null;
}

/** BK-3's checks 2 to 6 (see the module comment). */
async function checkBeforeLoading(input: RestoreInput): Promise<Checked> {
  const manifest = readManifestLine(await firstLine(input.file));
  await checkStatements(dumpLines(input.file));
  const height = BigInt(manifest.height);
  if (manifest.start !== String(input.config.start)) {
    throw new UmbraError(
      "backup-history-mismatch",
      `the configuration starts at ${input.config.start} and the backup's database at ${manifest.start}: a restored ` +
        "database keeps its S (BK-3, BK-4), so the configuration must have the backup's",
      { refusal: "start", configured: input.config.start, backup: manifest.start },
    );
  }
  let plan: SchemaPlan;
  try {
    const check = checkHistory({
      config: input.config,
      cursor: height,
      declarations: input.declarations,
      history: historyRows(manifest),
    });
    const graph = resolveGraph(graphInputOf(check, input.declarations));
    plan = schemaPlan(graph.modules);
    checkRecordedMigrations(
      plan,
      graph.modules.map((part) => ({
        id: part.id,
        version: part.version,
        ...(part.requiresResync === undefined ? {} : { requiresResync: part.requiresResync }),
        migrations: part.migrations.map(({ id, sql }) => ({ id, sql })),
      })),
      manifest.migrations.map((row) => ({
        module: row.module,
        migration_id: row.migration,
        checksum: row.checksum,
        position: row.position,
      })),
      check.committedVersions,
    );
  } catch (error) {
    if (error instanceof UmbraError && (error.code === "migration-missing" || error.code === "migration-checksum-changed")) {
      throw new UmbraError(
        "backup-build-mismatch",
        `this build does not carry every migration the backup's database applied (BK-3; ${error.code}): ${error.message}`,
        { ...error.details, refusal: error.code },
        { cause: error },
      );
    }
    throw historyRefusal(error, manifest);
  }
  const genesis = (await input.source.block(0n)).hash;
  if (hex(genesis) !== manifest.genesisHash) {
    throw new UmbraError(
      "backup-genesis-mismatch",
      `the node's genesis hash is ${hex(genesis)} and the backup's chain's ${manifest.genesisHash}: the node serves ` +
        "another chain (BK-3)",
      { node: hex(genesis), backup: manifest.genesisHash },
    );
  }
  const head = await input.source.finalizedHead();
  if (head.height < height) {
    throw new UmbraError(
      "backup-block-not-finalized",
      `the node's finalized head is ${head.height}, below the backup's height ${height}: its block is not finalized ` +
        "there yet (BK-3); restore once the node has finalized it",
      { height: manifest.height, head: String(head.height) },
    );
  }
  const block = await input.source.block(height);
  if (hex(block.hash) !== manifest.blockHash) {
    throw new UmbraError(
      "backup-block-not-finalized",
      `the node's finalized block at ${height} has the hash ${hex(block.hash)}, and the backup's ${manifest.blockHash}: ` +
        "the node finalized another block there (BK-3)",
      { height: manifest.height, node: hex(block.hash), backup: manifest.blockHash },
    );
  }
  const ledger = manifest.history.some((row) => row.id === CORE_LEDGER_STATE_ID && BigInt(row.start) <= height);
  let nodeRoot: Uint8Array | null = null;
  if (ledger) {
    if (!isBlockLedgerSource(input.source)) {
      throw new Error("restoreBackup: core-ledger-state is in the backup's history, and the block source gives no root");
    }
    nodeRoot = await input.source.ledgerStateRoot(block);
  }
  return { manifest, plan, nodeRoot };
}

const STORED_ROOT_SQL = `SELECT CASE WHEN to_regclass('core_ledger_state.states') IS NULL THEN NULL
  ELSE (SELECT state_root FROM core_ledger_state.states WHERE height = $1) END AS root`;

/** The load and the checks after it, in `tx` (see the module comment); resolves with how many statements ran. */
async function load(tx: Transaction, input: RestoreInput, checked: Checked, seams: RestoreSeams): Promise<number> {
  if (!(await isEmptyDatabase(tx))) throw notEmpty();
  let count = 0;
  for await (const statement of statementsOf(dumpLines(input.file))) {
    await tx.execute(statement.sql);
    count += 1;
    await seams.statementRan?.(count);
  }
  await tx.execute("RESET ALL");
  await restoreOwnership(tx, checked.plan);
  await restoreGrants(tx, checked.plan);
  const { manifest } = checked;
  if (seams.skip?.contentsHash !== true) {
    const hash = hex(await contentsHash({ query: (sql, params) => tx.query(sql, params) }, { optedOut: checked.plan.optedOut }));
    if (hash !== manifest.contentsHash) {
      throw new UmbraError(
        "contents-hash-mismatch",
        `the restored database's contents hash is ${hash}, and the backup's manifest says ${manifest.contentsHash}: ` +
          "the file's rows are not the backup's (BK-3); nothing was restored",
        { restored: hash, backup: manifest.contentsHash },
      );
    }
  }
  if (checked.nodeRoot !== null && seams.skip?.stateRoot !== true) {
    const [row] = await tx.query(STORED_ROOT_SQL, [manifest.height]);
    const stored = row?.root === null || row?.root === undefined ? null : hex(row.root as Uint8Array);
    if (stored !== hex(checked.nodeRoot)) {
      throw new UmbraError(
        "backup-root-mismatch",
        `the ledger state root the backup stores for height ${manifest.height} is ${stored ?? "none"}, and the node's ` +
          `is ${hex(checked.nodeRoot)} (BK-3, LG-15); nothing was restored`,
        { height: manifest.height, stored, node: hex(checked.nodeRoot) },
      );
    }
  }
  return count;
}

/**
 * Restores the backup `input.file` (see the module comment) and resolves once it committed; rejects with BK-3's
 * refusals — or the database's failures — having changed nothing (the target empty, or as it was when not empty).
 */
export async function restoreBackup(input: RestoreInput, seams: RestoreSeams = {}): Promise<Restored> {
  let db: Database | undefined;
  try {
    if (input.target.backend === "postgres" || input.target.exists) {
      db = await input.open();
      if (!(await db.read((read) => isEmptyDatabase(read)))) throw notEmpty();
    }
    const checked = await checkBeforeLoading(input);
    db ??= await input.open();
    await startWriter(db);
    const opened = db;
    let statements: number;
    if (seams.statementByStatement === true) {
      statements = 0;
      for await (const statement of statementsOf(dumpLines(input.file))) {
        await opened.transaction((tx) => tx.execute(statement.sql));
        statements += 1;
        await seams.statementRan?.(statements);
      }
    } else {
      statements = await opened.transaction((tx) => load(tx, input, checked, seams));
    }
    return Object.freeze({ manifest: checked.manifest, statements });
  } finally {
    await db?.close();
  }
}
