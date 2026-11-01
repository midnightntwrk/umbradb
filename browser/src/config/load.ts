/**
 * The configuration loader in the browser build, in place of `src/config/load.ts`. A page reads no file: it bundles its
 * configuration (`browser/src/config.ts`, or a test's) and hands it to the process as data. Startup requires that data
 * to be plain, as it does a file's export (`plainData`). So `loadConfig` is never called there, and refuses.
 * [CF-1; design §7, §9.2]
 */

import { UmbraError } from "../../../src/db/errors.js";

export const DEFAULT_CONFIG_FILE = "umbradb.config.ts";

export const MODULES_EXPORT = "modules";

/** What `src/config/load.ts`'s loader takes, for the same types. */
export interface LoadOptions {
  readonly file?: string | URL;
  readonly cwd: string;
}

/** What `src/config/load.ts`'s loader gives, for the same types. */
export interface LoadedConfig {
  readonly file: string;
  readonly data: unknown;
  readonly modules: readonly unknown[];
}

/** The refusal of every file the browser build is asked for (see the module comment). */
function noFile(): UmbraError {
  return new UmbraError(
    "invalid-configuration",
    "the browser build reads no configuration file: its configuration is bundled with the page and given as data",
    { reason: "no-file" },
  );
}

/** Refuses: the browser build's configuration is bundled data, never a file (see the module comment). */
export async function loadConfig(_options: LoadOptions): Promise<LoadedConfig> {
  throw noFile();
}

/** Refuses, as {@link loadConfig} does: the browser build imports no module file (`modulesFrom`). */
export async function loadModuleList(_url: URL): Promise<readonly unknown[]> {
  throw noFile();
}

/** Refuses, as {@link loadConfig} does: the browser build names no configuration file. */
export function configPath(_file: string | URL, _cwd: string): string {
  throw noFile();
}

/** Refuses, as {@link loadConfig} does: the browser build names no configuration file. */
export function configModuleUrl(_path: string): URL {
  throw noFile();
}
