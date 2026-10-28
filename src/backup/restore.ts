/**
 * Restoring a backup (`openspec/changes/core-arch/specs/backups/spec.md` BK-3, BK-4; `design.md` §9.1; owner decisions
 * Q83, Q85, Q153; tasks 15.2, 15.2a) into an empty database, checked before and after loading, in BK-3's order:
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
 * **A private process's backup** (PP-12, owner decision Q153; task 15.2a), restored with a private process's
 * configuration ({@link RestoreInput}'s `publicDatabase`): its chain is its configured public database — a private
 * process never talks to the node (PP-1) —, so the checks against the node are made against it, as a private start
 * makes them (PP-2, PP-13). After step 3, in one read of the public database ({@link PublicSide}): its chain identity —
 * none refuses `private-binding-mismatch` (`public-not-started`) —, its genesis hash against the configured network's
 * (`network`), and the backup's S (the configuration's, step 3) against the public S (`private-start-below`) — in the
 * place of step 5 and before the graph, which counts the public core's `table` items read in the same read (PP-13), so
 * that a wrong public database is refused by its binding, not by the graph's view of its items; then step 4; then step
 * 6 against the public database's committed head and its block at the manifest's height (`backup-block-not-finalized`).
 * After loading, after the contents hash: the binding the backup's own `core_private_source.cursor` row records — the
 * public genesis hash and S it was bound to (PP-2) — compared with the public database's identity
 * (`private-binding-mismatch`: `genesis`, `start`), so a backup taken against another public database rolls back. The
 * reasons are PP-2's (`bindingRefusal`, `networkRefusal`, `publicNotStarted` of `core-private-source`, the startup's
 * own), in the order a private start checks them.
 *
 * **The file** is read by its path, or as the text given (`./text.ts`): the browser page restores the file the user
 * picked, a `Blob`, with this same function (BK-5, task 16.1's A131 half; `browser/src/process-worker.ts`).
 *
 * A restore runs the file's SQL with the writer's rights: the operator guide (`docs/operator-guide.md`) says to restore
 * only backups from a trusted source. The restored database keeps the backup's S and cursor; its first startup checks
 * it like any other (IN-3, CF-5 to CF-8, DB-9; a private one its binding, PP-2) and resumes from the height + 1 (BK-4).
 */

import { createReadStream } from "node:fs";
import { isBlockLedgerSource } from "../backbone/core-block-fetch/ledger-source.js";
import { configuredGenesisOf } from "../backbone/core-chain/core-chain.js";
import { CORE_LEDGER_STATE_ID } from "../backbone/core-ledger-state/core-ledger-state.js";
import {
  bindingRefusal,
  networkRefusal,
  publicNotStarted,
  readPrivateBinding,
} from "../backbone/core-private-source/core-private-source.js";
import {
  type PublicDatabase,
  type PublicIdentity,
  readPublicBlock,
  readPublicCursor,
  readPublicIdentity,
  readPublicItems,
} from "../backbone/core-private-source/public-database.js";
import { checkHistory, graphInputOf, type HistoryRow } from "../config/history.js";
import type { PlainObject } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import type { CheckedConfig } from "../config/validate.js";
import type { Database, Transaction } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { checkRecordedMigrations, restoreGrants } from "../db/migrate.js";
import { restoreOwnership, type SchemaPlan } from "../db/roles.js";
import { startWriter } from "../db/writer-lock.js";
import { contentsHash } from "../determinism/contents-hash.js";
import { schemaPlan } from "../modules/adapters.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { type PublicItem, resolveGraph } from "../modules/graph.js";
import type { DeclarationSet } from "../modules/validation.js";
import type { BlockRef, BlockSource } from "../runner/block-source.js";
import { hex } from "./facts.js";
import { type Manifest, readManifestLine } from "./manifest.js";
import { checkStatements, statementsOf } from "./statements.js";
import { firstLine } from "./backup.js";
import { type BackupText, linesAfterFirst } from "./text.js";

/** Where the target is: a PGlite directory with no database in it yet is empty and opened only to load. */
export type RestoreTarget =
  | { readonly backend: "postgres" }
  | { readonly backend: "pglite"; readonly exists: boolean };

/** What every restore takes: the file, the target, and the configuration with its build. */
interface RestoreBase {
  /**
   * The backup file: its path, or its text (the browser page's file, BK-5: `blobText` of `./text.ts`), read once for
   * its manifest and twice for its statements (checked whole before anything loads, then run).
   */
  readonly file: string | BackupText;
  readonly target: RestoreTarget;
  /** Opens the target database (called at most once; a PGlite directory's is created by it). */
  readonly open: () => Promise<Database>;
  /** The validated configuration and the build's declarations (the configuration file's, CF-1). */
  readonly config: CheckedConfig;
  readonly declarations: DeclarationSet<ModuleDeclaration>;
}

/**
 * The chain a restore checks against: a public process's backup the node's (`source`, its block source: genesis,
 * finalized blocks, the ledger state root), a private process's its configured public database (`publicDatabase`, as
 * the private process reads it; PP-12, owner decision Q153).
 */
export type RestoreChain =
  | { readonly source: BlockSource; readonly publicDatabase?: undefined }
  | { readonly publicDatabase: PublicDatabase; readonly source?: undefined };

/** What {@link restoreBackup} restores, into what, and against which chain. */
export type RestoreInput = RestoreBase & RestoreChain;

/** What the tests replace: the committed negative controls' and A127's. */
export interface RestoreSeams {
  /** Called after each statement of the file ran, with how many ran (A127's kill point). */
  readonly statementRan?: (count: number) => Promise<void> | void;
  /**
   * The committed negative controls only: skip the contents hash's check, the state root's, or the comparison of a
   * private backup's recorded binding with its public database (A126, A164).
   */
  readonly skip?: { readonly contentsHash?: boolean; readonly stateRoot?: boolean; readonly binding?: boolean };
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

/**
 * The lines of `file` from its second on (the dump), as a stream ({@link linesAfterFirst}: the text between line
 * feeds, a last line without one included). Split there rather than by `node:readline`, whose async iterator fails with
 * `ERR_USE_AFTER_CLOSE` when the file has been read to its end while the restore, slower than the read, still takes the
 * lines buffered (task 13.1 met it restoring on PostgreSQL), and which also ends a line at a lone carriage return, which
 * a dumped string may hold.
 */
export function dumpLines(file: string): AsyncGenerator<string> {
  return linesAfterFirst(createReadStream(file, { encoding: "utf8" }) as AsyncIterable<string>);
}

/** The text a restore reads: a file's, by its path, or the one given (the browser page's `Blob`, `./text.ts`). */
function textOf(file: string | BackupText): BackupText {
  if (typeof file !== "string") return file;
  return { firstLine: () => firstLine(file), lines: () => dumpLines(file) };
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

/**
 * What the checks before loading found: the plan of the backup's modules, the chain's root at its height and, for a
 * private process's backup, its public database's identity.
 */
interface Checked {
  readonly manifest: Manifest;
  readonly plan: SchemaPlan;
  /** The chain's ledger state root at the backup's height, when `core-ledger-state` is in the history. */
  readonly nodeRoot: Uint8Array | null;
  /** A private process's backup: the public database's identity, which the restored binding must be (PP-2). */
  readonly publicIdentity: PublicIdentity | null;
}

/** What a private process's backup's checks read of its public database, in one read (see the module comment). */
export interface PublicSide {
  readonly identity: PublicIdentity;
  /** The public core's `table` items with their heights (PP-13). */
  readonly items: readonly PublicItem[];
  /** The public cursor: its core's last committed block, or null before its first. */
  readonly head: BlockRef | null;
  /** Its committed block at the backup's height, or null. */
  readonly block: BlockRef | null;
}

/**
 * The public database of a private process's backup, read once, and its binding as far as the manifest gives it (see
 * the module comment): `private-binding-mismatch` with `public-not-started`, `network` or `private-start-below`.
 */
async function checkPublicSide(
  publicDatabase: PublicDatabase,
  config: CheckedConfig,
  manifest: Manifest,
): Promise<PublicSide> {
  const height = BigInt(manifest.height);
  const side = await publicDatabase.read(async (read): Promise<PublicSide | null> => {
    const identity = await readPublicIdentity(read);
    if (identity === null) return null;
    const items = await readPublicItems(read);
    return { identity, items, head: await readPublicCursor(read), block: await readPublicBlock(read, height) };
  });
  if (side === null) throw publicNotStarted();
  const network = networkRefusal(configuredGenesisOf(processCoreEntry(config).settings as PlainObject), side.identity);
  if (network !== null) throw network;
  // The backup's binding itself is in its rows, compared once loaded: here only its S against the public S.
  const below = bindingRefusal(null, side.identity, BigInt(manifest.start));
  if (below !== null) throw below;
  return side;
}

/**
 * Step 6 against a private process's public database (see the module comment): `backup-block-not-finalized`. Exported
 * for its tests.
 */
export function checkPublicBlock(side: PublicSide, manifest: Manifest): void {
  const height = BigInt(manifest.height);
  const head = side.head?.height ?? null;
  if (head === null || head < height) {
    throw new UmbraError(
      "backup-block-not-finalized",
      `the public database's committed head is ${head ?? "none"}, below the backup's height ${height}: its core has ` +
        "not committed the backup's block there yet (BK-3, PP-12); restore once it has",
      { height: manifest.height, head: head === null ? null : String(head) },
    );
  }
  const found = side.block === null ? null : hex(side.block.hash);
  if (found !== manifest.blockHash) {
    throw new UmbraError(
      "backup-block-not-finalized",
      `the public database's committed block at ${height} has the hash ${found ?? "none"}, and the backup's ` +
        `${manifest.blockHash}: its core committed another block there (BK-3, PP-12)`,
      { height: manifest.height, public: found, backup: manifest.blockHash },
    );
  }
}

/** BK-3's checks 2 to 6 (see the module comment). */
async function checkBeforeLoading(input: RestoreInput): Promise<Checked> {
  const text = textOf(input.file);
  const manifest = readManifestLine(await text.firstLine());
  await checkStatements(text.lines());
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
  let side: PublicSide | null = null;
  try {
    const check = checkHistory({
      config: input.config,
      cursor: height,
      declarations: input.declarations,
      history: historyRows(manifest),
    });
    // A private process's backup: its public database's binding before the graph, which counts its items (PP-13).
    if (input.publicDatabase !== undefined) side = await checkPublicSide(input.publicDatabase, input.config, manifest);
    const graph = resolveGraph({
      ...graphInputOf(check, input.declarations),
      ...(side === null ? {} : { publicItems: side.items }),
    });
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
  if (side !== null) {
    checkPublicBlock(side, manifest);
    return { manifest, plan, nodeRoot: null, publicIdentity: side.identity };
  }
  const source = input.source as BlockSource;
  const genesis = (await source.block(0n)).hash;
  if (hex(genesis) !== manifest.genesisHash) {
    throw new UmbraError(
      "backup-genesis-mismatch",
      `the node's genesis hash is ${hex(genesis)} and the backup's chain's ${manifest.genesisHash}: the node serves ` +
        "another chain (BK-3)",
      { node: hex(genesis), backup: manifest.genesisHash },
    );
  }
  const head = await source.finalizedHead();
  if (head.height < height) {
    throw new UmbraError(
      "backup-block-not-finalized",
      `the node's finalized head is ${head.height}, below the backup's height ${height}: its block is not finalized ` +
        "there yet (BK-3); restore once the node has finalized it",
      { height: manifest.height, head: String(head.height) },
    );
  }
  const block = await source.block(height);
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
    if (!isBlockLedgerSource(source)) {
      throw new Error("restoreBackup: core-ledger-state is in the backup's history, and the block source gives no root");
    }
    nodeRoot = await source.ledgerStateRoot(block);
  }
  return { manifest, plan, nodeRoot, publicIdentity: null };
}

const STORED_ROOT_SQL = `SELECT CASE WHEN to_regclass('core_ledger_state.states') IS NULL THEN NULL
  ELSE (SELECT state_root FROM core_ledger_state.states WHERE height = $1) END AS root`;

/** The load and the checks after it, in `tx` (see the module comment); resolves with how many statements ran. */
async function load(tx: Transaction, input: RestoreInput, checked: Checked, seams: RestoreSeams): Promise<number> {
  if (!(await isEmptyDatabase(tx))) throw notEmpty();
  let count = 0;
  for await (const statement of statementsOf(textOf(input.file).lines())) {
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
  if (checked.publicIdentity !== null && seams.skip?.binding !== true) {
    // The binding the backup's own row records (PP-2), now that the contents hash showed the rows are the backup's.
    const refusal = bindingRefusal(await readPrivateBinding(tx), checked.publicIdentity, BigInt(manifest.start));
    if (refusal !== null) throw refusal;
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
      for await (const statement of statementsOf(textOf(input.file).lines())) {
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
