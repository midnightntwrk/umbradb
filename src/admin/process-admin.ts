/**
 * The runner's side of the admin endpoints: what a process (`../runner/process.ts`, the engine) runs on its main thread
 * for them. That is the heartbeat, the publication of `status()`, the fact reads, the admin listener's life, and the
 * answers of the handler a library host mounts. Every process has it; the engine's admin port adds the listener.
 *
 * - **From the engine's start on:** the heartbeat ticks every second (`../runner/heartbeat.ts`), and each tick publishes
 *   the snapshot of `status()` (`./snapshot.ts`): it reads the facts that may have changed, and sends the listener the
 *   snapshot when it has changed. So does every step the runner reports: startup's end, processing's end, and the start
 *   of the stop ({@link ProcessAdmin.follow}, {@link ProcessAdmin.publish}). Without a listener the heartbeat's timer is
 *   `unref()`ed, so it never keeps a library host's event loop alive.
 * - **The mounted handler** ({@link ProcessAdmin.answer}, written by `./mounted.ts`) answers from the engine's start
 *   on, on the host's thread: the snapshot built at the request from what the process holds in memory, never a database
 *   read; `/health/live` the host thread's (`core-health`'s mounted endpoint: 200, `thread: "host"`). Until the
 *   configuration is validated `/config` holds the build only and `/status`'s `instance.role` is null; after the
 *   process has closed it answers from its last snapshot.
 * - **The configuration**, once validated ({@link ProcessAdmin.validated}): the process revision's liveness timeout,
 *   readiness lag, redaction and side. A refusal before that is shown redacted by the configuration's secrets as loaded
 *   ({@link ProcessAdmin.refusedWith}).
 * - **The listener** starts as soon as the plan gives its address. {@link ProcessAdmin.serve} runs once the
 *   process's `core` revision and its network plan are known and before the database opens. It listens where the plan
 *   says (the command's `listen.admin`, by default `0.0.0.0:8081`), with that revision's liveness timeout, readiness lag
 *   and redaction. A listener that cannot listen refuses startup (with Node.js's error, as the runner's
 *   `listen-failed`).
 * - **Never before that:** a startup refused earlier, by the configuration itself, has no validated address. It ends
 *   the process with no listener, and the refusal appears in its log only. An earlier design, which listened on an
 *   address read before validation, was dropped for this.
 * - **What `/status` shows besides `status()`**:
 *   - the process's side and `instanceId`, and its revision's `tipCap`;
 *   - its private side as the process gives it at each snapshot ({@link ProcessAdminOptions.privateSide}: the core's
 *     private instances, or a private process's lockstep flag);
 *   - the core's node as the process reports it at each snapshot ({@link ProcessAdminOptions.node}: the best head
 *     announced last, the connection's state, the queue's depth);
 *   - the wall-clock time of the last commit ({@link ProcessAdmin.committed}, which the loop's commit observer calls);
 *   - once startup has resolved the graph and migrated the database ({@link ProcessAdmin.opened}), every part of the
 *     database with its revisions and its tables' rows of `core_digest.tables`. The main thread reads these from the
 *     process's database, at most one read at a time, at a publication after `opened` or a commit, so neither the
 *     worker nor a mounted request reads anything. A commit during a read marks the facts stale again, and the read's
 *     end publishes, so the next read starts at once.
 * - **At `stop()`**, after the database has closed, or when a refusal of the configuration ended the process:
 *   {@link ProcessAdmin.close} ends the heartbeat and the listener's thread. Nothing of it is left to keep Node.js
 *   alive; the mounted handler goes on answering from the snapshot taken then.
 */

import type { ProcessSide } from "../config/core-settings.js";
import { configRedactor, type Redactor } from "../config/redact.js";
import type { CheckedConfig, CheckedEntry } from "../config/validate.js";
import type { Database, ReadHandle } from "../db/api.js";
import type { ModuleDeclaration, Revision } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { Heartbeat, tickAgeMs } from "../runner/heartbeat.js";
import type { ProcessStatus } from "../runner/process.js";
import { readIdentity } from "../backbone/core-chain/sql.js";
import type { HistoryCheck, HistoryRow } from "../config/history.js";
import { type ConfigFacts, configOf, type NetworkShown, type OpenedConfig, UNVALIDATED_CONFIG, withNetwork } from "./configuration.js";
import { earlyRedactor } from "./redaction.js";
import { answerAdmin, MOUNTED_ADMIN_ROUTES } from "./routes.js";
import type { WorkerOutput } from "../runner/worker-output.js";
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
import type { AdminAnswer, AdminSnapshot, AdminView, ConfigSnapshot } from "./types.js";

/** What a {@link ProcessAdmin} takes. */
export interface ProcessAdminOptions {
  /** The process's `status()`. */
  readonly status: () => ProcessStatus;
  /** The process's log (its redaction applied). */
  readonly log: (line: string) => void;
  /** How the listener starts: {@link startAdminServer} (its worker thread) unless given (the negative controls'). */
  readonly start?: AdminStarter;
  /**
   * Where the listener's thread writes its standard output and standard error, given to the starter: the process's log,
   * or `"inherit"` for `umbradb run`.
   */
  readonly output?: WorkerOutput;
  /**
   * The process's side, the instance role `/status` shows until {@link ProcessAdmin.validated} takes it from the
   * validated configuration: none (null) unless given.
   */
  readonly side?: ProcessSide;
  /**
   * The process's private side now, asked at each snapshot: on the core its private instances, on a private process
   * whether it runs in lockstep; none unless given.
   */
  readonly privateSide?: () => PrivateSideFacts;
  /**
   * The process's node besides `status()`, asked at each snapshot: the best head the node announced last, its
   * connection's state, the best-block queue's length; the three null unless given.
   */
  readonly node?: () => NodeFacts;
  /**
   * The process's network as `/config` shows it, asked at each snapshot: its plan's modes and, for a library process,
   * its addresses as bound (`withNetwork`); none before the plan, or unless given.
   */
  readonly network?: () => NetworkShown | null;
  /** The negative controls' and the fact-read tests' changes ({@link AdminSeams}); none unless given. */
  readonly seams?: AdminSeams;
}

/**
 * The tests' changes of admin, none of which a host's process takes: a hold in each fact read, and the negative
 * controls' admin.
 */
export interface AdminSeams {
  /**
   * Awaited once a fact read's queries returned and before the read ends, so that a test lands a commit during a read
   * (the follow-up read then reads it).
   */
  readonly factsRead?: () => Promise<void>;
  /** The negative control's fact reads: a commit that lands during a read is forgotten when the read ends. */
  readonly forgetCommitsDuringRead?: true;
  /**
   * The negative control's publication: none without a listener, the fact reads with it — `publish()` returning before
   * them when nothing listens, as before mounted admin.
   */
  readonly publishOnlyWithListener?: true;
  /** The negative control's heartbeat: its timer keeps Node.js running with no listener. */
  readonly heartbeatKeepsAlive?: true;
  /** The negative control's mounted answers, in place of the mounted route table's. */
  readonly mountedAnswer?: (method: string, url: string, view: AdminView) => AdminAnswer;
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
  /** The history check: the revisions placed against the cursor, and the rows `core-chain` records. */
  readonly check: Pick<HistoryCheck, "entries" | "writes">;
  /** `core_chain.config` as startup read it, before `core-chain` recorded the check's rows. */
  readonly history: readonly HistoryRow[];
  /** The chain's genesis hash, as startup's check found it. */
  readonly genesisHash: Uint8Array;
}

/**
 * `core_chain.config` once `core-chain`'s `on-start-db` has recorded the history check's rows: the rows read, each one
 * that a write gives (`id`, `start`) replaced by it, and the new ones after them.
 */
export function recordedHistory(read: readonly HistoryRow[], writes: readonly HistoryRow[]): readonly HistoryRow[] {
  const key = (row: HistoryRow) => `${row.id}\u0000${row.start}`;
  const written = new Map(writes.map((row) => [key(row), row]));
  const kept = read.map((row) => written.get(key(row)) ?? row);
  const known = new Set(read.map(key));
  return Object.freeze([...kept, ...writes.filter((row) => !known.has(key(row)))]);
}

/** The digest rows: one per module table that has changed. */
export const DIGESTS_SQL = 'SELECT "schema", "table", height, digest FROM core_digest.tables';

/** The server's version, which `/config` shows. */
export const VERSION_SQL = "SELECT current_setting('server_version') AS version";

/**
 * Whether the process holds its writer lock, as it knows it. It does from startup's writer start on (`opened`), but not
 * while a lost database connection is retried (the writer takes the lock again on its new session), and never once it
 * was lost to another process (`writer-lock-lost`).
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
  readonly #output: WorkerOutput | undefined;
  readonly #heartbeat: Heartbeat;
  readonly #seams: AdminSeams;
  /** The process's side once known; null before. */
  #side: ProcessSide | null;
  readonly #privateSide: (() => PrivateSideFacts) | undefined;
  readonly #node: (() => NodeFacts) | undefined;
  readonly #network: (() => NetworkShown | null) | undefined;
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
  /** The snapshot taken when the process closed, which the mounted handler answers from after. */
  #final: AdminSnapshot | undefined;

  /** Starts the heartbeat, which publishes at each tick; its timer keeps Node.js running only once a listener listens. */
  constructor(options: ProcessAdminOptions) {
    this.#status = options.status;
    this.#log = options.log;
    this.#start = options.start ?? startAdminServer;
    this.#output = options.output;
    this.#side = options.side ?? null;
    this.#privateSide = options.privateSide;
    this.#node = options.node;
    this.#network = options.network;
    this.#seams = options.seams ?? {};
    this.#heartbeat = new Heartbeat(() => this.publish(), { keepAlive: this.#seams.heartbeatKeepsAlive === true });
  }

  /**
   * The configuration is validated and the process's `core` revision chosen (`core` of `checked`): takes the revision's
   * liveness timeout, its readiness lag, the configuration's redaction and its side; `/config` shows the configuration
   * from now on. Once only.
   */
  validated(checked: CheckedConfig, core: CheckedEntry): void {
    if (this.#configFacts !== undefined) return;
    const settings = core.settings as Readonly<Record<string, unknown>>;
    this.#side = checked.side;
    this.#redactor = configRedactor(checked);
    this.#liveness = settings.livenessTimeoutMs as number;
    this.#readinessLag = (settings.readinessLag as number | undefined) ?? null;
    this.#instanceId = (settings.instanceId as string | undefined) ?? null;
    this.#tipCap = settings.tipCap as number;
    this.#configFacts = { redactor: this.#redactor, checked, core };
    this.#config = configOf({ ...this.#configFacts, opened: null }, false);
  }

  /**
   * A refusal before the configuration was validated: `/status` shows its reason through `redaction` (the
   * configuration's secrets as it was loaded, as the refusal's log lines are).
   */
  refusedWith(redaction: Redactor): void {
    if (this.#configFacts === undefined) this.#redactor = redaction;
  }

  /**
   * The process's `core` revision is known (`core` of `checked`) and its network planned: {@link validated} with them,
   * and the listener at `address`, the plan's (`listen.admin` or its default for `umbradb run`), or none for null;
   * resolves once it listens, rejects when it cannot.
   */
  async serve(checked: CheckedConfig, core: CheckedEntry, address: string | null): Promise<void> {
    if (this.#closed || this.#listening !== undefined) return;
    this.validated(checked, core);
    if (address === null) return;
    // A listener answers by the heartbeat: from now on its timer keeps the process running.
    this.#heartbeat.keepAlive();
    await this.#listen(address);
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
   * publishes. Each is a read of its own, so one that fails (the database closing at the stop, a build without the
   * digest table) leaves what it reads as last read, until the next commit (the version is not asked again), and the
   * others are still read.
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
      // The fact-read tests' hold: a commit lands here, after the queries and before the read ends.
      await this.#seams.factsRead?.().catch(() => undefined);
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
      // The negative control forgets a commit that landed during the read, so no follow-up read reads it.
      if (this.#seams.forgetCommitsDuringRead === true) this.#stale = false;
    })().finally(() => {
      this.#reading = false;
      // A commit during the read marked the facts stale: this publication reads them again at once.
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
      ...(this.#output === undefined ? {} : { output: this.#output }),
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
    const locked =
      database === null || database.writerLock === writerLock
        ? this.#config
        : Object.freeze({ ...this.#config, database: Object.freeze({ ...database, writerLock }) });
    const config = withNetwork(locked, this.#network?.() ?? null);
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

  /** Where the listener listens once it does; null before, without one, and once closed. */
  listening(): { readonly host: string; readonly port: number } | null {
    const server = this.#server;
    return this.#closed || server === undefined ? null : Object.freeze({ host: server.host, port: server.port });
  }

  /**
   * Publishes: reads the facts that may have changed (see the module comment), then sends the listener the snapshot of
   * `status()` when it changed since the last one it was sent. Without a listener the snapshot stays in memory, where
   * the mounted handler builds it at each request.
   */
  publish(): void {
    if (this.#closed) return;
    // The negative control's fault: a process without a listener publishes nothing, its facts never read.
    if (this.#seams.publishOnlyWithListener === true && this.#server === undefined) return;
    this.#readFacts();
    const server = this.#server;
    if (server === undefined) return;
    const snapshot = this.#snapshot();
    const text = JSON.stringify(snapshot);
    if (text === this.#published) return;
    this.#published = text;
    server.publish(snapshot);
  }

  /**
   * The mounted handler's answer to `method url` (see the module comment): the snapshot of the process now — after it
   * closed, the one taken then — the heartbeat's age at the request, and the mounted route table. Reads no database.
   */
  answer(method: string, url: string): AdminAnswer {
    const snapshot = this.#final ?? this.#snapshot();
    const nowNs = process.hrtime.bigint();
    const view: AdminView = { snapshot, beatAgeMs: tickAgeMs(this.#heartbeat.buffer, nowNs), nowNs };
    const answer = this.#seams.mountedAnswer ?? ((m: string, u: string, v: AdminView) => answerAdmin(MOUNTED_ADMIN_ROUTES, m, u, v));
    return answer(method, url, view);
  }

  /** Publishes once each of `steps` settles (startup's end, processing's end). */
  follow(...steps: readonly Promise<unknown>[]): void {
    for (const step of steps) void step.then(() => this.publish(), () => this.publish());
  }

  /**
   * Ends the heartbeat, then the listener and its thread (waiting for one still starting); calling it again: the same.
   * The mounted handler answers from the snapshot taken now from then on.
   */
  close(): Promise<void> {
    this.#closing ??= (async () => {
      this.#final = this.#snapshot();
      this.#closed = true;
      this.#heartbeat.stop();
      const server = await this.#listening;
      await server?.close();
    })();
    return this.#closing;
  }
}
