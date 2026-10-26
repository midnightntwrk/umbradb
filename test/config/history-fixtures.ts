import { z } from "zod";
import type { CoreVersion } from "../../src/config/build.js";
import { type CoreSettings, coreEntry, versionEntry } from "../../src/config/entries.js";
import {
  checkHistory,
  type HistoryCheck,
  type HistoryOptions,
  type HistoryRow,
} from "../../src/config/history.js";
import { plainData, type PlainObject } from "../../src/config/plain-data.js";
import { type CheckedConfig, validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { type DeclarationSet, validateDeclarations } from "../../src/modules/validation.js";
import { declaration } from "../modules/declarations.js";
import { BACKBONE } from "../modules/graph-fixtures.js";
import { CORE_SETTINGS } from "./config-fixtures.js";

/**
 * Modules, configurations and simulated startups for the tests of the configuration history (task 4.3; CF-5 to CF-9,
 * A28's history half, A30–A34): the history is `checkHistory` over the validated configuration, the cursor, the build's
 * declarations and the rows of `core_chain.config`; a startup records its `writes` and deletes its `deletes` (task
 * 4.3a), so a sequence of startups is simulated here without a database by applying each one's to the rows the next one
 * reads ({@link Simulation}).
 * The database tests run the same sequence through `core_chain.config` (`./history-startup.ts`).
 */

/** The file the configurations name, as `loadConfig` would give it. */
export const FILE = "/srv/umbradb/umbradb.config.ts";

/** The settings of module `m` at every version here: two data fields with defaults, an operational one and a secret. */
const M_SETTINGS = z.object({
  limit: z.number().int().default(10).meta({ kind: "data" }),
  mode: z.enum(["fast", "full"]).default("full").meta({ kind: "data" }),
  pollMs: z.number().int().default(1000).meta({ kind: "operational" }),
  token: z.string().optional().meta({ kind: "secret" }),
});

const M_001 = { id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY)" };
const M_002 = { id: "002", sql: "ALTER TABLE m.rows ADD COLUMN note text" };

/** Module `m` at `version`, with migration 001 unless `rest` gives others. */
export function moduleM(version: string, rest: Partial<ModuleDeclaration> = {}) {
  return defineModule({ ...declaration("m"), version, configSchema: M_SETTINGS, migrations: [M_001], ...rest });
}

/** `m` 1.0.0, the version most tests' builds carry. */
export const M_1_0 = moduleM("1.0.0");
/** `m` 1.1.0, a newer version: its migration 002 only adds a column (DB-10). */
export const M_1_1 = moduleM("1.1.0", { migrations: [M_001, M_002] });
/** `m` 0.9.0, an older version. */
export const M_0_9 = moduleM("0.9.0");

/** Module `n` at `version`: another module, with `m`'s kind of settings. */
export function moduleN(version: string) {
  return defineModule({ ...declaration("n"), version, configSchema: M_SETTINGS });
}

/** `n` 1.0.0. */
export const N = moduleN("1.0.0");

/** A module that cannot start mid-chain (MD-4): its revisions must continue each other (CF-5). */
export const HISTORIC = defineModule({ ...declaration("historic"), startsMidChain: false, configSchema: M_SETTINGS });

/** A development-only module (MD-5, CF-9). */
export const DEVTOOL = defineModule({ ...declaration("devtool"), developmentOnly: true, configSchema: M_SETTINGS });

/** `m` 1.0.0 with the setting `foo`, and 1.1.0 whose schema renames it `bar` (CF-3's scenario "An upgrade that renames"). */
export const M_FOO = defineModule({
  ...declaration("m"),
  version: "1.0.0",
  configSchema: z.object({ foo: z.number().int().meta({ kind: "data" }) }),
  migrations: [M_001],
});
export const M_BAR = defineModule({
  ...declaration("m"),
  version: "1.1.0",
  configSchema: z.object({ bar: z.number().int().meta({ kind: "data" }) }),
  migrations: [M_001, M_002],
});

/**
 * The data fields of a public `core` entry written with {@link CORE_SETTINGS} only: CF-4's defaults applied, the
 * ledger table among them (the network's built-in one, task 12.2).
 */
export const CORE_DATA = {
  network: "preprod",
  ledgerTable: plainData(builtInLedgerTable("preprod")) as PlainObject,
  ledgerSources: { v8: "vendored", v9: "vendored", v10: "vendored" },
  sweep: "on",
  retainStates: 0,
} as const;

/** The `core` entry from 0 every check accepts. */
export const CORE = coreEntry({ start: 0, config: { ...CORE_SETTINGS } });

/** A `core` entry from `start`, with `config` added to the required settings. */
export function core(start: number, config: Record<string, unknown> = {}, stop?: number) {
  const settings = { ...CORE_SETTINGS, ...config } as CoreSettings;
  return coreEntry({ start, ...(stop === undefined ? {} : { stop }), config: settings });
}

/** A `core` revision of another UmbraDB version, written as recorded (`versionEntry`); `config` null for a scheduled one. */
export function oldCore(start: number, umbradb: string, config: PlainObject | null = CORE_DATA) {
  const version: CoreVersion = { umbradb, ledgers: [] };
  return versionEntry({ id: "core", start, version, ...(config === null ? {} : { config }) });
}

/** The build's validated declarations: the test backbone of the graph's tests and `user`. */
export function build(user: readonly ModuleDeclaration[] = [M_1_0]): DeclarationSet<ModuleDeclaration> {
  return validateDeclarations({ backbone: BACKBONE, core: [], user });
}

/** A configuration `{ entries }` validated against `declarations`, as `validateConfig` gives it. */
export function checked(entries: readonly unknown[], declarations: DeclarationSet<ModuleDeclaration>): CheckedConfig {
  return validateConfig({ config: { file: FILE, data: plainData({ entries }) }, declarations, side: "public" });
}

/**
 * The history once `deletes` are deleted and `writes` recorded: each deleted by its `(id, start)`, each write inserted
 * or replacing the row of its `(id, start)`.
 */
export function recordedAfter(
  history: readonly HistoryRow[],
  writes: readonly HistoryRow[],
  deletes: readonly HistoryRow[] = [],
): HistoryRow[] {
  const rows = new Map(history.map((row) => [`${row.id}@${row.start}`, row]));
  for (const row of deletes) rows.delete(`${row.id}@${row.start}`);
  for (const row of writes) rows.set(`${row.id}@${row.start}`, row);
  return [...rows.values()].sort((a, b) =>
    a.id === b.id ? (a.start < b.start ? -1 : a.start > b.start ? 1 : 0) : a.id < b.id ? -1 : 1,
  );
}

/** One startup of a simulated database: its configuration, its build and its cursor. */
export interface Start {
  readonly entries: readonly unknown[];
  readonly user?: readonly ModuleDeclaration[];
  readonly cursor: bigint | null;
  readonly options?: HistoryOptions;
}

/**
 * A database simulated by its history alone: each {@link Simulation.start} checks the configuration against the rows
 * recorded so far and, when it is accepted, deletes its deletes and records its writes, as `core-chain`'s `on-start-db`
 * does.
 */
export class Simulation {
  history: HistoryRow[] = [];

  /** Checks a startup and records its writes; rethrows its refusal, leaving the history as it was. */
  start(start: Start): HistoryCheck {
    const declarations = build(start.user);
    const config = checked(start.entries, declarations);
    const check = checkHistory({ config, cursor: start.cursor, declarations, history: this.history }, start.options);
    this.history = recordedAfter(this.history, check.writes, check.deletes);
    return check;
  }

  /** The refusal of a startup, which must refuse; the history is unchanged. */
  refusal(start: Start): UmbraError {
    const before = this.history;
    try {
      this.start(start);
    } catch (error) {
      if (!(error instanceof UmbraError)) throw error;
      if (this.history !== before) throw new Error("a refused startup changed the history");
      return error;
    }
    throw new Error("expected a refusal");
  }
}

/** The row of `(id, start)` in `history`. */
export function rowAt(history: readonly HistoryRow[], id: string, start: number): HistoryRow | undefined {
  return history.find((row) => row.id === id && row.start === BigInt(start));
}
