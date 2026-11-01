/**
 * The configuration loader. At startup, a process loads one TypeScript file: `umbradb.config.ts` in the working
 * directory, or the path given with `--config`. It imports the file, on Node.js 24 or later through Node.js's built-in
 * type stripping, so the file holds erasable TypeScript only (no `enum`, `namespace` or parameter property). It takes
 * the default export, built with `defineConfig({ entries: [ … ] })` (`./entries.ts`), and checks it is plain data
 * (`./plain-data.ts`). It returns that data as a deeply frozen copy: what startup validates (`./validate.ts`), compares
 * with the history, records and shows is the evaluated data, never the source text or the module's live export.
 * [CF-1; CORE-ARCH §4.12; design §7]
 *
 * **The file's user modules.** The file may also export `modules`, the declarations of the host's user modules it
 * imports (`export const modules = [stats]`). They are code, not data, since a declaration holds its callbacks. So they
 * are returned as {@link LoadedConfig.modules} as the file gives them, in its order: a frozen list of the same
 * declarations, none copied or checked here. The runner and `umbradb config check` validate them as user modules, and
 * name a fault by its position in the list. [CF-1, MD-2, Q106 B]
 *
 * The `umbradb` command takes them as its build's user modules (`src/cli/build-modules.ts`): the file is then the host
 * program, and no module is loaded by name. Without the export the list is empty; an export that is not a list refuses
 * startup (`modules-not-a-list`). The engine (`src/runner/process.ts`) loads a `{ file }` configuration with this
 * loader and takes these as the build's user modules unless it is given a list. [MD-1, LM-7, Q106 B]
 *
 * A `.ts` file is an ES module when the nearest `package.json` says `"type": "module"`, or when Node.js detects ES
 * module syntax in it, as for a `.js` file (a `.mts` file always is). The file may import module packages and read
 * environment variables (for secrets); it is code, as trusted as the build. [Q44]
 *
 * Every failure refuses startup with an `UmbraError` (not retryable) that names the file. It is either
 * `invalid-configuration`, with one of these `details.reason`s:
 * - `file-not-found`: no file at the path;
 * - `load-failed`: importing or evaluating it threw (the error is the cause, and its `code` is in `details.errorCode`),
 *   or the file was named by a URL that is no `file:` URL;
 * - `no-default-export`;
 * - `modules-not-a-list`: a `modules` export that is not an array;
 *
 * or `not-plain-data`, with the path inside the configuration. The runner maps both to its refused state, and
 * `umbradb config check` prints them. The browser build bundles its configuration into the page and calls `plainData`
 * on it instead. [CF-1]
 */

import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { UmbraError } from "../db/errors.js";
import { type PlainData, plainData } from "./plain-data.js";

/** The file a process loads when none is given, in its working directory. [CF-1] */
export const DEFAULT_CONFIG_FILE = "umbradb.config.ts";

/** Where the configuration file is. */
export interface LoadOptions {
  /**
   * The file (`--config`): a path, absolute or relative to `cwd`, or a file URL; {@link DEFAULT_CONFIG_FILE} when
   * absent.
   */
  readonly file?: string | URL;
  /**
   * The working directory a relative `file` resolves against: always given, so that the loader never reads the host
   * program's own (a library host's `cwd`, the command's working directory). [LM-2, CF-1]
   */
  readonly cwd: string;
}

/** A loaded configuration: the file's absolute path, its evaluated data, deeply frozen, and its user modules. */
export interface LoadedConfig {
  readonly file: string;
  readonly data: PlainData;
  /**
   * The file's `modules` export: its user modules' declarations as it gives them, in its order, not validated here;
   * empty without the export. [CF-1, Q106 B]
   */
  readonly modules: readonly unknown[];
}

/** The name of the configuration file's export of its user modules. [CF-1, Q106 B] */
export const MODULES_EXPORT = "modules";

/** Node.js's codes for TypeScript that type stripping cannot erase, or cannot read. */
const TYPESCRIPT_SYNTAX = ["ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX", "ERR_INVALID_TYPESCRIPT_SYNTAX"];

/** `invalid-configuration` for the file, with its reason. */
function invalid(file: string, reason: string, message: string, extra: Record<string, unknown> = {}, cause?: unknown) {
  return new UmbraError(
    "invalid-configuration",
    message,
    { file, reason, ...extra },
    cause === undefined ? undefined : { cause },
  );
}

/** True when a regular file is at `file`. */
async function isFile(file: string): Promise<boolean> {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

/**
 * The absolute path of the configuration file `file`: a file URL converted (`fileURLToPath`), a path resolved against
 * `cwd`. Throws `invalid-configuration` (`load-failed`, naming the URL) for a URL that is no `file:` URL. [CF-1, LM-2]
 */
export function configPath(file: string | URL, cwd: string): string {
  if (!(file instanceof URL)) return resolve(cwd, file);
  if (file.protocol !== "file:") {
    throw invalid(
      file.href,
      "load-failed",
      `the configuration file ${file.href} could not be loaded: a configuration file is a path or a file: URL`,
      { errorCode: null },
    );
  }
  return fileURLToPath(file);
}

/**
 * The URL that names the configuration file at `path` (absolute) as a module: the one the loader imports, and the one
 * the ledger worker imports for the file's user modules, so both threads import the same module. [MD-1, LG-17]
 */
export function configModuleUrl(path: string): URL {
  return pathToFileURL(path);
}

/** Loads the configuration file: see the module comment. [CF-1] */
export async function loadConfig(options: LoadOptions): Promise<LoadedConfig> {
  const imported = await importConfig(options);
  return Object.freeze({ file: imported.file, data: imported.data, modules: configModules(imported) });
}

/**
 * A configuration file imported: its absolute path, its evaluated data (deeply frozen) and its module's exports, the
 * `modules` export not checked yet ({@link configModules}). [CF-1]
 */
export interface ImportedConfig {
  readonly file: string;
  readonly data: PlainData;
  readonly exports: Readonly<Record<string, unknown>>;
}

/**
 * {@link loadConfig} up to the file's data, its `modules` export not checked yet: so that a caller knows the data, and
 * so its secrets, before anything it shows of that check. [CF-1, CF-4]
 */
export async function importConfig(options: LoadOptions): Promise<ImportedConfig> {
  const file = configPath(options.file ?? DEFAULT_CONFIG_FILE, options.cwd);
  if (!(await isFile(file))) {
    throw invalid(
      file,
      "file-not-found",
      `no configuration file at ${file}: a process loads ${DEFAULT_CONFIG_FILE} from its working directory, or the ` +
        "file given with --config",
    );
  }
  let module: Record<string, unknown>;
  try {
    module = (await import(configModuleUrl(file).href)) as Record<string, unknown>;
  } catch (error) {
    const errorCode = (error as { code?: unknown } | null)?.code;
    const syntax = TYPESCRIPT_SYNTAX.includes(errorCode as string)
      ? "; Node.js loads the file with its type stripping, which takes erasable TypeScript only — no enum, namespace " +
        "or parameter property"
      : "";
    throw invalid(
      file,
      "load-failed",
      `the configuration file ${file} could not be loaded: ${(error as Error | null)?.message ?? String(error)}` +
        syntax,
      { errorCode: typeof errorCode === "string" ? errorCode : null },
      error,
    );
  }
  if (!("default" in module)) {
    throw invalid(
      file,
      "no-default-export",
      `the configuration file ${file} has no default export: it exports its configuration as ` +
        "export default defineConfig({ entries: [ … ] })",
    );
  }
  const data = plainData(module.default, file);
  return Object.freeze({ file, data, exports: module });
}

/** The user modules of an imported configuration file: its `modules` export, a list, or none (see the module comment). */
export function configModules(imported: ImportedConfig): readonly unknown[] {
  return modulesOf(imported.exports, imported.file);
}

/**
 * The user modules a module URL lists (`startUmbraDB`'s `modulesFrom`): its `modules` export, as a configuration file's,
 * imported by the URL the ledger worker imports too, so both threads hold the same modules. Unlike a configuration
 * file's, the export is required. Refuses with `invalid-configuration` naming the URL (`details.file`): `load-failed`
 * when importing it threw (the error its cause, its `code` in `details.errorCode`), `modules-not-a-list` when its
 * `modules` export is missing or not an array. [LM-7, MD-1, L63]
 */
export async function loadModuleList(url: URL): Promise<readonly unknown[]> {
  let module: Record<string, unknown>;
  try {
    module = (await import(url.href)) as Record<string, unknown>;
  } catch (error) {
    const errorCode = (error as { code?: unknown } | null)?.code;
    throw invalid(
      url.href,
      "load-failed",
      `the module file ${url.href} (modulesFrom) could not be loaded: ` +
        `${(error as Error | null)?.message ?? String(error)}`,
      { errorCode: typeof errorCode === "string" ? errorCode : null },
      error,
    );
  }
  if (!(MODULES_EXPORT in module)) {
    throw invalid(
      url.href,
      "modules-not-a-list",
      `the module file ${url.href} (modulesFrom) has no modules export: it lists the user modules it imports, as ` +
        "export const modules = [stats]",
      { found: "none" },
    );
  }
  return modulesOf(module, url.href, "the module file (modulesFrom)");
}

/** The file's user modules (see the module comment): its `modules` export, a list, or none; `what` names the file. */
function modulesOf(module: Readonly<Record<string, unknown>>, file: string, what = "the configuration file"): readonly unknown[] {
  if (!(MODULES_EXPORT in module)) return Object.freeze([]);
  const modules = module[MODULES_EXPORT];
  if (!Array.isArray(modules)) {
    const found = modules === null ? "null" : typeof modules === "object" ? "an object" : typeof modules;
    throw invalid(
      file,
      "modules-not-a-list",
      `${what} ${file} exports modules as ${found}: its modules export is the list of the user modules it imports, as ` +
        "export const modules = [stats]",
      { found },
    );
  }
  return Object.freeze([...modules]);
}
