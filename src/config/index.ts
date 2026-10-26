/**
 * Configuration (`openspec/changes/core-arch/specs/configuration/spec.md`, `design.md` §1, §7): the build's core version
 * (`./build.ts`), the builders `defineConfig`, `coreEntry`, `versionEntry` and the module `entry` builder, with the
 * configuration's types (`./entries.ts`), the plain-data check (`./plain-data.ts`), the loader (`./load.ts`), the
 * `core` entry's settings schemas (`./core-settings.ts`), the schema validation with its kinds and defaults
 * (`./validate.ts`), the secret redaction (`./redact.ts`), the configuration history with the version check
 * (`./history.ts`; its table is `core-chain`'s, `src/backbone/core-chain/`), the process's `core` revision
 * (`./process.ts`, decision record Q102) and opening the database it names (`./database.ts`). `umbradb config check`
 * (task 4.4) comes next.
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
