/**
 * The configuration loader (`openspec/changes/core-arch/specs/configuration/spec.md` CF-1, `design.md` §7; CORE-ARCH
 * §4.12): a process loads one TypeScript file at startup — `umbradb.config.ts` in the working directory, or the path
 * given with `--config` (task 4.4) — by importing it, on Node.js ≥ 24 through Node.js's built-in type stripping, so the
 * file holds erasable TypeScript only (no `enum`, `namespace` or parameter property); and takes its default export,
 * built with `defineConfig({ entries: [ … ] })` (`./entries.ts`), checked to be plain data (`./plain-data.ts`). It
 * returns that data as a deeply frozen copy: what startup validates (`./validate.ts`), compares with the history and records
 * (task 4.3), and shows, is the evaluated data, never the source text or the module's live export.
 *
 * A `.ts` file is an ES module when the nearest `package.json` says `"type": "module"`, or when Node.js detects ES
 * module syntax in it, as for a `.js` file (a `.mts` file always is). The file may import module packages and read
 * environment variables (for secrets); it is code, as trusted as the build (decision record Q44).
 *
 * Every failure refuses startup with an `UmbraError` (not retryable) that names the file: `invalid-configuration` with
 * `details.reason` — `file-not-found` (no file at the path), `load-failed` (importing or evaluating it threw; the error
 * is the cause, its `code` in `details.errorCode`), `no-default-export` — or `not-plain-data` with the path inside the
 * configuration. The runner (task 5.x) maps both to its refused state; `umbradb config check` (task 4.4) prints them.
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

/** A loaded configuration: the file's absolute path and its evaluated data, deeply frozen. */
export interface LoadedConfig {
  readonly file: string;
  readonly data: PlainData;
}

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
  return Object.freeze({ file, data: plainData(module.default, file) });
}
