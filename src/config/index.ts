/**
 * Configuration:
 * - the build's core version (`./build.ts`);
 * - the builders `defineConfig`, `coreEntry`, `versionEntry` and the module `entry` builder, with the configuration's
 *   types (`./entries.ts`);
 * - the plain-data check (`./plain-data.ts`);
 * - the loader (`./load.ts`);
 * - the `core` entry's settings schemas (`./core-settings.ts`);
 * - the schema validation, with its kinds and defaults (`./validate.ts`);
 * - the secret redaction (`./redact.ts`);
 * - the configuration history with the version check (`./history.ts`; its table belongs to `core-chain`,
 *   `src/backbone/core-chain/`);
 * - the process's `core` revision (`./process.ts`) [Q102];
 * - opening the database it names (`./database.ts`).
 *
 * `umbradb config check` builds on these. [design §1, §7]
 */

export * from "./build.js";
export * from "./core-settings.js";
export * from "./database.js";
export * from "./entries.js";
export * from "./history.js";
export * from "./load.js";
export * from "./plain-data.js";
export * from "./process.js";
export * from "./redact.js";
export * from "./validate.js";
