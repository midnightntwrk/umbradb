/**
 * Configuration (`openspec/changes/core-arch/specs/configuration/spec.md`, `design.md` §1, §7): the build's core version
 * (`./build.ts`), the builders `defineConfig`, `coreEntry`, `versionEntry` and the module `entry` builder, with the
 * configuration's types (`./entries.ts`), the plain-data check (`./plain-data.ts`), the loader (`./load.ts`), the
 * `core` entry's settings schemas (`./core-settings.ts`), the schema validation with its kinds and defaults
 * (`./validate.ts`) and the secret redaction (`./redact.ts`). The configuration history and the version check (task
 * 4.3) and `umbradb config check` (task 4.4) come next.
 */

export * from "./build.js";
export * from "./core-settings.js";
export * from "./entries.js";
export * from "./load.js";
export * from "./plain-data.js";
export * from "./redact.js";
export * from "./validate.js";
