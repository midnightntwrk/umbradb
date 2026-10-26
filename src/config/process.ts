/**
 * Which `core` revision's operational settings the process uses
 * (`openspec/changes/core-arch/specs/configuration/spec.md` CF-3, CF-4; `design.md` §7; decision record Q102, resolved
 * A by the owner, 2026-10-25): every revision has its own settings (CF-3), and a callback for height h gets the
 * settings of the revision covering h (CORE-ARCH §4.12) — but most of the `core` entry's fields are operational and
 * describe the process, not a height (`database`, `node`, `listen`, `tls`, the timeouts, `fullPageWritesOffAllowed`,
 * `developmentOptIn`), and the database must be opened with one revision's `database` before the cursor can be read. So
 * the process takes every operational field from one revision for its whole run: the latest `core` revision (by start)
 * whose version is the build's — the one the operator wrote last, known before the database is opened. An earlier
 * revision's operational fields are validated (task 4.2) but not used; its data fields are what the history records for
 * its heights.
 *
 * Pure: the browser build uses it as it is (task 16.x).
 */

import { UmbraError } from "../db/errors.js";
import { buildCoreVersion } from "./build.js";
import { CORE_ENTRY_ID } from "./entries.js";
import type { CheckedConfig, CheckedEntry } from "./validate.js";

/**
 * The `core` revision whose operational settings the process runs with (Q102, resolved A): the latest by start whose
 * version is the build's, with its parsed settings (every default applied, task 4.2). Throws `invalid-configuration`
 * (`details { file, reason: "no-build-core-revision" }`, not retryable) when the configuration has no `core` revision
 * of the build's version — every `core` entry written with `versionEntry` —, since then nothing gives the process a
 * validated `database`, `node` or any other operational field.
 */
export function processCoreEntry(config: CheckedConfig): CheckedEntry {
  const own = config.entries.filter((entry) => entry.id === CORE_ENTRY_ID && entry.buildVersion);
  const latest = own.reduce<CheckedEntry | undefined>(
    (found, entry) => (found === undefined || entry.start > found.start ? entry : found),
    undefined,
  );
  if (latest !== undefined) return latest;
  const where = config.file === null ? "the configuration" : `the configuration ${config.file}`;
  throw new UmbraError(
    "invalid-configuration",
    `${where} has no core revision of this build's version (UmbraDB ${buildCoreVersion().umbradb}): the process ` +
      "takes its operational settings — database, node, listen, the timeouts, developmentOptIn — from the latest " +
      "core revision of the build's version (decision record Q102), and every core entry here is a versionEntry of " +
      "another version; add coreEntry({ start, config }) for this build",
    { file: config.file, reason: "no-build-core-revision" },
  );
}
