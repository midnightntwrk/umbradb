/**
 * The modules' latest starts (`ModuleDeclaration.latestStarts`) applied to a validated configuration: when a module
 * the configuration enables names, for the configuration's network, a height below the database's start S, the
 * database starts at that height instead, with every entry that starts at S. Pure, and applied by the resolver
 * (`../runner/resolve.ts`) for every caller, so the engine, `umbradb config check`, `backup` and `restore` see the same
 * start.
 *
 * - **Which network.** The `network` setting of the `core` entry that starts at S; a configuration without one (no core
 *   revision of the build's version at S) is left as it is.
 * - **Which height.** The lowest of the enabled modules' heights for that network; a network no enabled module names
 *   leaves the configuration as it is, and so does a height at or above S.
 * - **Which entries move.** Those that start at S, which start with the database; an entry starting above S keeps its
 *   start. Stops are untouched (a stop is at or above its start, so at or above S).
 * - **An existing database.** The start is a function of the configuration alone, so a restart with the same file
 *   resolves to the same start. A database already built from a higher S is refused by the configuration history
 *   (its recorded revisions start at the old S): build a new database.
 */

import { CORE_ENTRY_ID } from "./entries.js";
import type { CheckedConfig, CheckedEntry } from "./validate.js";

/** A module's latest starts, as the resolver reads them. */
export interface LatestStarts {
  readonly id: string;
  readonly latestStarts?: Readonly<Record<string, number>> | undefined;
}

/** What {@link withLatestStarts} changed: the start the file gives, the one the database takes, and why. */
export interface LoweredStart {
  readonly from: number;
  readonly to: number;
  readonly module: string;
  readonly network: string;
}

/** `config` with the enabled modules' latest starts applied, and what changed (null when nothing did). */
export function withLatestStarts(
  config: CheckedConfig,
  declarations: readonly LatestStarts[],
): { readonly config: CheckedConfig; readonly lowered: LoweredStart | null } {
  const core = config.entries.find((entry) => entry.id === CORE_ENTRY_ID && entry.start === config.start && entry.buildVersion);
  const network = core?.settings?.network;
  if (typeof network !== "string") return { config, lowered: null };
  const enabled = new Set(config.entries.map((entry) => entry.id));
  let latest: { height: number; module: string } | null = null;
  for (const declaration of declarations) {
    const height = declaration.latestStarts?.[network];
    if (height === undefined || !enabled.has(declaration.id)) continue;
    if (latest === null || height < latest.height) latest = { height, module: declaration.id };
  }
  if (latest === null || latest.height >= config.start) return { config, lowered: null };
  const to = latest.height;
  const entries = config.entries.map((entry): CheckedEntry => (entry.start === config.start ? Object.freeze({ ...entry, start: to }) : entry));
  return {
    config: Object.freeze({ ...config, start: to, entries: Object.freeze(entries) }),
    lowered: Object.freeze({ from: config.start, to, module: latest.module, network }),
  };
}
