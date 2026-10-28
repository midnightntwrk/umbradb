/**
 * The runner's side of the admin endpoints (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1–AE-3,
 * AE-6; `design.md` §1; CORE-ARCH §4.18): what a process (`../runner/process.ts`, `startProcess` with `admin`) runs on
 * its main thread for them — the heartbeat, the publication of `status()`, and the admin listener's life.
 *
 * - **From `startProcess` on:** the heartbeat ticks every second (`../runner/heartbeat.ts`), and each tick publishes the
 *   snapshot of `status()` (`./snapshot.ts`) when it changed; so does every step the runner tells — startup's end,
 *   processing's end, the stop's start ({@link ProcessAdmin.follow}, {@link ProcessAdmin.publish}).
 * - **The listener** starts as soon as the configuration gives its address: {@link ProcessAdmin.serve}, once the
 *   process's `core` revision is known (Q102) and before the database opens, on its `listen.admin` (CF-4's default
 *   `0.0.0.0:8081`), its liveness timeout, its readiness lag and its redaction; a listener that cannot listen refuses
 *   startup (Node.js's error, the runner's `listen-failed`, Q115). Never before: a startup refused before that — by
 *   the configuration itself, which gives no validated address — ends the process with no listener, the refusal in its
 *   log only (owner decision Q137 B, task 8.1b; Q127's address before the validation went with it).
 * - **What `/status` shows besides `status()`** (AE-5): the process's side and `instanceId`, its revision's `tipCap`,
 *   its private side as the process gives it at each snapshot ({@link ProcessAdminOptions.privateSide}: the core's
 *   private instances, a private process's lockstep flag; task 14.4), the core's node as the process reports it at each
 *   snapshot ({@link ProcessAdminOptions.node}: the best head announced last, the connection's state, the queue's
 *   depth; task 8.3a), the wall-clock time of the last commit ({@link ProcessAdmin.committed}, which the loop's commit
 *   observer calls), and, once startup has resolved the graph and migrated the database ({@link ProcessAdmin.opened}),
 *   every part of the database with its revisions and its tables' rows of `core_digest.tables` (DT-5), which it reads
 *   from the process's database on the main thread — at most one read at a time, at a publication after a commit — so
 *   the worker still reads none.
 * - **At `stop()`**, after the database closed, or when a refusal of the configuration ended the process:
 *   {@link ProcessAdmin.close} ends the heartbeat and the listener's thread. Nothing of it is left to keep Node.js
 *   alive.
 */

import type { ProcessSide } from "../config/core-settings.js";
import { configRedactor, type Redactor } from "../config/redact.js";
import type { CheckedConfig, CheckedEntry } from "../config/validate.js";
import type { Database, ReadHandle } from "../db/api.js";
import type { ModuleDeclaration, Revision } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { Heartbeat } from "../runner/heartbeat.js";
import type { ProcessStatus } from "../runner/process.js";
import { readIdentity } from "../backbone/core-chain/core-chain.js";
import type { HistoryCheck, HistoryRow } from "../config/history.js";
import { type ConfigFacts, configOf, type OpenedConfig, UNVALIDATED_CONFIG } from "./configuration.js";
import { earlyRedactor } from "./redaction.js";
import { type AdminServer, type AdminStarter, startAdminServer } from "./server.js";
import {
  DEFAULT_LIVENESS_TIMEOUT_MS,
  DEFAULT_TIP_CAP,
  type DigestRow,
  type ModuleFacts,
  type NodeFacts,
  type PrivateInstanceFacts,
  snapshotOf,
  tableKey,
} from "./snapshot.js";
import type { AdminSnapshot, ConfigSnapshot } from "./types.js";

/** What a {@link ProcessAdmin} takes. */
export interface ProcessAdminOptions {
  /** The process's `status()`. */
  readonly status: () => ProcessStatus;
  /** The process's log (its redaction applied). */
  readonly log: (line: string) => void;
  /** How the listener starts: {@link startAdminServer} (its worker thread) unless given (the negative controls'). */
  readonly start?: AdminStarter;
  /** The process's side (CF-4), the instance role `/status` shows: public (the core) unless given. */
  readonly side?: ProcessSide;
  /**
   * The process's private side now (PP-9, AE-5; task 14.4), asked at each snapshot: on the core its private instances,
   * on a private process whether it runs in lockstep; none unless given.
   */
  readonly privateSide?: () => PrivateSideFacts;
  /**
   * The process's node besides `status()` (AE-5; task 8.3a), asked at each snapshot: the best head the node announced
   * last, its connection's state, the best-block queue's length; the three null unless given.
   */
  readonly node?: () => NodeFacts;
}

/** What `/status` shows of the private side (see {@link ProcessAdminOptions.privateSide}). */
export interface PrivateSideFacts {
  /** On the core: its private instances (`src/private/instances.ts`). */
  readonly instances: readonly PrivateInstanceFacts[];
  /** On a private process: whether it runs in lockstep, null while startup does not know. */
  readonly lockstep: boolean | null;
}

/** What startup has resolved once the database is migrated ({@link ProcessAdmin.opened}). */
export interface OpenedFacts {
  /** The build's declarations, validated: which list each part comes from. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** Every part of the database, in startup order: the resolved graph's `modules`. */
  readonly modules: readonly ModuleDeclaration[];
  /** Each part's revisions (the runner's `processRevisions`). */
  readonly revisionsOf: (id: string) => readonly Revision[];
  /** The process's database, from which `core_digest.tables`, the anchor and the server's version are read. */
  readonly db: Pick<Database, "read">;
  /** The history check: the revisions placed against the cursor, and the rows `core-chain` records (task 4.3). */
  readonly check: Pick<HistoryCheck, "entries" | "writes">;
  /** `core_chain.config` as startup read it, before `core-chain` recorded the check's rows. */
  readonly history: readonly HistoryRow[];
  /** The chain's genesis hash, as startup's check found it. */
  readonly genesisHash: Uint8Array;
}

/**
 * `core_chain.config` once `core-chain`'s `on-start-db` recorded the history check's rows (CF-7): the rows read, each
 * one a write gives (`id`, `start`) replaced by it, the new ones after them.
 */
export function recordedHistory(read: readonly HistoryRow[], writes: readonly HistoryRow[]): readonly HistoryRow[] {
  const key = (row: HistoryRow) => `${row.id}\u0000${row.start}`;
  const written = new Map(writes.map((row) => [key(row), row]));
  const kept = read.map((row) => written.get(key(row)) ?? row);
  const known = new Set(read.map(key));
  return Object.freeze([...kept, ...writes.filter((row) => !known.has(key(row)))]);
}

/** DT-5's digest rows: one per module table that has changed. */
export const DIGESTS_SQL = 'SELECT "schema", "table", height, digest FROM core_digest.tables';

/** The server's version, which `/config` shows (AE-5). */
export const VERSION_SQL = "SELECT current_setting('server_version') AS version";

/**
 * Whether the process holds its writer lock, as it knows it (DB-11): from startup's writer start on (`opened`), not
 * while a lost database connection is retried (the writer takes the lock again on its new session), never once it was
 * lost to another process (`writer-lock-lost`).
 */
export function writerLockHeld(opened: boolean, status: Pick<ProcessStatus, "conditions" | "reason">): boolean {
  return (
    opened &&
    !status.conditions.some((condition) => condition.code === "database-retrying") &&
    status.reason?.code !== "writer-lock-lost"
  );
}

/** The parts of `facts` as `/status` shows them, besides their digests. */
export function moduleFacts(facts: Pick<OpenedFacts, "declarations" | "modules" | "revisionsOf">): ModuleFacts[] {
  const { backbone, core } = facts.declarations;
  const originOf = (id: string): ModuleFacts["origin"] =>
    backbone.some((part) => part.id === id) ? "backbone" : core.some((part) => part.id === id) ? "core" : "user";
  return facts.modules.map((part) => {
    const revisions = facts.revisionsOf(part.id);
    return Object.freeze({
      id: part.id,
      version: part.version,
      side: part.side,
      origin: originOf(part.id),
      start: revisions[0]?.start ?? null,
      stop: revisions.at(-1)?.stop ?? null,
      tables: Object.freeze(
        part.provides.flatMap((item) =>
          item.table === undefined ? [] : item.table.tables.map((table) => Object.freeze({ schema: item.table!.schema, table })),
        ),
      ),
    });
  });
}

/** The runner's side of the admin endpoints (see the module comment). */
export class ProcessAdmin {
  readonly #status: () => ProcessStatus;
  readonly #log: (line: string) => void;
  readonly #start: AdminStarter;
  readonly #heartbeat: Heartbeat;
  readonly #side: ProcessSide;
  readonly #privateSide: (() => PrivateSideFacts) | undefined;
  readonly #node: (() => NodeFacts) | undefined;
  readonly #startedNs = process.hrtime.bigint();
  #redactor: Redactor = earlyRedactor(undefined);
  #liveness = DEFAULT_LIVENESS_TIMEOUT_MS;
  #readinessLag: number | null = null;
  #instanceId: string | null = null;
  #tipCap = DEFAULT_TIP_CAP;
  #lastCommitMs: number | null = null;
  #modules: readonly ModuleFacts[] | null = null;
  #db: OpenedFacts["db"] | undefined;
  /** Whether the parts have `core-digest`, whose `core_digest.tables` is read. */
  #digestTables = false;
  #digests: ReadonlyMap<string, DigestRow> = new Map();
  /** Whether a commit may have changed what is read (the digests, the anchor) since it was, and whether a read runs. */
  #stale = false;
  #versionPending = false;
  #reading = false;
  /** What `/config` is built from: the configuration once validated, what startup opened once it did. */
  #configFacts: Omit<ConfigFacts, "opened"> | undefined;
  #opened: OpenedConfig | null = null;
  #config: ConfigSnapshot = UNVALIDATED_CONFIG;
  /** The listener: starting, listening, or failed (once tried, never again). */
  #listening: Promise<AdminServer | undefined> | undefined;
  #server: AdminServer | undefined;
  #published: string | undefined;
  #closed = false;
  #closing: Promise<void> | undefined;

  /** Starts the heartbeat, which publishes at each tick. */
  constructor(options: ProcessAdminOptions) {
    this.#status = options.status;
    this.#log = options.log;
    this.#start = options.start ?? startAdminServer;
    this.#side = options.side ?? "public";
    this.#privateSide = options.privateSide;
    this.#node = options.node;
    this.#heartbeat = new Heartbeat(() => this.publish());
  }

  /**
   * The process's `core` revision is known (`core` of `checked`): starts the listener on its `listen.admin`, with its
   * liveness timeout, its readiness lag and the configuration's redaction; resolves once it listens, rejects when it
   * cannot.
   */
  async serve(checked: CheckedConfig, core: CheckedEntry): Promise<void> {
    if (this.#closed || this.#listening !== undefined) return;
    const settings = core.settings as Readonly<Record<string, unknown>>;
    this.#redactor = configRedactor(checked);
    this.#liveness = settings.livenessTimeoutMs as number;
    this.#readinessLag = (settings.readinessLag as number | undefined) ?? null;
    this.#instanceId = (settings.instanceId as string | undefined) ?? null;
    this.#tipCap = settings.tipCap as number;
    this.#configFacts = { redactor: this.#redactor, checked, core };
    this.#config = configOf({ ...this.#configFacts, opened: null }, false);
    const { admin } = settings.listen as { readonly admin: string };
    await this.#listen(admin);
  }

  /**
   * Startup has resolved the graph and migrated the database (`facts`; again after a retried startup): `/status` shows
   * every part of the database from now on, and their digests once `core_digest.tables` is read — at the next
   * publication, as after every commit.
   */
  opened(facts: OpenedFacts): void {
    this.#modules = Object.freeze(moduleFacts(facts));
    this.#db = facts.db;
    this.#digestTables = facts.modules.some((part) => part.id === "core-digest");
    this.#opened = Object.freeze({
      entries: facts.check.entries,
      history: recordedHistory(facts.history, facts.check.writes),
      declarations: facts.declarations,
      modules: facts.modules,
      genesisHash: facts.genesisHash,
      // Read at the first publication, and after each commit until its anchor is recorded.
      identity: this.#opened?.identity ?? null,
      databaseVersion: this.#opened?.databaseVersion ?? null,
    });
    this.#versionPending = this.#opened.databaseVersion === null;
    this.#stale = true;
    this.#rebuildConfig();
    this.publish();
  }

  /** A height committed (the loop's commit observer): its wall-clock time; the digests and anchor to read again. */
  committed(): void {
    this.#lastCommitMs = Date.now();
    this.#stale = true;
  }

  /** `/config` from what is known now (its writer lock is set at each snapshot). */
  #rebuildConfig(): void {
    if (this.#configFacts !== undefined) this.#config = configOf({ ...this.#configFacts, opened: this.#opened }, false);
  }

  /**
   * Reads from the process's database, when no read runs, what may have changed: once the server's version, and after
   * a commit `core_chain.identity` while its anchor is not recorded and `core_digest.tables` (with `core-digest`); then
   * publishes. Each is a read of its own, so one that fails (the database closing at the stop, a build without DT-5's
   * table) leaves what it reads as last read, until the next commit — the version is not asked again — and the others
   * are still read.
   */
  #readFacts(): void {
    const db = this.#db;
    // Only `publish` calls it, which a closed admin returns from first.
    if (this.#reading || db === undefined) return;
    const digests = this.#stale && this.#digestTables;
    const anchor = this.#stale && (this.#opened?.identity?.anchorHash ?? null) === null;
    const version = this.#versionPending;
    if (!digests && !anchor && !version) return;
    this.#stale = false;
    this.#versionPending = false;
    this.#reading = true;
    /** `body` in a read of its own: its result, or undefined when it failed. */
    const attempt = <T>(body: (read: ReadHandle) => Promise<T>): Promise<T | undefined> =>
      db.read(body).then(
        (value) => value,
        () => undefined,
      );
    void (async () => {
      const server = version ? await attempt(async (read) => (await read.query(VERSION_SQL))[0]?.version as string) : undefined;
      const identity = anchor ? await attempt((read) => readIdentity(read)) : undefined;
      const rows = digests ? await attempt((read) => read.query(DIGESTS_SQL)) : undefined;
      if (rows !== undefined) {
        this.#digests = new Map(
          rows.map((row) => {
            const digest = { schema: row.schema as string, table: row.table as string, height: row.height as bigint, digest: row.digest as Uint8Array };
            return [tableKey(digest), Object.freeze(digest)] as const;
          }),
        );
      }
      if (this.#opened !== null && (identity !== undefined || server !== undefined)) {
        this.#opened = Object.freeze({
          ...this.#opened,
          identity: identity === undefined ? this.#opened.identity : identity,
          databaseVersion: server ?? this.#opened.databaseVersion,
        });
        this.#rebuildConfig();
      }
    })().finally(() => {
      this.#reading = false;
      this.publish();
    });
  }

  /** Starts the listener at `address`; its failure rejects. */
  async #listen(address: string): Promise<void> {
    const first = this.#snapshot();
    const listening = this.#start({
      address,
      beat: this.#heartbeat.buffer,
      snapshot: first,
      onFailure: (error) => this.#log(`admin endpoints failed: ${error.message}`),
    }).then((server) => {
      this.#server = server;
      this.#published = JSON.stringify(first);
      this.#log(`admin endpoints listening on ${server.host}:${server.port}`);
      // What changed while it started.
      this.publish();
      return server;
    });
    this.#listening = listening.catch(() => undefined);
    await listening;
  }

  /** The snapshot of `status()` now. */
  #snapshot(): AdminSnapshot {
    const status = this.#status();
    const { database } = this.#config;
    const writerLock = writerLockHeld(this.#opened !== null, status);
    const config =
      database === null || database.writerLock === writerLock
        ? this.#config
        : Object.freeze({ ...this.#config, database: Object.freeze({ ...database, writerLock }) });
    const privateSide = this.#privateSide?.();
    const node = this.#node?.();
    return snapshotOf(status, {
      ...(privateSide === undefined ? {} : { privateInstances: privateSide.instances, publicLockstep: privateSide.lockstep }),
      ...(node === undefined ? {} : { node }),
      livenessTimeoutMs: this.#liveness,
      readinessLag: this.#readinessLag,
      redactor: this.#redactor,
      config,
      startedNs: this.#startedNs,
      side: this.#side,
      instanceId: this.#instanceId,
      tipCap: this.#tipCap,
      lastCommitMs: this.#lastCommitMs,
      modules: this.#modules,
      digests: this.#digests,
    });
  }

  /** Publishes the snapshot of `status()` to the listener when it changed since the last one it was sent. */
  publish(): void {
    if (this.#closed || this.#server === undefined) return;
    this.#readFacts();
    const snapshot = this.#snapshot();
    const text = JSON.stringify(snapshot);
    if (text === this.#published) return;
    this.#published = text;
    this.#server.publish(snapshot);
  }

  /** Publishes once each of `steps` settles (startup's end, processing's end). */
  follow(...steps: readonly Promise<unknown>[]): void {
    for (const step of steps) void step.then(() => this.publish(), () => this.publish());
  }

  /** Ends the heartbeat, then the listener and its thread (waiting for one still starting); calling it again: the same. */
  close(): Promise<void> {
    this.#closing ??= (async () => {
      this.#closed = true;
      this.#heartbeat.stop();
      const server = await this.#listening;
      await server?.close();
    })();
    return this.#closing;
  }
}
