/**
 * What a browser process worker reads its process through once startup has completed (`browser/src/process-worker.ts`):
 * the database the process opened and handed its module API (`./api.ts`), the tables its schema plan declares
 * `deterministic: false` (for the contents hash), and its module API when `listen.api` is set. One process runs per
 * worker, so there is at most one; it is gone once the process stops. [DT-3]
 */

import type { ModuleApi, ModuleApiOptions } from "../../../src/runner/module-api.js";
import type { ModuleTableOptions } from "../../../src/determinism/module-tables.js";

/** A process whose startup completed. */
export interface OpenedProcess {
  readonly db: ModuleApiOptions["db"];
  readonly optedOut: NonNullable<ModuleTableOptions["optedOut"]>;
  readonly api: ModuleApi | null;
}

let current: OpenedProcess | null = null;

/** The process `process` completed its startup; the returned function forgets it (its stop). */
export function opened(process: OpenedProcess): () => void {
  current = process;
  return () => {
    if (current === process) current = null;
  };
}

/** The process whose startup completed and that has not stopped, or null. */
export function openedProcess(): OpenedProcess | null {
  return current;
}
