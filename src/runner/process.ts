/**
 * The process (`openspec/changes/core-arch/specs/runner/spec.md` RN-1, RN-7–RN-13; `specs/configuration/spec.md`
 * CF-3, CF-4, CF-6, CF-8; `specs/ingest/spec.md` IN-10, IN-12; `specs/admin-endpoints/spec.md` AE-3, AE-4; `design.md`
 * §1, §2, §7, §11; CORE-ARCH §4.6, §4.12, §4.15, §4.17, §4.18; decision records Q43, Q102): what
 * `umbradb run` starts (task 4.4) — {@link startProcess} assembles the runner's startup from the build's declarations,
 * the configuration and a block source, runs the finalized loop, and publishes the process's state.
 *
 * **Startup**, in this order, each step's refusal the step's own typed error:
 * 1. the build's declarations validated (`validateDeclarations`, task 3.1);
 * 2. the configuration loaded (`loadConfig`, CF-1: the file, or data given) and validated (`validateConfig`, task 4.2);
 * 3. the `core` entry's operational and secret fields from its latest revision of the build's version, for the whole
 *    run (`processCoreEntry`, decision record Q102 resolved A): the database, the node — the process's one node client
 *    is made from this revision's `node` (`nodeOptionsOf`), and the block source, when given as a function, from the
 *    revision and that client (task 10.3: `core-block-fetch`'s node source, `nodeSourceOf`) —, `listen.api`, the
 *    timeouts, the development opt-in, the core's stop;
 * 4. the database that revision names opened (`openConfiguredDatabase`, CF-9: PGlite refuses without its opt-in), its
 *    writer started (`startWriter`: the lock, the durability probe, whose warnings are logged);
 * 5. the cursor (the block source's, RN-14), the configuration history (`readHistory`) and the chain's identity
 *    (`readIdentity`) read in one read, and the history checked against the configuration (`checkHistory`, CF-5,
 *    CF-6, CF-8: every refusal before any migration);
 * 6. `core-chain`'s startup checks against the node, through the block source (`checkChain`, IN-3, task 10.2): its
 *    genesis hash against the configured network's at every start (`configuredGenesisOf` of the `core` revision, task
 *    10.2a), and on a database with a cursor the stored genesis hash (`genesis-mismatch`), a wait while the node's
 *    finalized head is below the cursor (the condition `waiting-for-node`), and the node's hash at the cursor
 *    (`cursor-hash-mismatch`) — also before any migration;
 * 7. the graph resolved from the check (`resolveGraph`, `graphInputOf`), the schema plan, the process contexts with each
 *    part's revisions ({@link processRevisions}), `core-chain` bound to its context with what startup checked and
 *    opened (`bindCoreChain`: the configuration, the declarations, the cursor, the database, S, the genesis hash, the
 *    node client, the revision's ledger table), `core-block-fetch` bound to the block source (`bindCoreBlockFetch`, when
 *    the source gives block items), and so is the core module `core-chain-events` when enabled (`bindCoreChainEvents`,
 *    when the source gives a block's events; task 11.1), the migrations and `on-start-db` (`startDatabase`, through each
 *    context's publishing window — `core-chain`'s records the history and the identity and publishes its `process`
 *    items —; a failing
 *    `on-start-db` names its point and module, a `CallbackFailure` as a failing `on-start-api`'s), the seal
 *    (`process-item-missing`);
 * 8. on a database without a cursor, the bootstrap's wait while S is above the node's finalized head (`waitForNode`,
 *    IN-2: still `starting`, with the condition `waiting-for-node`), every bootstrap step having run;
 * 9. `on-start-api` and the module API on `listen.api` (`startModuleApi`);
 * 10. the finalized loop, with the core's stop and RN-12's upgrade boundary ({@link upgradeBoundary}).
 * A refusal closes what startup opened — the node client, the database, its writer lock released, then the block
 * source — and rejects {@link ProcessHandle.started} with it; the process stays up, `refused` with the refusal's
 * reason, until stopped (IN-12, AE-3). A retryable failure of steps 4 to 8 (`connection-lost`, `node-unreachable`) refuses nothing:
 * steps 4 to 10 run again after IN-10's back-off (see **Retries**), with new process contexts and new bindings of
 * `core-chain` and `core-block-fetch` (the node client and the block source kept). The waits come before the module
 * API, so a retry never meets it open.
 *
 * **The state** ({@link ProcessStatus}, CORE-ARCH §4.18, AE-3): `starting` until the loop runs; `refused` when startup
 * refused; then `syncing` or `following` by the lag — the finalized head the loop last read minus the cursor — against
 * the `followingThreshold`; `stopped` once processing ended at the core's stop or before an upgrade boundary, with the
 * condition `upgrade-required` at a boundary (RN-12), the process still up and the module API answering at the
 * cursor; `halted` when processing failed (RN-8): the failure before the `COMMIT` left nothing of its height (the loop
 * rolled it back), one after it left the height committed, and the process stays up, the module API answering at the
 * cursor and the database open until stopped; `stopping` from {@link ProcessHandle.stop} on. `refused` and `halted`
 * carry their reason ({@link ProcessReason}: §11's code, the height, the module and the point; `./failures.ts`). Ready
 * (`/health/ready`, AE-4's order, `readinessOf`) when `stopped`, else unless a set `readinessLag` is exceeded; never
 * `starting`, `refused`, `halted` or `stopping`. While startup waits for the node (steps 6 and 8) the process is
 * `starting` with the condition `waiting-for-node`, beside a retry's condition when one is raised; the block source's
 * own conditions (`finality-stall` while the node source's queue is full, IN-6) are the process's too. The admin
 * endpoints that show all this are tasks 8.1–8.3.
 *
 * **Retries** (IN-10, CORE-ARCH §4.6): a lost database connection (`connection-lost`) or an unreachable node
 * (`node-unreachable`) — the two retryable codes, wherever startup's later steps or the loop meet them — never halts or
 * refuses: the process raises the condition `database-retrying` or `node-retrying` with the attempts and the height,
 * waits IN-10's back-off (`backoffDelay`: 1 s doubling up to the process revision's `backoffCeilingMs`), and runs
 * again — startup from its database steps, or the loop, which reads the cursor again and re-delivers it (RN-11), so a
 * height whose transaction was lost (the writer re-takes its lock, DB-11) is processed again from `on-fetch`, and one
 * whose `COMMIT` landed continues with its `on-after-db-write`. The condition clears, and the back-off starts again
 * from 1 s, once startup completes, a height commits or the loop finds nothing to process. A stop ends the wait at once.
 * Task 10.4 refines it (IN-10's items kept from before `on-compute`, IN-11's cursor check after an uncertain `COMMIT`).
 *
 * **SIGTERM** (RN-13): {@link terminationSignal} gives the signal SIGTERM aborts; aborting
 * {@link ProcessInput.signal}, or calling {@link ProcessHandle.stop}, enters `stopping`, aborts the loop's signal — the
 * loop finishes the height in progress, so a block whose transaction is open commits, and starts no other —, awaits
 * it, then closes the module API (WebSocket clients get 1001, every connection ends), the node client, the database and
 * the block source. During startup it stops before the next step, and ends a wait for the node at once.
 *
 * **A private process** (`side: "private"`, PP-1; task 14.1) starts the same way with the private `core` schema (CF-4):
 * its block source is `core-private-source`'s (`src/backbone/core-private-source/`), whose cursor and committed height
 * are the private cursor's and whose blocks are the public database's; step 6 is that source's own check (it reads the
 * public database's chain identity, whose genesis hash `core-chain` records; PP-2's binding is the part's), the
 * bootstrap's wait of step 8 waits for the public cursor to reach the private S, and the source is closed with the
 * database.
 *
 * **Logs** go through the configuration's redaction (`configRedactor`, CF-4, AE-6) once it is validated; before that,
 * a refusal is logged by its code only, since nothing yet knows which strings are secret. A refusal, a halt and each
 * retry are logged with their reason's code (`startup refused: <code>: …`, `processing halted (<code>): …`,
 * `processing retries in <ms> ms (<condition>, attempt <n>): …`, `startup retries …`).
 *
 * **The admin endpoints** (AE-1, AE-2; task 8.1, `../admin/`), unless {@link ProcessInput.admin} is `false` (owner
 * decision Q128 B, task 8.1a): the heartbeat ticks from `startProcess` on and publishes `status()` to the admin worker;
 * the admin listener starts on `listen.admin` once the process's `core` revision is known, before the database opens
 * (a listener that cannot listen — an address another listener holds — refuses startup, `listen-failed`), or at a
 * refusal before that; it closes after the database at {@link ProcessHandle.stop}.
 */

import { cursorHeight } from "../backbone/core-block-commit/core-block-commit.js";
import { bindCoreBlockFetch, CORE_BLOCK_FETCH_ID, isBlockItemSource } from "../backbone/core-block-fetch/core-block-fetch.js";
import { isBlockEventSource } from "../backbone/core-block-fetch/events.js";
import { bindCoreChainEvents, CORE_CHAIN_EVENTS_ID } from "../backbone/core-chain-events/core-chain-events.js";
import {
  bindCoreChain,
  type ChainCheck,
  type ChainCheckInput,
  checkChain,
  configuredGenesisOf,
  CORE_CHAIN_ID,
  type NodeWait,
  nodeOptionsOf,
  readHistory,
  readIdentity,
  waitForNode,
} from "../backbone/core-chain/index.js";
import { readinessOf } from "../backbone/core-health/readiness.js";
import { buildCoreVersion, type CoreVersion } from "../config/build.js";
import type { ProcessSide } from "../config/core-settings.js";
import { openConfiguredDatabase } from "../config/database.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { checkHistory, graphInputOf, type HistoryCheck, versionText } from "../config/history.js";
import { loadConfig, type LoadOptions } from "../config/load.js";
import { type PlainObject, plainData } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import { configRedactor, type Redactor } from "../config/redact.js";
import { type CheckedConfig, type CheckedEntry, validateConfig } from "../config/validate.js";
import type { Database } from "../db/api.js";
import { type MigrationPart, startDatabase } from "../db/migrate.js";
import { startWriter } from "../db/writer-lock.js";
import type { LedgerTable } from "../ledger/version-table.js";
import { schemaPlan } from "../modules/adapters.js";
import type { ModuleDeclaration, Revision } from "../modules/declaration.js";
import { backoffDelay } from "../node/backoff.js";
import { ProcessAdmin } from "../admin/process-admin.js";
import type { AdminStarter } from "../admin/server.js";
import { NodeClient } from "../node/client.js";
import { resolveGraph } from "../modules/graph.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";
import { type StartedModuleApi, startModuleApi } from "./api-server.js";
import type { BlockRef, BlockSource, SourceCondition } from "./block-source.js";
import { CallbackFailure, isBackbonePart } from "./dispatch.js";
import { type ProcessReason, reasonOf, type RetryCode, retryOf } from "./failures.js";
import { FinalizedLoop, HeightFailure, type LoopEnd, type LoopInput } from "./loop.js";
import { ProcessContexts } from "./process-context.js";

/**
 * The configuration a process runs with: a file to load (CF-1), or its data — a browser's bundle, a test's —, which
 * startup holds to CF-1's plain data as it holds a file's default export (`plainData`).
 */
export type ProcessConfig = LoadOptions | { readonly data: unknown; readonly file?: string };

/** What {@link startProcess} takes. */
export interface ProcessInput {
  /**
   * The build's declarations, not yet validated: UmbraDB's backbone parts — `core-chain` (`CORE_CHAIN`, which startup
   * binds to its process context, task 10.2) among them; until task 10.3 builds `core-block-fetch`, the caller's
   * stand-in —, its core modules, the host's user modules.
   */
  readonly declarations: DeclarationSet;
  /** The configuration; `umbradb.config.ts` in the working directory when absent (CF-1). */
  readonly config?: ProcessConfig;
  /**
   * The block source (RN-14), or how to make it — `nodeSourceOf` for the node (task 10.3) — from the process's `core`
   * revision (Q102) and what the process shares with it, its node client: called once, after the configuration is
   * validated, before the database opens.
   */
  readonly source: BlockSource | ((core: CheckedEntry, shared: SourceShared) => BlockSource);
  /** The process's side: which `core` schema applies (CF-4); public unless given. */
  readonly side?: ProcessSide;
  /** Stops the process when it aborts (RN-13; {@link terminationSignal} for SIGTERM). */
  readonly signal?: AbortSignal;
  /** Where each log line goes, redacted (see the module comment); standard error when absent. */
  readonly log?: (line: string) => void;
  /** The negative controls' startup checks against the node; `core-chain`'s `checkChain` (IN-3) unless given. */
  readonly checkChain?: (input: ChainCheckInput) => Promise<ChainCheck>;
  /** The negative controls' loop; the finalized loop unless given. */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** The negative controls' choice of the process's `core` revision; `processCoreEntry` (Q102) unless given. */
  readonly processCore?: (config: CheckedConfig) => CheckedEntry;
  /**
   * The admin endpoints (AE-1, AE-2; `../admin/`), served unless `false` (decision record Q128 B: opt-out): absent or
   * `true` serves them on `listen.admin` from the admin worker, with the heartbeat, from startup until
   * {@link ProcessHandle.stop}; a starter serves them through it (the negative controls'). A program or a test that
   * starts several processes gives each its own `listen.admin` (port 0 for a free one) or opts out: a second process
   * on one address refuses startup with `listen-failed` before its database opens.
   */
  readonly admin?: boolean | AdminStarter;
}

/** What the process shares with the block source it makes (task 10.3): its one node connection. */
export interface SourceShared {
  /** The node client made from the process's `core` revision (`nodeOptionsOf`), or null for a revision with no node. */
  readonly nodeClient: NodeClient | null;
}

/** The process's state (CORE-ARCH §4.18, AE-3): exactly one at a time. */
export type ProcessState = "starting" | "refused" | "syncing" | "following" | "stopped" | "halted" | "stopping";

/** One entry at an upgrade boundary (RN-12): its id, the revision's start, the version it needs, the build's. */
export interface UpgradeEntry {
  readonly id: string;
  readonly start: number;
  readonly needed: string | CoreVersion;
  readonly build: string | CoreVersion;
}

/** RN-12's upgrade boundary: its height and the entries whose revision starting there this build does not carry. */
export interface UpgradeBoundary {
  readonly height: bigint;
  readonly entries: readonly UpgradeEntry[];
}

/** A condition of the process (CORE-ARCH §4.18): `upgrade-required` at a boundary (RN-12). */
export interface UpgradeCondition extends UpgradeBoundary {
  readonly code: "upgrade-required";
}

/**
 * A condition of the process (IN-10, AE-3): a failure is being retried — `database-retrying` for a lost database
 * connection, `node-retrying` for an unreachable node —, after `attempts` failures since startup completed or the last
 * commit, at `height` (null at startup, or at the loop's cursor read).
 */
export interface RetryCondition {
  readonly code: RetryCode;
  readonly attempts: number;
  readonly height: bigint | null;
}

/**
 * The condition `waiting-for-node` (IN-2, IN-3; task 10.2): startup waits, `starting`, for the node's finalized head to
 * reach `height` — S on a new database, the cursor on one with a cursor —; `head` is the node's head when it began.
 */
export interface WaitingCondition extends NodeWait {
  readonly code: "waiting-for-node";
}

/**
 * The process's conditions (AE-3); the block source's own (`finality-stall`, IN-6) among them; `slow-block` is task
 * 5.5's, the others' their tasks'.
 */
export type ProcessCondition = UpgradeCondition | RetryCondition | WaitingCondition | SourceCondition;

/** How processing ended. */
export type ProcessingEnd =
  /** At its last height: the core's stop (`core`), or before an upgrade boundary (`upgrade`); the process is `stopped`. */
  | { readonly kind: "stopped"; readonly height: bigint; readonly core: boolean; readonly upgrade: UpgradeBoundary | null }
  /** Stopped by {@link ProcessHandle.stop} or the signal, during startup or processing. */
  | { readonly kind: "signal" }
  /** Startup refused or failed: `error` is what {@link ProcessHandle.started} rejected with. */
  | { readonly kind: "refused"; readonly error: unknown }
  /** The loop failed and did not retry (a `HeightFailure`, or a cursor read's error); the process is `halted`, up. */
  | { readonly kind: "failed"; readonly error: unknown };

/** The process's state now (CORE-ARCH §4.18, AE-3, AE-4). */
export interface ProcessStatus {
  readonly state: ProcessState;
  /** Whether it should receive API traffic (`/health/ready`). */
  readonly ready: boolean;
  readonly conditions: readonly ProcessCondition[];
  /** The last committed height, null before any. */
  readonly cursor: bigint | null;
  /** The finalized head the loop last read, null before it read one. */
  readonly head: bigint | null;
  /** The head minus the cursor (minus S − 1 before any height committed), at least 0; null without a head. */
  readonly lag: bigint | null;
  /** How processing ended, or null while it has not. */
  readonly ended: ProcessingEnd | null;
  /**
   * Why startup refused or processing halted (AE-5's reason, height, module and point; never a message, AE-6), null
   * before either; kept once the process is `stopping`.
   */
  readonly reason: ProcessReason | null;
}

/** What a process that started gives. */
export interface StartedProcess {
  /** The `core` revision whose operational and secret fields the process runs with (Q102). */
  readonly core: CheckedEntry;
  /** Where the module API listens (`listen.api`), or null without it. */
  readonly api: { readonly host: string; readonly port: number } | null;
}

/** A process {@link startProcess} started. */
export interface ProcessHandle {
  /** The process's state now. */
  status(): ProcessStatus;
  /** Resolves once startup completed and the loop runs; rejects with startup's refusal or failure. */
  readonly started: Promise<StartedProcess>;
  /** Resolves with how processing ended (also when startup did not complete); never rejects. */
  readonly ended: Promise<ProcessingEnd>;
  /**
   * Stops the process (RN-13): `stopping`; the loop's signal aborted and the loop awaited; the module API, then the
   * database, closed. Resolves once all of it is done; calling it again returns the same promise.
   */
  stop(): Promise<void>;
  /** Resolves once {@link stop} completed. */
  readonly closed: Promise<void>;
}

/** What {@link statusOf} computes the state from. */
export interface StatusFacts {
  readonly phase: "starting" | "refused" | "running" | "stopped" | "halted" | "stopping";
  /** S, once the configuration is validated. */
  readonly start: bigint | null;
  readonly cursor: bigint | null;
  readonly head: bigint | null;
  readonly followingThreshold: number;
  readonly readinessLag: number | null;
  readonly conditions: readonly ProcessCondition[];
  readonly ended: ProcessingEnd | null;
  readonly reason: ProcessReason | null;
}

/** The process's state from `facts` (see the module comment): pure. */
export function statusOf(facts: StatusFacts): ProcessStatus {
  const { phase, start, cursor, head, readinessLag } = facts;
  const behind = head === null || start === null ? null : head - (cursor ?? start - 1n);
  const lag = behind === null || behind > 0n ? behind : 0n;
  const following = lag !== null && lag <= BigInt(facts.followingThreshold);
  const state: ProcessState = phase === "running" ? (following ? "following" : "syncing") : phase;
  const ready = readinessOf({ state, lag, readinessLag });
  const conditions = Object.freeze([...facts.conditions]);
  return Object.freeze({ state, ready, conditions, cursor, head, lag, ended: facts.ended, reason: facts.reason });
}

/**
 * RN-12's upgrade boundary for a startup's history check: the lowest start of a scheduled revision — one above the
 * cursor whose version this build does not carry —, with every entry whose scheduled revision starts there, in the
 * configuration's order, and the version the build carries for it; null when no revision is scheduled. The check's
 * version rule (CF-8) has made sure the revision covering cursor + 1 is the build's, so the boundary is above it.
 */
export function upgradeBoundary(
  check: HistoryCheck,
  declarations: DeclarationSet<ModuleDeclaration>,
): UpgradeBoundary | null {
  const scheduled = check.entries.filter((entry) => entry.scheduled);
  if (scheduled.length === 0) return null;
  const height = Math.min(...scheduled.map((entry) => entry.start));
  const builds = new Map([...declarations.core, ...declarations.user].map((declaration) => [declaration.id, declaration.version]));
  const entries = scheduled
    .filter((entry) => entry.start === height)
    .map((entry) =>
      Object.freeze({
        id: entry.id,
        start: entry.start,
        needed: entry.version,
        build: entry.id === CORE_ENTRY_ID ? buildCoreVersion() : (builds.get(entry.id) as string),
      }),
    );
  return Object.freeze({ height: BigInt(height), entries: Object.freeze(entries) });
}

/** A revision of the process contexts (MD-7): frozen. */
function revisionOf(entry: CheckedEntry, stop: bigint | null, settings: PlainObject): Revision {
  return Object.freeze({ start: BigInt(entry.start), stop, version: versionText(entry.version), settings: Object.freeze(settings) });
}

/**
 * Each part's revisions for its process context, in start order (RN-7: a callback's settings are its revision's at the
 * height): a module's from the history check's entries, with their effective stops (CF-5, `graphEntries`) and their
 * settings — the parsed settings of the build's version, defaults applied, or an earlier `versionEntry`'s `config` as
 * recorded, none for a scheduled one —; every backbone part's are the `core` entry's (the backbone runs with the core),
 * each one's data fields with every operational and secret field of `process`, the process's `core` revision (Q102:
 * data fields apply from each revision's start, the others are the process's for its whole run).
 */
export function processRevisions(check: HistoryCheck, process: CheckedEntry): (id: string) => readonly Revision[] {
  const byId = new Map<string, Revision[]>();
  const modules = check.entries.filter((entry) => entry.id !== CORE_ENTRY_ID);
  modules.forEach((entry, index) => {
    // `graphEntries` keeps the module revisions in the configuration's order.
    const { stop } = check.graphEntries[index] as { readonly stop: bigint | null };
    byId.set(entry.id, [...(byId.get(entry.id) ?? []), revisionOf(entry, stop, entry.settings ?? {})]);
  });
  const kinds = process.kinds as Readonly<Record<string, string>>;
  const own = Object.fromEntries(Object.entries(process.settings as PlainObject).filter(([field]) => kinds[field] !== "data"));
  const cores = check.entries.filter((entry) => entry.id === CORE_ENTRY_ID).sort((a, b) => a.start - b.start);
  const core = Object.freeze(
    cores.map((entry, index) => {
      const next = cores[index + 1];
      const data = (entry.buildVersion ? entry.data : entry.settings) ?? {};
      return revisionOf(entry, next === undefined ? null : BigInt(next.start - 1), { ...own, ...data });
    }),
  );
  const ordered = new Map(
    [...byId].map(([id, list]) => [id, Object.freeze(list.sort((a, b) => (a.start < b.start ? -1 : 1)))]),
  );
  return (id) => (isBackbonePart({ id }) ? core : (ordered.get(id) ?? Object.freeze([])));
}

/** What listens to a process's signals: `process` itself, or a test's emitter. */
export interface SignalTarget {
  once(event: "SIGTERM", listener: () => void): unknown;
  removeListener(event: "SIGTERM", listener: () => void): unknown;
}

/**
 * RN-13 for a Node.js process: a signal that the first SIGTERM `target` receives aborts — {@link ProcessInput.signal}
 * for `umbradb run` —, and `dispose`, which stops listening.
 */
export function terminationSignal(target: SignalTarget = process): { readonly signal: AbortSignal; dispose(): void } {
  const controller = new AbortController();
  const listener = (): void => controller.abort();
  target.once("SIGTERM", listener);
  return Object.freeze({ signal: controller.signal, dispose: () => void target.removeListener("SIGTERM", listener) });
}

/** A log line to standard error. */
const standardError = (line: string): void => {
  process.stderr.write(`${line}\n`);
};

/** An error's message, or the value as text. */
const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/**
 * `part` whose `on-start-db` fails with a `CallbackFailure` naming the point and the part — as a failing `on-start-api`
 * does (`registerModuleApis`) —, its error the cause: the refusal's reason names them (AE-5).
 */
function namedStartDb(part: MigrationPart): MigrationPart {
  const setup = part.onStartDb;
  if (setup === undefined) return part;
  return {
    ...part,
    onStartDb: async (w) => {
      try {
        await setup(w);
      } catch (error) {
        throw new CallbackFailure("on-start-db", part.id, error);
      }
    },
  };
}

/** Resolves after `ms`, or as soon as `signal` aborts. */
function pause(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const done = (): void => {
      clearTimeout(timer);
      signal.removeEventListener("abort", done);
      resolve();
    };
    const timer = setTimeout(done, ms);
    signal.addEventListener("abort", done, { once: true });
  });
}

/** What startup leaves for the loop. */
interface Startup {
  readonly loop: FinalizedLoop;
  readonly started: StartedProcess;
}

/** What startup has once the database opened: what its later steps — run again on a retryable failure — need. */
interface Opened {
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  readonly checked: CheckedConfig;
  readonly core: CheckedEntry;
  readonly source: BlockSource;
  readonly db: Database;
}

/** A process (see the module comment). */
class Process implements ProcessHandle {
  readonly started: Promise<StartedProcess>;
  readonly ended: Promise<ProcessingEnd>;
  readonly closed: Promise<void>;
  readonly #input: ProcessInput;
  readonly #stop = new AbortController();
  #resolveClosed!: () => void;
  #closing: Promise<void> | undefined;
  #phase: StatusFacts["phase"] = "starting";
  #redactor: Redactor | undefined;
  #core: CheckedEntry | undefined;
  #start: bigint | null = null;
  #cursor: bigint | null = null;
  #head: bigint | null = null;
  #upgrade: UpgradeBoundary | null = null;
  #conditions: ProcessCondition[] = [];
  #end: ProcessingEnd | null = null;
  #reason: ProcessReason | null = null;
  /** The failure being retried (IN-10), and the failures since startup completed or a height committed. */
  #retrying: RetryCondition | null = null;
  #attempts = 0;
  #db: Database | undefined;
  #source: BlockSource | undefined;
  #api: StartedModuleApi | undefined;
  readonly #admin: ProcessAdmin | undefined;
  /** The process's one node client (task 10.3), shared by `core-chain`'s `node-client` item and the block source. */
  #nodeClient: NodeClient | null = null;

  constructor(input: ProcessInput) {
    this.#input = input;
    const { admin } = input;
    this.#admin =
      admin === false
        ? undefined
        : new ProcessAdmin({
            status: () => this.status(),
            log: (line) => this.#log(line),
            side: input.side ?? "public",
            ...(typeof admin === "function" ? { start: admin } : {}),
          });
    this.closed = new Promise((resolve) => {
      this.#resolveClosed = resolve;
    });
    const startup = this.#startup();
    this.started = startup.then(({ started }) => started);
    // `ended` tells a refusal too: a caller that awaits only `ended` leaves no rejection unhandled.
    this.started.catch(() => undefined);
    this.ended = this.#run(startup);
    this.#admin?.follow(startup, this.ended);
    const { signal } = input;
    if (signal?.aborted === true) void this.stop();
    else signal?.addEventListener("abort", () => void this.stop(), { once: true });
  }

  status(): ProcessStatus {
    const settings = this.#core?.settings;
    return statusOf({
      phase: this.#phase,
      start: this.#start,
      cursor: this.#cursor,
      head: this.#head,
      followingThreshold: (settings?.followingThreshold as number | undefined) ?? 0,
      readinessLag: (settings?.readinessLag as number | undefined) ?? null,
      conditions: [
        ...this.#conditions,
        ...(this.#source?.conditions?.() ?? []),
        ...(this.#retrying === null ? [] : [this.#retrying]),
      ],
      ended: this.#end,
      reason: this.#reason,
    });
  }

  stop(): Promise<void> {
    this.#closing ??= this.#close();
    return this.#closing;
  }

  /** {@link stop}'s work. */
  async #close(): Promise<void> {
    this.#phase = "stopping";
    this.#admin?.publish();
    this.#stop.abort();
    await this.ended;
    try {
      await this.#api?.close();
    } finally {
      await this.#closeNode();
      await this.#db?.close();
      await this.#source?.close?.();
      if (this.#admin !== undefined) await this.#admin.close();
      this.#resolveClosed();
    }
  }

  /** Closes the process's node client (every call and subscription ends with `handle-closed`). */
  async #closeNode(): Promise<void> {
    await this.#nodeClient?.close();
  }

  /** A log line, through the configuration's redaction once it is known. */
  #log(text: string): void {
    (this.#input.log ?? standardError)(this.#redactor === undefined ? text : this.#redactor.text(text));
  }

  /** Throws the stop's reason when the process is stopping: startup's steps end there. */
  #step(): void {
    this.#stop.signal.throwIfAborted();
  }

  /** The condition `waiting-for-node` while startup waits for the node (`wait`), removed when the wait ends (null). */
  #waiting(wait: NodeWait | null): void {
    this.#conditions = this.#conditions.filter((condition) => condition.code !== "waiting-for-node");
    if (wait !== null) this.#conditions.push(Object.freeze({ code: "waiting-for-node", ...wait }));
  }

  /** Startup (see the module comment); on a refusal or a stop, closes what it opened and rejects. */
  async #startup(): Promise<Startup> {
    // Begins on the next microtask, so that a signal aborted before `startProcess` returned stops it before anything.
    await Promise.resolve();
    const input = this.#input;
    try {
      this.#step();
      const declarations = validateDeclarations(input.declarations);
      const given = input.config ?? {};
      const loaded =
        "data" in given ? { file: given.file, data: plainData(given.data, given.file) } : await loadConfig(given);
      this.#admin?.loaded({ config: loaded, declarations, side: input.side ?? "public" });
      this.#step();
      const checked = validateConfig({ config: loaded, declarations, side: input.side ?? "public" });
      this.#redactor = configRedactor(checked);
      this.#start = BigInt(checked.start);
      const core = (input.processCore ?? processCoreEntry)(checked);
      this.#core = core;
      if (this.#admin !== undefined) {
        await this.#admin.serve(checked, core);
        this.#step();
      }
      const nodeOptions = nodeOptionsOf(core.settings as PlainObject);
      this.#nodeClient = nodeOptions === null ? null : new NodeClient(nodeOptions);
      const source =
        typeof input.source === "function" ? input.source(core, { nodeClient: this.#nodeClient }) : input.source;
      this.#source = source;
      // A read's height is the cursor's (DB-2): the core's cursor table, or a private process's own (its source's).
      const db = await openConfiguredDatabase(core, { committedHeight: source.committedHeight ?? cursorHeight });
      this.#db = db;
      for (;;) {
        this.#step();
        try {
          const startup = await this.#open({ declarations, checked, core, source, db });
          this.#recovered();
          return startup;
        } catch (error) {
          const code = retryOf(error);
          if (code === null || !(await this.#retry("startup", code, error, null))) throw error;
        }
      }
    } catch (error) {
      if (!this.#stop.signal.aborted) {
        const { code } = reasonOf(error);
        this.#log(`startup refused: ${code}${this.#redactor === undefined ? "" : `: ${messageOf(error)}`}`);
        if (this.#admin !== undefined) await this.#admin.refused();
      }
      // The module API opens in the last step, after which only a stop throws: the stop closes it.
      await this.#closeNode();
      await this.#db?.close();
      await this.#source?.close?.();
      throw error;
    }
  }

  /** Startup's steps once the database opened (4 to 7 of the module comment), run again after a retryable failure. */
  async #open({ declarations, checked, core, source, db }: Opened): Promise<Startup> {
    const input = this.#input;
    const settings = core.settings as PlainObject;
    const { durabilityWarnings } = await startWriter(db);
    for (const warning of durabilityWarnings) this.#log(`durability: ${warning.message}`);
    this.#step();
    const { cursor, history, identity } = await db.read(async (read) => ({
      cursor: await source.cursor(read),
      history: await readHistory(read),
      identity: await readIdentity(read),
    }));
    this.#step();
    this.#cursor = cursor?.height ?? null;
    const check = checkHistory({ config: checked, cursor: this.#cursor, declarations, history });
    const waiting = (wait: NodeWait | null): void => this.#waiting(wait);
    // A private process's source checks its chain itself (PP-1: it never talks to the node).
    const { genesisHash } = await (input.checkChain ?? source.checkChain?.bind(source) ?? checkChain)({
      source,
      identity,
      cursor,
      configured: configuredGenesisOf(settings),
      signal: this.#stop.signal,
      onWaiting: waiting,
    });
    this.#step();
    const graph = resolveGraph(graphInputOf(check, declarations));
    const plan = schemaPlan(graph.modules);
    const contexts = new ProcessContexts({ graph, revisionsOf: processRevisions(check, core) });
    const start = BigInt(checked.start);
    // Every build has core-chain, the first backbone part (`contexts.of` throws for a graph without it); a retried
    // startup binds its new contexts, the node client kept.
    bindCoreChain(contexts.of(CORE_CHAIN_ID), {
      config: checked,
      declarations,
      cursor: this.#cursor,
      db,
      start,
      genesisHash,
      nodeClient: this.#nodeClient,
      ledgerTable: settings.ledgerTable as unknown as LedgerTable,
    });
    if (graph.modules.some((part) => part.id === CORE_BLOCK_FETCH_ID) && isBlockItemSource(source)) {
      bindCoreBlockFetch(contexts.of(CORE_BLOCK_FETCH_ID), source);
    }
    if (graph.modules.some((part) => part.id === CORE_CHAIN_EVENTS_ID) && isBlockEventSource(source)) {
      bindCoreChainEvents(contexts.of(CORE_CHAIN_EVENTS_ID), source);
    }
    await startDatabase(db, {
      plan,
      parts: graph.modules.map((part) => namedStartDb(contexts.startDbPart(part))),
      committedVersions: check.committedVersions,
      handles: { height: this.#cursor },
    });
    this.#step();
    contexts.seal();
    // `/status` and `/config` show the database's parts from here on, and what startup read (AE-5, tasks 8.3, 8.4).
    this.#admin?.opened({
      declarations,
      modules: graph.modules,
      revisionsOf: processRevisions(check, core),
      db,
      check,
      history,
      genesisHash,
    });
    // The bootstrap's wait (IN-2): every bootstrap step has run, and nothing is processed until block S commits; before
    // the module API, so that a retried startup (a node unreachable meanwhile) never finds it listening.
    if (cursor === null) await waitForNode(source, start, this.#stop.signal, waiting);
    this.#step();
    const { api: address } = settings.listen as { readonly api?: string };
    this.#api = await startModuleApi({
      graph,
      contexts,
      db,
      ...(address === undefined ? {} : { address }),
      apiReadTimeoutMs: settings.apiReadTimeoutMs as number,
      onError: (error, where) => this.#log(`module API: ${where.route} of ${where.module} failed: ${messageOf(error)}`),
    });
    this.#step();
    this.#upgrade = upgradeBoundary(check, declarations);
    const Loop = input.loop ?? FinalizedLoop;
    const loop = new Loop({
      db,
      graph,
      plan,
      source,
      contextOf: (id) => contexts.of(id),
      misuses: contexts,
      signal: this.#stop.signal,
      coreStop: core.stop === null ? null : BigInt(core.stop),
      boundary: this.#upgrade?.height ?? null,
      observer: {
        head: (head) => {
          this.#head = head.height;
          // Nothing to process (the loop waits): whatever was retried works again.
          if (head.height < (this.#cursor === null ? graph.start : this.#cursor + 1n)) this.#recovered();
        },
        committed: (block) => {
          this.#cursor = block.height;
          this.#recovered();
          this.#admin?.committed();
        },
      },
    });
    const { server } = this.#api;
    const api = server === null ? null : Object.freeze({ host: server.host, port: server.port });
    // Not stopping (the step above): from here on a stop finds the loop running.
    this.#phase = "running";
    return { loop, started: Object.freeze({ core, api }) };
  }

  /**
   * IN-10's retry of `error`, which `where` met at `height` (`code` its condition): the condition raised, the failure
   * logged, the back-off waited — ended at once by a stop. Resolves true to run again, false when the process stops.
   */
  async #retry(where: "startup" | "processing", code: RetryCode, error: unknown, height: bigint | null): Promise<boolean> {
    if (this.#stop.signal.aborted) return false;
    this.#attempts += 1;
    const delay = backoffDelay(this.#attempts, (this.#core?.settings as PlainObject).backoffCeilingMs as number);
    this.#retrying = Object.freeze({ code, attempts: this.#attempts, height });
    this.#log(`${where} retries in ${delay} ms (${code}, attempt ${this.#attempts}): ${messageOf(error)}`);
    await pause(delay, this.#stop.signal);
    return !this.#stop.signal.aborted;
  }

  /** What was retried works again: no condition, and the next retry's back-off starts from 1 s. */
  #recovered(): void {
    this.#retrying = null;
    this.#attempts = 0;
  }

  /** Records why startup refused or processing halted, and enters that state unless the process is stopping. */
  #fail(phase: "refused" | "halted", error: unknown): ProcessReason {
    const reason = reasonOf(error);
    this.#reason = reason;
    this.#retrying = null;
    if (this.#phase !== "stopping") this.#phase = phase;
    return reason;
  }

  /** Startup, then the loop: resolves with how processing ended (see {@link ProcessingEnd}). */
  async #run(startup: Promise<Startup>): Promise<ProcessingEnd> {
    let loop: FinalizedLoop;
    try {
      ({ loop } = await startup);
    } catch (error) {
      if (this.#stop.signal.aborted) return this.#ended({ kind: "signal" });
      this.#fail("refused", error);
      return this.#ended({ kind: "refused", error });
    }
    let end: LoopEnd;
    for (;;) {
      try {
        end = await loop.run();
        break;
      } catch (error) {
        const code = retryOf(error);
        if (code === null) {
          const { code: halt } = this.#fail("halted", error);
          this.#log(`processing halted (${halt}): ${messageOf(error)}`);
          return this.#ended({ kind: "failed", error });
        }
        const height = error instanceof HeightFailure ? error.height : null;
        if (!(await this.#retry("processing", code, error, height))) return this.#ended({ kind: "signal" });
      }
    }
    if (end.kind === "signal") return this.#ended(end);
    const upgrade = end.boundary === null ? null : this.#upgrade;
    if (upgrade !== null) this.#conditions.push(Object.freeze({ code: "upgrade-required", ...upgrade }));
    // A stop during the last height leaves the process stopping.
    if (this.#phase === "running") this.#phase = "stopped";
    const why = [end.core ? "the core's stop" : null, upgrade === null ? null : `an upgrade boundary at ${upgrade.height}`];
    this.#log(`processing stopped at ${end.height}: ${why.filter((text) => text !== null).join(" and ")}`);
    return this.#ended(Object.freeze({ kind: "stopped", height: end.height, core: end.core, upgrade }));
  }

  /** Records how processing ended. */
  #ended(end: ProcessingEnd): ProcessingEnd {
    this.#end = end;
    return end;
  }
}

/**
 * Starts a process (see the module comment): returns its handle at once, startup running — `started` tells when it
 * completed, `ended` how processing ended, `status()` the state meanwhile.
 */
export function startProcess(input: ProcessInput): ProcessHandle {
  return new Process(input);
}
