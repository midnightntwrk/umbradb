/**
 * The configuration loader (`openspec/changes/core-arch/specs/configuration/spec.md` CF-1, `design.md` §7; CORE-ARCH
 * §4.12): a process loads one TypeScript file at startup — `umbradb.config.ts` in the working directory, or the path
 * given with `--config` (task 4.4) — by importing it, on Node.js ≥ 24 through Node.js's built-in type stripping, so the
 * file holds erasable TypeScript only (no `enum`, `namespace` or parameter property); and takes its default export,
 * built with `defineConfig({ entries: [ … ] })` (`./entries.ts`), checked to be plain data (`./plain-data.ts`). It
 * returns that data as a deeply frozen copy: what startup validates (`./validate.ts`), compares with the history and records
 * (task 4.3), and shows, is the evaluated data, never the source text or the module's live export.
 *
 * **The file's user modules** (CF-1, owner decision Q106 B, task 4.4a): the file may also export `modules`, the
 * declarations of the host's user modules it imports (`export const modules = [stats]`). They are code, not data — a
 * declaration holds its callbacks —, so they are returned as the file gives them, in its order, as
 * {@link LoadedConfig.modules} (a frozen list of the same declarations, none copied or checked here: the runner and
 * `umbradb config check` validate them as user modules, MD-2, which names a fault by its position in the list). The
 * `umbradb` command takes them as its build's user modules (`src/cli/build-modules.ts`): the file is then MD-1's host
 * program, and no module is loaded by name. Without the export the list is empty; an export that is not a list refuses
 * startup (`modules-not-a-list`). A program that calls `startProcess` itself gives its own declarations and may pass
 * these.
 *
 * A `.ts` file is an ES module when the nearest `package.json` says `"type": "module"`, or when Node.js detects ES
 * module syntax in it, as for a `.js` file (a `.mts` file always is). The file may import module packages and read
 * environment variables (for secrets); it is code, as trusted as the build (decision record Q44).
 *
 * Every failure refuses startup with an `UmbraError` (not retryable) that names the file: `invalid-configuration` with
 * `details.reason` — `file-not-found` (no file at the path), `load-failed` (importing or evaluating it threw; the error
 * is the cause, its `code` in `details.errorCode`), `no-default-export`, `modules-not-a-list` (a `modules` export that is
 * not an array) — or `not-plain-data` with the path inside the configuration. The runner (task 5.x) maps both to its refused state; `umbradb config check` (task 4.4) prints them.
 * The browser build bundles its configuration into the page and calls `plainData` on it instead (task 16.1).
 */

import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { UmbraError } from "../db/errors.js";
import { type PlainData, plainData } from "./plain-data.js";

/** The file a process loads when none is given, in its working directory (CF-1). */
export const DEFAULT_CONFIG_FILE = "umbradb.config.ts";

/** Where the configuration file is. */
export interface LoadOptions {
  /** The file, absolute or relative to `cwd`; {@link DEFAULT_CONFIG_FILE} when absent (`--config`, task 4.4). */
  readonly file?: string;
  /** The working directory; `process.cwd()` when absent. */
  readonly cwd?: string;
}

/** A loaded configuration: the file's absolute path, its evaluated data, deeply frozen, and its user modules. */
export interface LoadedConfig {
  readonly file: string;
  readonly data: PlainData;
  /**
   * The file's `modules` export (CF-1, Q106): its user modules' declarations as it gives them, in its order, not
   * validated here; empty without the export.
   */
  readonly modules: readonly unknown[];
}

/** The name of the configuration file's export of its user modules (CF-1, Q106). */
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

/** Loads the configuration file (CF-1): see the module comment. */
export async function loadConfig(options: LoadOptions = {}): Promise<LoadedConfig> {
  const file = resolve(options.cwd ?? process.cwd(), options.file ?? DEFAULT_CONFIG_FILE);
  if (!(await isFile(file))) {
    throw invalid(
      file,
      "file-not-found",
      `no configuration file at ${file}: a process loads ${DEFAULT_CONFIG_FILE} from its working directory, or the ` +
        "file given with --config (CF-1)",
    );
  }
  let module: Record<string, unknown>;
  try {
    module = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
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
        `${syntax} (CF-1)`,
      { errorCode: typeof errorCode === "string" ? errorCode : null },
      error,
    );
  }
  if (!("default" in module)) {
    throw invalid(
      file,
      "no-default-export",
      `the configuration file ${file} has no default export: it exports its configuration as ` +
        "export default defineConfig({ entries: [ … ] }) (CF-1)",
    );
  }
  const data = plainData(module.default, file);
  return Object.freeze({ file, data, modules: modulesOf(module, file) });
}

/** The file's user modules (see the module comment): its `modules` export, a list, or none. */
function modulesOf(module: Record<string, unknown>, file: string): readonly unknown[] {
  if (!(MODULES_EXPORT in module)) return Object.freeze([]);
  const modules = module[MODULES_EXPORT];
  if (!Array.isArray(modules)) {
    const found = modules === null ? "null" : typeof modules === "object" ? "an object" : typeof modules;
    throw invalid(
      file,
      "modules-not-a-list",
      `the configuration file ${file} exports modules as ${found}: its modules export is the list of the user modules ` +
        "it imports, as export const modules = [stats] (CF-1)",
      { found },
    );
  }
  return Object.freeze([...modules]);
}
