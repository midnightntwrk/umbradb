/**
 * What `umbradb backup` and `umbradb restore` read from the configuration file. [BK-1, BK-3; design §9.1, §12]
 *
 * As `umbradb run` does, the command loads the file (`--config`, or `umbradb.config.ts` in the working directory). It
 * makes the command's build with the user modules the file exports (`./build-modules.ts`), for the side the file
 * describes (`inferSide`), and validates the configuration with that build. It then takes the process's `core`
 * revision: its `database` is the database the command works on, and its `developmentOptIn` the opt-in. A refusal of
 * any of this is the configuration's own, with every finding. [CF-1, CF-9, PP-12, Q102, Q106 B]
 *
 * **The database** ({@link openCommandDatabase}). [DB-11, CF-4, Q163]
 * - PostgreSQL is opened through the database API with one read connection, which makes no connection until it is
 *   used.
 * - PGlite is opened only under the development opt-in (`openPglite` refuses without it), from a directory relative to
 *   the working directory, taking its operating-system lock (`writer-lock-held` while a process holds it).
 * - A PGlite database in memory exists only inside its own process, so the commands refuse it
 *   (`invalid-configuration`).
 * - Only a restore's target ({@link openRestoreTarget}) is created when missing, with any missing parent directory;
 *   `umbradb backup` creates nothing.
 */

import { join, resolve } from "node:path";
import { readCursor } from "../backbone/core-block-commit/core-block-commit.js";
import { readPrivateCursor } from "../backbone/core-private-source/core-private-source.js";
import type { ProcessSide } from "../config/core-settings.js";
import { databaseTarget } from "../config/database.js";
import type { DatabaseParts, PglitePathParts } from "../config/database-parts.js";
import { findingText, refusalFindings } from "../config/findings.js";
import { DEFAULT_CONFIG_FILE, type LoadedConfig, loadConfig } from "../config/load.js";
import type { PlainObject } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import { type Redactor, redactor } from "../config/redact.js";
import { type CheckedConfig, type CheckedEntry, configSecrets, validateConfig } from "../config/validate.js";
import type { CommittedHeight, Database } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { openPglite } from "../db/pglite.js";
import { createdDirectoryLine, createPgliteDirectory } from "../db/pglite-lock.js";
import { openPostgres, type PostgresConnection } from "../db/postgres.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { isPrivateDatabase } from "../backup/facts.js";
import { buildDeclarations } from "./build-modules.js";
import { inferSide } from "./config-check.js";
import { isRegularFile } from "./type-check.js";

/** The configuration a backup or restore command runs with. */
export interface CommandConfig {
  /** The file, absolute. */
  readonly file: string;
  readonly checked: CheckedConfig;
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  readonly side: ProcessSide;
  /** The process's `core` revision. [Q102] */
  readonly core: CheckedEntry;
  /** Its `database` setting's parts. */
  readonly database: DatabaseParts;
  readonly developmentOptIn: boolean;
  /** Hides the file's secrets — the database's password among them — and any URL's credentials. */
  readonly redact: Redactor;
}

/** A refusal of the configuration file itself, with its findings in its message, each with its path. */
function configurationRefused(error: unknown, file: string): UmbraError {
  const findings = refusalFindings(error, file);
  const code = (error as UmbraError).code;
  return new UmbraError(
    code,
    `the configuration ${file} was refused (${findings.length} finding${findings.length === 1 ? "" : "s"}): ` +
      findings.map(findingText).join("; "),
    (error as UmbraError).details,
    { cause: error },
  );
}

/** Reads the configuration (see the module comment); rejects with its refusal, the redaction of its secrets with it. */
export async function readCommandConfig(
  options: { readonly file?: string | undefined; readonly cwd: string },
): Promise<CommandConfig> {
  const file = resolve(options.cwd, options.file ?? DEFAULT_CONFIG_FILE);
  let loaded: LoadedConfig;
  try {
    loaded = await loadConfig({ file, cwd: options.cwd });
  } catch (error) {
    throw configurationRefused(error, file);
  }
  const side = inferSide(loaded.data);
  const declarations = buildDeclarations(loaded.modules, { side });
  const input = { config: loaded, declarations, side };
  const redact = redactor(configSecrets(input));
  let checked: CheckedConfig;
  let core: CheckedEntry;
  try {
    checked = validateConfig(input);
    core = processCoreEntry(checked);
  } catch (error) {
    throw configurationRefused(error, loaded.file);
  }
  const settings = core.settings as PlainObject;
  return Object.freeze({
    file: loaded.file,
    checked,
    declarations,
    side,
    core,
    database: settings.database as unknown as DatabaseParts,
    developmentOptIn: settings.developmentOptIn === true,
    redact,
  });
}

/** The committed height of a public or a private process's database: its cursor's. [DB-2] */
export const commandCommittedHeight: CommittedHeight = async (read) => {
  const cursor = (await isPrivateDatabase(read)) ? await readPrivateCursor(read) : await readCursor(read);
  return cursor?.height ?? null;
};

/** The file whose presence tells that a PGlite directory holds a database (PGlite's own test before its `initdb`). */
export const PGLITE_DATABASE_MARK = "PG_VERSION";

/** Where a command's database is, and whether a PGlite directory holds a database yet. */
export type CommandTarget =
  | { readonly backend: "postgres"; readonly connection: PostgresConnection }
  | { readonly backend: "pglite"; readonly dataDir: string; readonly exists: boolean };

/** Where the database of `config` is (see the module comment); a PGlite database in memory refused. */
export function commandTarget(config: CommandConfig, cwd: string): CommandTarget {
  const target = databaseTarget(config.database);
  if (target.backend === "postgres") return target;
  if (target.dataDir === "memory://") {
    throw new UmbraError(
      "invalid-configuration",
      "the configuration's database is PGlite in memory, a database that exists only inside the process holding it: back " +
        "it up through that process (its backup), or configure a PGlite directory or a PostgreSQL database",
      { reason: "memory-database" },
    );
  }
  const dataDir = resolve(cwd, target.dataDir);
  return { backend: "pglite", dataDir, exists: isRegularFile(join(dataDir, PGLITE_DATABASE_MARK)) };
}

/** Opens the database of `target` (see the module comment), with `committedHeight` ({@link commandCommittedHeight}). */
export async function openCommandDatabase(
  target: CommandTarget,
  config: CommandConfig,
  committedHeight: CommittedHeight = commandCommittedHeight,
): Promise<Database> {
  if (target.backend === "postgres") {
    return openPostgres({ connection: target.connection, committedHeight, readConnections: 1 });
  }
  return openPglite({ dataDir: target.dataDir, committedHeight, developmentOptIn: config.developmentOptIn });
}

/**
 * Opens the target of `umbradb restore` as {@link openCommandDatabase} does. Under the opt-in, a PGlite directory that
 * does not exist is created first, with its missing parents, and `log` is told, naming the path as configured.
 * [CF-4, Q163, Q165 B, Q167 A]
 *
 * The restore opens a target with no database only once its checks before loading have passed, so a refused restore
 * creates nothing. [BK-3]
 */
export async function openRestoreTarget(
  target: CommandTarget,
  config: CommandConfig,
  log: (line: string) => void = () => undefined,
): Promise<Database> {
  if (target.backend === "pglite" && config.developmentOptIn) {
    const created = createPgliteDirectory(target.dataDir);
    if (created !== null) log(createdDirectoryLine((config.database as PglitePathParts).path, created));
  }
  return openCommandDatabase(target, config);
}

/** The tables the build declares `deterministic: false`: every module of `declarations`, each table once. [MD-1, Q76] */
export function declaredOptOuts(declarations: DeclarationSet<ModuleDeclaration>): { schema: string; table: string }[] {
  const out = new Map<string, { schema: string; table: string }>();
  for (const declaration of [...declarations.backbone, ...declarations.core, ...declarations.user]) {
    for (const item of declaration.provides) {
      if (item.table?.deterministic !== false) continue;
      for (const table of item.table.tables) out.set(JSON.stringify([item.table.schema, table]), { schema: item.table.schema, table });
    }
  }
  return [...out.values()];
}
