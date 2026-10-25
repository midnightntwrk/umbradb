import { z } from "zod";
import { coreEntry } from "../../src/config/entries.js";
import { plainData } from "../../src/config/plain-data.js";
import type { ConfigInput } from "../../src/config/validate.js";
import type { ProcessSide } from "../../src/config/core-settings.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration } from "../modules/declarations.js";
import { CORE_SETTINGS, prices, stats } from "./config-fixtures.js";

/**
 * Modules, declarations and inputs for the tests of the schema validation (task 4.2; CF-3, CF-4): the validation takes
 * the loaded configuration's plain data, the build's validated declarations (`validateDeclarations`, as the runner
 * calls it first) and the process's side; the cursor comes later (`entriesAtCursor`), once the database is open.
 */

/** The file the inputs name, as `loadConfig` would give it. */
export const FILE = "/srv/umbradb/umbradb.config.ts";

/** Module `m` 1.1.0, whose schema has `bar` where 1.0.0 had `foo` (CF-3's scenario "An upgrade that renames a setting"). */
export const renamed = defineModule({
  ...declaration("m"),
  version: "1.1.0",
  configSchema: z.object({ bar: z.number().int().meta({ kind: "data" }) }),
});

/** A module whose schema turns a number into a bigint: its output is not plain data (CF-1, CF-7). */
export const bigints = defineModule({
  ...declaration("bigints"),
  configSchema: z.object({ big: z.coerce.bigint().meta({ kind: "data" }) }),
});

/** A module whose schema throws while parsing, with the setting's value in its error's message. */
export const thrower = defineModule({
  ...declaration("thrower"),
  configSchema: z.object({
    apiKey: z
      .string()
      .refine((value) => {
        throw new Error(`cannot check ${value}`);
      })
      .meta({ kind: "secret" }),
  }),
});

/** A module whose secret's custom message repeats the value it refuses, as a careless schema may. */
export const leaky = defineModule({
  ...declaration("leaky"),
  configSchema: z.object({
    apiKey: z
      .string()
      .refine((value) => value.startsWith("key-"), { error: (issue) => `the key ${String(issue.input)} is not a key` })
      .meta({ kind: "secret" }),
    feedUrl: z.string().meta({ kind: "operational" }),
  }),
});

/** A module whose schema throws a string, not an `Error`. */
export const throwsText = defineModule({
  ...declaration("throws-text"),
  configSchema: z.object({
    mode: z
      .string()
      .refine(() => {
        throw "no mode is valid";
      })
      .meta({ kind: "operational" }),
  }),
});

/** A module whose schema checks two settings together: an issue of the whole settings, without a path. */
export const pair = defineModule({
  ...declaration("pair"),
  configSchema: z
    .object({ min: z.number().int().meta({ kind: "data" }), max: z.number().int().meta({ kind: "data" }) })
    .refine((settings) => settings.min <= settings.max, { error: "min is above max" }),
});

/** The user modules of the build the tests validate against, unless a test gives others. */
export const MODULES: readonly ModuleDeclaration[] = [stats, prices, renamed, bigints, thrower, leaky, throwsText, pair];

/** The backbone parts a build declares (only their ids matter here). */
export const BACKBONE: readonly ModuleDeclaration[] = [
  declaration("core-chain", { requires: [] }),
  declaration("core-block-fetch", { requires: [] }),
];

/** The validated declarations, as the runner gets them from `validateDeclarations`. */
export function declarations(user: readonly ModuleDeclaration[] = MODULES) {
  return validateDeclarations({ backbone: BACKBONE, core: [], user });
}

/** The validation's input for a configuration written as a file default-exports it (checked to be plain data). */
export function input(config: unknown, side: ProcessSide = "public", user?: readonly ModuleDeclaration[]): ConfigInput {
  return { config: { file: FILE, data: plainData(config) }, declarations: declarations(user), side };
}

/** The public `core` entry every check accepts. */
export const CORE = coreEntry({ start: 0, config: { ...CORE_SETTINGS } });

/** A private process's `core` settings with the required fields only. */
export const PRIVATE_SETTINGS = {
  network: "preprod",
  database: "pglite:memory",
  instanceId: "wallet-1",
} as const;

/** `stats`'s revision from 0 every check accepts. */
export const STATS = stats.entry({ start: 0, config: { pollMs: 1000 } });
