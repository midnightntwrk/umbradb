/**
 * What a browser build's configuration module gives (`openspec/changes/core-arch/specs/browser/spec.md` BR-1, BR-2;
 * `specs/configuration/spec.md` CF-1; `design.md` §9.2; task 16.1). The page bundles its configuration — as
 * `umbradb run` takes the configuration file, and the file's `modules` export as its user modules (Q106 B) — but some
 * of it is known only when the page runs: the node it was pointed at, where its database lives, and S. So the module's
 * default export makes each process's configuration data from the run ({@link BrowserRun}), together with the user
 * modules its build carries; the process worker hands the data to the runner, which holds it to CF-1's plain data and
 * validates it as it would a file.
 */

/** What the page knows when it starts a process (see the module comment). */
export interface BrowserRun {
  /** The node's WebSocket URL: the page's `node` parameter. */
  readonly node: string;
  /** Where the database lives: `memory`, or a name in the origin's private file system (OPFS). */
  readonly storage: string;
  /**
   * S: the node's finalized head when this database was created (BR-2), kept by the page for an OPFS database, or the
   * restored backup's (BK-4).
   */
  readonly start: number;
  /** Every parameter of the page's address, as text (a configuration may read its own). */
  readonly params: Readonly<Record<string, string>>;
}

/** One process's configuration: its data (`{ entries }`, as a file's default export) and its user modules. */
export interface ProcessConfiguration {
  readonly data: unknown;
  readonly modules: readonly unknown[];
}

/** A private instance: its id (`instanceId`) and its configuration. */
export interface PrivateInstance {
  readonly id: string;
  configure(run: BrowserRun): ProcessConfiguration;
}

/** A configuration module's default export (see the module comment). */
export interface BrowserConfiguration {
  /** The core (public) process's. */
  core(run: BrowserRun): ProcessConfiguration;
  /** The private instances of `run`, each run in a worker of its own beside the core (BR-1); none unless given. */
  instances?(run: BrowserRun): readonly PrivateInstance[];
}

/** The `database` setting of `storage` for the process `name` (`core`, or an instance's id): memory or an OPFS name. */
export function databaseOf(storage: string, name: string): string {
  return storage === "memory" ? "pglite:memory" : `pglite:${storage}${name === "core" ? "" : `-${name}`}`;
}

/** `data` with the development opt-in set on every `core` entry (BR-1: the browser build always sets it). */
export function withDevelopmentOptIn(data: unknown): unknown {
  if (data === null || typeof data !== "object" || !Array.isArray((data as { entries?: unknown }).entries)) return data;
  const entries = (data as { entries: unknown[] }).entries.map((entry) => {
    if (entry === null || typeof entry !== "object" || (entry as { id?: unknown }).id !== "core") return entry;
    const config = (entry as { config?: unknown }).config;
    const settings = config !== null && typeof config === "object" ? config : {};
    return { ...entry, config: { ...settings, developmentOptIn: true } };
  });
  return { ...data, entries };
}
