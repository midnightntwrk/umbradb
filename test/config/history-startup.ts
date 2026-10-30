import { z } from "zod";
import { CONFIG_MIGRATION, readHistory, recordHistory } from "../../src/backbone/core-chain/index.js";
import {
  checkHistory,
  graphInputOf,
  HISTORY_RULES,
  type HistoryCheck,
  type HistoryInput,
  type HistoryRow,
  type HistoryRule,
} from "../../src/config/history.js";
import { plainData } from "../../src/config/plain-data.js";
import { validateConfig } from "../../src/config/validate.js";
import type { Database } from "../../src/db/api.js";
import { type AppliedMigration, startDatabase } from "../../src/db/migrate.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import { defineModule, type ModuleDeclaration, type ProcessContext } from "../../src/modules/declaration.js";
import { type ResolvedGraph, resolveGraph } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { FILE } from "./history-fixtures.js";

/**
 * A startup standing in for the runner's and for the backbone part `core-chain`. It runs the startup steps in order:
 * 1. the declarations are validated;
 * 2. the configuration is validated;
 * 3. (the database is opened, with its writer lock and durability probe; the database tests open it themselves);
 * 4. the history is read and checked with the cursor, including the version check, all before any migration;
 *    [CF-5, CF-6, CF-8]
 * 5. the graph is resolved with the check's entries, S, opt-in and cursor, then the schema plan is made;
 * 6. `startDatabase` runs with the check's committed versions. Its first part is `core-chain`: its migration `001`
 *    creates `core_chain.config`, and its `on-start-db` compares the history again and records it, in one
 *    transaction. [CF-6]
 *
 * The cursor is given, because the `blocks` table that holds it belongs to the real `core-block-commit` part. A test
 * commits "blocks" by passing a higher cursor to the next startup. [A72]
 */

/**
 * A stand-in for `core-block-fetch`: the `block-header` item every test module requires, and the `ledger-version` item
 * the real `core-block-commit` requires (some tests add it).
 */
const BLOCK_FETCH = defineModule({
  id: "core-block-fetch",
  version: "0.10.0",
  side: "public",
  requires: [],
  provides: [
    { name: "block-header", lifetimes: ["block"] },
    { name: "ledger-version", lifetimes: ["block"] },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {},
});

/** What `core-chain`'s `on-start-db` records with: set by each startup before `startDatabase` runs. */
interface Holder {
  input?: Omit<HistoryInput, "history">;
  rules?: readonly HistoryRule[];
  check?: HistoryCheck;
}

/**
 * A stand-in for `core-chain`: `core_chain.config`'s migration (`001`; the real part's `002`, its identity, is not
 * needed here), and the history recorded in its `on-start-db`.
 */
function coreChain(holder: Holder): ModuleDeclaration {
  return defineModule({
    id: "core-chain",
    version: "0.10.0",
    side: "public",
    requires: [],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: CONFIG_MIGRATION.id, sql: CONFIG_MIGRATION.sql }],
    points: {
      async "on-start-db"(_p, w) {
        if (holder.input === undefined) throw new Error("core-chain's on-start-db ran before the history was checked");
        holder.check = await recordHistory(w, holder.input, { rules: holder.rules ?? HISTORY_RULES });
      },
    },
  });
}

function processContext(): ProcessContext {
  return { items: new Map(), revisions: [], publish: () => undefined };
}

/** One startup: the configuration's entries, the build's user modules, the cursor. */
export interface StartupOptions {
  readonly entries: readonly unknown[];
  readonly user: readonly ModuleDeclaration[];
  readonly cursor: bigint | null;
  /** The history's rules (a negative control leaves one out); every rule unless given. */
  readonly rules?: readonly HistoryRule[];
  /**
   * A negative control: the version check (`build-version`) is left out of the checks before `startDatabase` and of
   * `core-chain`'s, and run only after `startDatabase`, that is after the migrations. [A33]
   */
  readonly versionCheckAfterMigrations?: boolean;
  /** More backbone parts, after the stand-ins (some tests add `core-block-commit`, whose table holds the cursor). */
  readonly backbone?: readonly ModuleDeclaration[];
}

/** What a startup that was accepted gives. */
export interface Started {
  /** The check before `startDatabase`. */
  readonly check: HistoryCheck;
  /** The check `core-chain`'s `on-start-db` recorded with. */
  readonly recorded: HistoryCheck;
  readonly graph: ResolvedGraph;
  readonly applied: readonly AppliedMigration[];
}

/** Runs one startup on `db` (see the module comment); rejects with the first refusal. */
export async function startup(db: Database, options: StartupOptions): Promise<Started> {
  const holder: Holder = {};
  const backbone = [coreChain(holder), BLOCK_FETCH, ...(options.backbone ?? [])];
  const declarations = validateDeclarations({ backbone, core: [], user: options.user });
  const config = validateConfig({ config: { file: FILE, data: plainData({ entries: options.entries }) }, declarations, side: "public" });
  const all = options.rules ?? HISTORY_RULES;
  const rules = options.versionCheckAfterMigrations === true ? all.filter((rule) => rule.name !== "build-version") : all;
  const input = { config, cursor: options.cursor, declarations };
  const history = await db.read((read) => readHistory(read));
  const check = checkHistory({ ...input, history }, { rules });
  holder.input = input;
  holder.rules = rules;
  const graph = resolveGraph(graphInputOf(check, declarations));
  const context = processContext();
  const applied = await startDatabase(db, {
    plan: schemaPlan(graph.modules),
    parts: graph.modules.map((declaration) => migrationPart(declaration, context)),
    committedVersions: check.committedVersions,
    handles: { height: options.cursor },
  });
  if (options.versionCheckAfterMigrations === true) {
    const versions = all.filter((rule) => rule.name === "build-version");
    checkHistory({ ...input, history: await db.read((read) => readHistory(read)) }, { rules: versions });
  }
  return { check, recorded: holder.check as HistoryCheck, graph, applied };
}

/**
 * The history's input for `entries` at `cursor`, for a build carrying `user`: what a startup gives `core-chain`, for a
 * test that calls `recordHistory` itself.
 */
export function historyInput(
  entries: readonly unknown[],
  cursor: bigint | null,
  user: readonly ModuleDeclaration[],
): Omit<HistoryInput, "history"> {
  const declarations = validateDeclarations({ backbone: [BLOCK_FETCH], core: [], user });
  const config = validateConfig({ config: { file: FILE, data: plainData({ entries }) }, declarations, side: "public" });
  return { config, cursor, declarations };
}

/** The rows of `core_chain.config`, read as the history reads them (none before the first startup). */
export function historyRows(db: Database): Promise<HistoryRow[]> {
  return db.read((read) => readHistory(read));
}

/** The rows of `core_chain.config` as stored, with each row's `xmin` (the transaction that wrote it), in key order. */
export async function storedRows(db: Database): Promise<Record<string, unknown>[]> {
  return db.read((read) =>
    read.query(
      `SELECT entry_id, start, stop, version, data::text AS data, encode(data_hash, 'hex') AS data_hash, xmin::text AS xmin
         FROM core_chain.config ORDER BY entry_id COLLATE "C", start`,
    ),
  );
}

/** The rows of `core_chain.migrations`, as `module/migration` (none before the first startup created the table). */
export async function migrationRows(db: Database): Promise<string[]> {
  const rows = await db.read(async (read) => {
    const [table] = await read.query("SELECT to_regclass('core_chain.migrations') IS NOT NULL AS present");
    if (table?.present !== true) return [];
    return read.query(
      `SELECT module || '/' || migration_id AS m FROM core_chain.migrations ORDER BY module COLLATE "C", position`,
    );
  });
  return rows.map((row) => row.m as string);
}

/** The `UmbraError`-or-other error `run` rejects with; fails the test when it resolves. */
export async function rejection(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => {
      throw new Error("expected a refusal");
    },
    (error: unknown) => error,
  );
}
