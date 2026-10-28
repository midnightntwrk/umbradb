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
 * 7. the graph resolved from the check (`resolveGraph`, `graphInputOf`; on a private process with the public core's
 *    `table` items its source's check read, PP-13, task 14.1a), the schema plan, the process contexts with each
 *    part's revisions ({@link processRevisions}), `core-chain` bound to its context with what startup checked and
 *    opened (`bindCoreChain`: the configuration, the declarations, the cursor, the database, S, the genesis hash, the
 *    node client, the revision's ledger table), `core-block-fetch` bound to the block source (`bindCoreBlockFetch`, when
 *    the source gives block items), and so is the core module `core-chain-events` when enabled (`bindCoreChainEvents`,
 *    when the source gives a block's events; task 11.1), and — when the graph has `core-block-parsed` or
 *    `core-ledger-state` — the vendored ledger packages checked (`checkLedgerPackages`, LG-5, task 12.2b:
 *    `package-hash-mismatch` naming a changed file, `invalid-configuration` naming a `ledgerSources` entry that is not
 *    `vendored`) and the process's ledger worker started (`startLedgerWorker`, once per process) and bound to
 *    them (`bindLedgerParser`; `bindCoreLedgerState`, with the source's ledger calls; task 12.3), the migrations and
 *    `on-start-db` (`startDatabase`, through each
 *    context's publishing window — `core-chain`'s records the history and the identity and publishes its `process`
 *    items —; a failing
 *    `on-start-db` names its point and module, a `CallbackFailure` as a failing `on-start-api`'s), the seal
 *    (`process-item-missing`);
 * 8. on a database without a cursor, the bootstrap's wait while S is above the node's finalized head (`waitForNode`,
 *    IN-2: still `starting`, with the condition `waiting-for-node`), every bootstrap step having run;
 * 9. `on-start-api` and the module API on `listen.api` (`startModuleApi`);
 * 10. the finalized loop, with the core's stop and RN-12's upgrade boundary ({@link upgradeBoundary}).
 * A refusal closes what startup opened — the node client, the ledger worker, the database, its writer lock released,
 * then the block source — and rejects {@link ProcessHandle.started} with it; the process stays up, `refused` with the
 * refusal's reason, until stopped (IN-12, AE-3). **A refusal of the configuration itself** — of steps 1 to 3, before
 * the process's `core` revision is known: the declarations, the configuration's loading, plain data and validation, the
 * choice of its revision — ends the process instead (owner decision Q137 B, task 8.1b): it logs every finding with its
 * path (`./configuration-refusal.ts`), opens no admin listener (no validated `listen.admin` exists), and is `refused`
 * with `closed` resolved, nothing left to stop; `umbradb run` then exits 1. Every later refusal stays up as above.
 * A retryable failure of steps 4 to 8 (`connection-lost`, `node-unreachable`) refuses nothing:
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
 * own conditions (`finality-stall` while the node source's queue is full, IN-6) are the process's too. `slow-block`
 * (RN-17, Q71; task 5.5) shows while the loop's height in progress has run longer than the process revision's
 * `slowBlockMs` — its height, the point it is in, the first module running there or null (the window and its limits
 * are `./loop.ts`'s) —, logged when raised and when that height commits or its run fails, and published at once each
 * time; nothing cuts the height off or retries it for its time. Likewise (owner decision Q145 B; task 5.5a) while
 * callbacks the loop awaits outside a height's processing have: a height's `on-after-db-write` and `on-stop-height`
 * after its commit (one window), an `on-finalized` (the height of the head it announces), RN-11's re-delivery at a
 * run's start (the cursor's height) — the same condition, cleared when its window ends; the log lines name the window.
 * The admin endpoints that show all this are tasks 8.1–8.3.
 *
 * **Retries** (IN-10, CORE-ARCH §4.6): a lost database connection (`connection-lost`) or an unreachable node
 * (`node-unreachable`) — the two retryable codes, wherever startup's later steps or the loop meet them — never halts or
 * refuses: the process raises the condition `database-retrying` or `node-retrying` with the attempts and the height,
 * waits IN-10's back-off (`backoffDelay`: 1 s doubling up to the process revision's `backoffCeilingMs`), and runs
 * again — startup from its database steps, or the same loop: a height the failure stopped after its `on-parse` is
 * processed again from `on-compute`, its earlier items kept, once the loop has read the cursor on the writer (whose new
 * session re-takes the lock, DB-11) and found the height not committed — or, after a lost `COMMIT` that landed, goes on
 * with its `on-after-db-write`; a cursor that is neither halts with `unexpected-cursor` (IN-11, task 10.4,
 * `./loop.ts`) —; any other failure runs the loop from the cursor, which it re-delivers (RN-11). The condition clears,
 * and the back-off starts again from 1 s, once startup completes, a height commits or the loop finds nothing to
 * process. A stop ends the wait at once. The node client retries its own calls and its connection without limit with
 * the same back-off (`../node/client.ts`), so a finalized call never fails with `node-unreachable`: while it retries,
 * the process shows `node-retrying` too — with the most attempts the client counted for one call or the connection
 * since it began retrying, and the height the loop processes or waits for (null during startup) — and logs each of its
 * retries (`node retries in <ms> ms (node-retrying, <call or connect>, attempt <n>): …`); the condition clears when the
 * client stops retrying.
 *
 * **SIGTERM** (RN-13): {@link terminationSignal} gives the signal SIGTERM aborts; aborting
 * {@link ProcessInput.signal}, or calling {@link ProcessHandle.stop}, enters `stopping`, aborts the loop's signal — the
 * loop finishes the height in progress, so a block whose transaction is open commits, and starts no other —, awaits
 * it, then closes the module API (WebSocket clients get 1001, every connection ends), the node client, the database and
 * the block source. During startup it stops before the next step and ends every wait for the chain at once (RN-13 as
 * amended; task 5.3b): it closes the node client and the block source first, so each node call startup awaits ends,
 * an unreachable node's retries included, no connection is attempted after the stop, and on a private process a wait
 * for its public side ends too. Once the loop runs it closes the node client at the stop when no block transaction is
 * open, else as soon as the open one has committed or rolled back (RN-13 as amended; task 5.3c): a node call the loop
 * awaits outside a transaction — the next height's block through the node source's prefetch, the state root
 * `core-ledger-state`'s `on-compute` awaits — ends with `handle-closed`, its retries included, and processing ends with
 * the signal; the height in progress stores nothing and is processed again after a restart (after its commit, its later
 * points are re-delivered then, RN-11).
 *
 * **The pause, and the backup on SIGUSR2** (BK-1 as amended, owner decision Q152 B; task 15.1a): the loop pauses
 * between heights while a hold of the process's {@link LoopPauses} is kept (`./pause.ts`, `./loop.ts`) —
 * {@link ProcessHandle.pause} takes one until {@link ProcessHandle.resume} —, and a process whose `core` revision sets
 * `backupOnSignal` (CF-4) listens for SIGUSR2 ({@link ProcessInput.backupSignals}: Node.js's `process` unless given) from
 * the moment that revision is known until it has closed: each SIGUSR2 takes a hold, writes the backup of the cursor's
 * height once the loop is paused there — by the backup at stop's rules (`backupAtStop`, `../backup/backup.ts`) — and
 * releases it, so processing goes on from the next height; all of it logged. A SIGUSR2 while one is pending or being
 * written adds none; after processing ended (the core's stop, a halt) it writes at once; while stopping, or after a
 * refused startup, it writes none. A stop waits for a backup being written before it closes the database.
 *
 * **A private process** (`side: "private"`, PP-1; task 14.1) starts the same way with the private `core` schema (CF-4):
 * its block source is `core-private-source`'s (`src/backbone/core-private-source/`), whose cursor and committed height
 * are the private cursor's and whose blocks are the public database's; step 6 is that source's own check (it reads the
 * public database's chain identity, whose genesis hash `core-chain` records; PP-2's binding is the part's), the
 * bootstrap's wait of step 8 waits for the public cursor to reach the private S, and the source is closed with the
 * database.
 *
 * **The configuration hash** (RN-16, PP-14, owner decision Q147; task 14.1b): read once at startup, after step 7's
 * `on-start-db` recorded the configuration (`readConfigHash`: the hash of the process's own `core_chain.config`), and
 * kept in memory for the run: the module API sets it as `X-Umbra-Config-Hash` on every answer, and the core's transport
 * sends it on its messages.
 *
 * **The process transport** (PP-4; task 14.2, `../private/core-transport.ts`): a public process whose `core` revision
 * has `listen.transport` starts it once its database is open and its chain known (step 7, before the bootstrap's wait),
 * tells it each commit (`committed`), and closes it at its stop or at a refusal; a listener that cannot listen refuses
 * startup (`listen-failed`). A private process's side of it is its block source's (`openPublicSide`), which the
 * process gives S and its log ({@link SourceShared}).
 *
 * **Lockstep** (PP-6, PP-7; task 14.3, `../private/lockstep.ts`): a public process whose `core` revision lists
 * `lockstepInstances` keeps one bookkeeping of them for its run, which its transport tells of their `hello`s, reports
 * and closes, and which the loop awaits before each block's `BEGIN` (`LoopInput.lockstep`): while it waits the process
 * raises `waiting-for-lockstep`; with no `listen.transport` no listed instance can connect, and the core waits for them
 * (Q24). On a private process the source checks the resolved graph's modules after step 7's graph and before any
 * migration (`BlockSource.checkModules`: `needs-lockstep-not-listed`).
 *
 * **Logs** go through the configuration's redaction (`configRedactor`, CF-4, AE-6) once it is validated; a refusal of
 * the configuration itself, through the redaction of its secrets as the validation reads them (`earlyRedactor`: the
 * configuration as loaded, else the URL patterns only), finding by finding (`startup refused: <code> (<n> findings);
 * the process ends`, then `startup refused: <path>: <message> [<code>]` each). A later refusal, a halt and each retry
 * are logged with their reason's code (`startup refused: <code>: …`, `processing halted (<code>): …`,
 * `processing retries in <ms> ms (<condition>, attempt <n>): …`, `startup retries …`).
 *
 * **The admin endpoints** (AE-1, AE-2; task 8.1, `../admin/`), unless {@link ProcessInput.admin} is `false` (owner
 * decision Q128 B, task 8.1a): the heartbeat ticks from `startProcess` on and publishes `status()` to the admin worker;
 * the admin listener starts on `listen.admin` once the process's `core` revision is known, before the database opens
 * (a listener that cannot listen — an address another listener holds — refuses startup, `listen-failed`), and never
 * before (a refusal before that ends the process, above); it closes after the database at {@link ProcessHandle.stop},
 * and the heartbeat ends when a refusal of the configuration ends the process. `/status`'s node (AE-5; task 8.3a) shows
 * the node client's connection state — published at once when it changes, and once the client and the source are
 * made — and the block source's best head announced last and queue depth (`BlockSource.nodeView`).
 */

import { cursorHeight } from "../backbone/core-block-commit/core-block-commit.js";
import { bindCoreBlockFetch, CORE_BLOCK_FETCH_ID, isBlockItemSource } from "../backbone/core-block-fetch/core-block-fetch.js";
import { isBlockEventSource } from "../backbone/core-block-fetch/events.js";
import { bindLedgerParser, CORE_BLOCK_PARSED_ID } from "../backbone/core-block-parsed/core-block-parsed.js";
import { isBlockLedgerSource } from "../backbone/core-block-fetch/ledger-source.js";
import { bindCoreChainEvents, CORE_CHAIN_EVENTS_ID } from "../backbone/core-chain-events/core-chain-events.js";
import { bindCoreLedgerState, CORE_LEDGER_STATE_ID } from "../backbone/core-ledger-state/core-ledger-state.js";
import {
  bindCoreChain,
  type ChainCheck,
  type ChainCheckInput,
  checkChain,
  configuredGenesisOf,
  CORE_CHAIN_ID,
  type NodeWait,
  nodeOptionsOf,
  readConfigHash,
  readHistory,
  readIdentity,
  waitForNode,
} from "../backbone/core-chain/index.js";
import { readinessOf } from "../backbone/core-health/readiness.js";
import { publicLockstepOf } from "../backbone/core-private-source/index.js";
import { buildCoreVersion, type CoreVersion } from "../config/build.js";
import type { ProcessSide } from "../config/core-settings.js";
import { openConfiguredDatabase } from "../config/database.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { checkHistory, graphInputOf, type HistoryCheck, versionText } from "../config/history.js";
import { loadConfig, type LoadOptions } from "../config/load.js";
import { resolve } from "node:path";
import { type PlainObject, plainData } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import { configRedactor, type Redactor } from "../config/redact.js";
import { type CheckedConfig, type CheckedEntry, type ConfigInput, validateConfig } from "../config/validate.js";
import type { Database, ReadHandle } from "../db/api.js";
import { type MigrationPart, startDatabase } from "../db/migrate.js";
import { startWriter } from "../db/writer-lock.js";
import { checkLedgerPackages, type VerifyLedgerPackagesOptions } from "../ledger/identity.js";
import type { LedgerTable } from "../ledger/version-table.js";
import { bindLedgerTasks, hasLedgerTasks, withLedgerTaskPoints } from "../ledger/tasks.js";
import { type LedgerHost, startLedgerWorker } from "../ledger/worker/host.js";
import { schemaPlan } from "../modules/adapters.js";
import type { ModuleDeclaration, PointName, Revision } from "../modules/declaration.js";
import { backoffDelay } from "../node/backoff.js";
import { type PrivateSideFacts, ProcessAdmin } from "../admin/process-admin.js";
import { type NodeFacts, utcText } from "../admin/snapshot.js";
import { earlyRedactor } from "../admin/redaction.js";
import type { AdminStarter } from "../admin/server.js";
import { NodeClient, type NodeClientOptions, type NodeRetry } from "../node/client.js";
import { resolveGraph } from "../modules/graph.js";
import { type DeclarationSet, validateDeclarations } from "../modules/validation.js";
import { type StartedModuleApi, startModuleApi } from "./api-server.js";
import type { BlockRef, BlockSource, SourceCondition } from "./block-source.js";
import { configurationRefusalLines } from "./configuration-refusal.js";
import { CallbackFailure, isBackbonePart } from "./dispatch.js";
import { type ProcessReason, reasonOf, type RetryCode, retryOf } from "./failures.js";
import {
  FinalizedLoop,
  HeightFailure,
  type LoopEnd,
  type LoopInput,
  type SlowBlockEvent,
  type SlowWindow,
} from "./loop.js";
import { LoopPauses, type PauseBy, type PauseHold } from "./pause.js";
import { ProcessContexts } from "./process-context.js";
import { type CoreTransport, startCoreTransport, type TransportTls } from "../private/core-transport.js";
import { type BackupInput, type BackupSeams, type BackupWritten, backupAtStop, writeBackup } from "../backup/backup.js";
import { databaseTarget } from "../config/database.js";
import { handleClosed, UmbraError } from "../db/errors.js";
import type { TableName } from "../deterministic-postgresql/index.js";
import { privateInstancesOf } from "../private/instances.js";
import { Lockstep, type LockstepCondition } from "../private/lockstep.js";

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
   * The tests' node client: makes the process's one client from the options the process gives it (the `core`
   * revision's, with the process's `onRetry` and `onRetryingChange`) — on a clock of the test's own; `new
   * NodeClient(options)` unless given.
   */
  readonly nodeClient?: (options: NodeClientOptions) => NodeClient;
  /**
   * The admin endpoints (AE-1, AE-2; `../admin/`), served unless `false` (decision record Q128 B: opt-out): absent or
   * `true` serves them on `listen.admin` from the admin worker, with the heartbeat, from startup until
   * {@link ProcessHandle.stop}; a starter serves them through it (the negative controls'). A program or a test that
   * starts several processes gives each its own `listen.admin` (port 0 for a free one) or opts out: a second process
   * on one address refuses startup with `listen-failed` before its database opens.
   */
  readonly admin?: boolean | AdminStarter;
  /**
   * The process's ledger worker (LG-10, task 12.3): started when the graph has `core-block-parsed` or
   * `core-ledger-state`, with `startLedgerWorker` unless given (a test package's, a negative control's), and closed with
   * the process.
   */
  readonly ledgerWorker?: () => LedgerHost;
  /**
   * The startup check of the vendored ledger packages (LG-5, A173; task 12.2b), given the `core` revision's
   * `ledgerSources` before the ledger worker starts: `checkLedgerPackages` (`../ledger/identity.ts`) unless given (a
   * test's, over a copy of the packages; a negative control's, which checks nothing).
   */
  readonly checkLedgerPackages?: (options: VerifyLedgerPackagesOptions) => void;
  /**
   * The process's configuration hash (RN-16, PP-14; task 14.1b), read once at startup after `core-chain` recorded the
   * configuration: `readConfigHash` of its own database unless given (a negative control's, over its secrets).
   */
  readonly configHash?: (read: ReadHandle, core: CheckedEntry) => Promise<string>;
  /**
   * The public configuration hash the operator accepts for this start (`umbradb run --update-hash`; PP-14, owner
   * decision Q159, task 14.1c): a private process's source records it after the full checks when it is the hash the
   * start finds in place of the one the private database accepted; given to the block source ({@link SourceShared}),
   * which a public process's ignores.
   */
  readonly updateHash?: string;
  /**
   * Where SIGUSR2 comes from for the `core` revision's `backupOnSignal` (CF-4, BK-1, owner decision Q152 B; task 15.1a):
   * Node.js's `process` unless given (a test's emitter). Listened to only when `backupOnSignal` is set, from the moment the
   * process's `core` revision is known until the process has closed (see the module comment).
   */
  readonly backupSignals?: BackupSignals;
}

/** What delivers SIGUSR2 for `backupOnSignal` (task 15.1a): Node.js's `process`, or a test's emitter. */
export interface BackupSignals {
  on(event: "SIGUSR2", listener: () => void): unknown;
  removeListener(event: "SIGUSR2", listener: () => void): unknown;
}

/** What the process shares with the block source it makes (task 10.3): its one node connection, S and its log. */
export interface SourceShared {
  /** The node client made from the process's `core` revision (`nodeOptionsOf`), or null for a revision with no node. */
  readonly nodeClient: NodeClient | null;
  /** S, the database's start (a private process's `hello` before its first commit gives S − 1; task 14.2). */
  readonly start: bigint;
  /** The process's log, redacted (a private source's transport logs its connections; task 14.2). */
  readonly log: (line: string) => void;
  /** {@link ProcessInput.updateHash}, when given (a private source's; task 14.1c). */
  readonly updateHash?: string;
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
 * commit, at `height` (null at startup, or at the loop's cursor read); or the node client retries
 * (`node-retrying`), its most attempts for one call or the connection since it began, at the height the loop processes
 * or waits for (null at startup).
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
 * The condition `slow-block` (RN-17, AE-3, Q71; task 5.5): the height in progress has run longer than `slowBlockMs`
 * (`./loop.ts`'s window) — or, owner decision Q145 B (task 5.5a), callbacks the loop awaits outside a height's
 * processing have: the points after its commit, an `on-finalized` (`height` the head's), RN-11's re-delivery —;
 * `point` is the point it is in, `module` the first module whose callback runs there, null while none runs. Cleared
 * when its window ends: the height commits or its run fails, the callbacks end or fail; nothing cuts anything off.
 */
export interface SlowBlockCondition {
  readonly code: "slow-block";
  readonly height: bigint;
  readonly point: PointName;
  readonly module: string | null;
}

/** How the log names a window outside a height's processing (Q145 B): when it is raised, and when it ended. */
const SLOW_WINDOW_NAMES: Readonly<
  Record<Exclude<SlowWindow, "height">, { readonly raised: string; readonly ended: string }>
> = {
  "after-commit": { raised: "after its commit", ended: "points after its commit" },
  finalized: { raised: "the new finalized head", ended: "on-finalized" },
  redelivery: { raised: "its re-delivery at the run's start", ended: "re-delivery" },
};

/**
 * The condition `paused` (AE-3 as amended, owner decision Q174 B; task 8.3b): the finalized loop is paused between
 * heights (BK-1, `./pause.ts`) — `since` the time it paused, RFC 3339 text in UTC (Q68); `by` `pause` while a
 * {@link ProcessHandle.pause} is kept, else `signal` (a backup on SIGUSR2). Gone once the loop runs again; like every
 * condition, it changes no readiness (AE-4).
 */
export interface PausedCondition {
  readonly code: "paused";
  readonly since: string;
  readonly by: PauseBy;
}

/**
 * The process's conditions (AE-3); the block source's own (`finality-stall`, IN-6) among them, `slow-block` (task 5.5),
 * `waiting-for-lockstep` (PP-6, task 14.3) and `paused` (task 8.3b).
 */
export type ProcessCondition =
  | UpgradeCondition
  | RetryCondition
  | WaitingCondition
  | SourceCondition
  | SlowBlockCondition
  | LockstepCondition
  | PausedCondition;

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
   * database, closed. During startup the node client and the block source are closed first, so every wait of startup
   * for the chain ends at once (task 5.3b); once the loop runs the node client is closed first — when a block
   * transaction is open, once it has committed or rolled back —, so every node call the loop awaits outside one ends at
   * the stop (task 5.3c). Resolves once all of it is done; calling it again returns the same
   * promise. After a refusal of the configuration ended the process, it returns {@link closed}, the state left
   * `refused`.
   */
  stop(): Promise<void>;
  /**
   * Resolves once {@link stop} completed, or once a refusal of the configuration itself ended the process (owner
   * decision Q137 B: see the module comment).
   */
  readonly closed: Promise<void>;
  /**
   * Writes a backup of the process's database at its committed height to the file `out` (BK-1; `../backup/`), while
   * processing runs or after it ended: on PostgreSQL in one read's snapshot beside the commits, on PGlite as one job of
   * the database's queue, so commits wait for it. Resolves with the backup once its file is complete; rejects with
   * startup's refusal, with `handle-closed` once the process is stopping, and with the backup's refusals
   * (`private-backup-refused`, `backup-tools-missing`, `no-committed-height`), writing no file. `seams` are the
   * negative controls' only (`BackupSeams`: a dump outside the manifest's snapshot), not for programs.
   */
  backup(out: string, seams?: BackupSeams): Promise<BackupWritten>;
  /**
   * Pauses the finalized loop between heights (BK-1 as amended, owner decision Q152 B; task 15.1a): at its next point
   * between two heights — no transaction open, every read of the height before ended; at once while it waits for the
   * head — it stops, and starts nothing (no head read, no point, no height) until {@link resume}. Reads go on meanwhile:
   * the module API, the admin endpoints, a {@link backup}. Resolves once the loop is paused, once processing has ended
   * (nothing processes then), or once `resume()` came first; asked again before `resume()`, the same pause. A stop while
   * paused ends the process (RN-13).
   */
  pause(): Promise<void>;
  /**
   * Lets the loop go on after {@link pause}, from the next height; a backup on SIGUSR2 being written keeps it paused
   * until written. Without a pause, nothing.
   */
  resume(): void;
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

/** Node.js's `process` as the source of SIGUSR2, or undefined where there is none (a browser's worker). */
function nodeSignals(): BackupSignals | undefined {
  const node = (globalThis as { readonly process?: Partial<BackupSignals> }).process;
  return typeof node?.on === "function" ? (node as BackupSignals) : undefined;
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

/**
 * Whether `error`, a failure of the loop, came from a call on the node client after it was closed — `handle-closed` of
 * the node client, itself or the cause of what failed (a callback's, a height's) —, which only the process's stop does
 * while the loop runs (task 5.3c).
 */
function nodeClientClosed(error: unknown): boolean {
  let cause = error;
  for (let depth = 0; depth < 8 && cause instanceof Error; depth++) {
    if (cause instanceof UmbraError && cause.code === "handle-closed" && cause.details.handle === "node-client") {
      return true;
    }
    cause = cause.cause;
  }
  return false;
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
  /** While the node client retries (IN-10): the most attempts it reported since it began; null while it does not. */
  #nodeAttempts: number | null = null;
  #db: Database | undefined;
  #source: BlockSource | undefined;
  #api: StartedModuleApi | undefined;
  readonly #admin: ProcessAdmin | undefined;
  /** The process's one node client (task 10.3), shared by `core-chain`'s `node-client` item and the block source. */
  #nodeClient: NodeClient | null = null;
  /** The node client's close, once begun (`#closeNode`). */
  #nodeClosed: Promise<void> | undefined;
  /** The process's ledger worker (task 12.3), once its graph needs one; kept across a retried startup. */
  #ledger: LedgerHost | undefined;
  /** A public process's process transport on `listen.transport` (PP-4; task 14.2, `../private/core-transport.ts`). */
  #transport: CoreTransport | undefined;
  /** The loop startup made (its slow height, RN-17). */
  #loop: FinalizedLoop | undefined;
  /** A public process's bookkeeping of its `lockstepInstances` (PP-6; task 14.3), once startup read them. */
  #lockstep: Lockstep | undefined;
  /** The schema plan's tables declared `deterministic: false` (Q76), for a backup's contents hash (BK-2). */
  #optedOut: readonly TableName[] = [];
  /**
   * The holds that pause the loop between heights (BK-1, Q152 B; task 15.1a): {@link pause}'s and SIGUSR2's; a change
   * of the pause `/status` shows is published at once (Q174 B; task 8.3b).
   */
  readonly #pauses = new LoopPauses({ onChange: () => this.#admin?.publish() });
  /** {@link pause}'s hold, until {@link resume}. */
  #pauseHold: PauseHold | undefined;
  /** The backup on SIGUSR2 pending or being written, until it ended (never rejects). */
  #signalBackup: Promise<void> | undefined;
  /** Stops listening for SIGUSR2, once the process listens. */
  #unlisten: (() => void) | undefined;

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
            privateSide: () => this.#privateSide(),
            node: () => this.#nodeFacts(),
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
    const lockstep = this.#lockstep?.condition() ?? null;
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
        ...this.#slowBlock(),
        ...this.#paused(),
        ...(lockstep === null ? [] : [lockstep]),
        ...(this.#retrying === null ? [] : [this.#retrying]),
        ...(this.#nodeAttempts === null || this.#retrying?.code === "node-retrying"
          ? []
          : [this.#nodeRetrying(this.#nodeAttempts)]),
      ],
      ended: this.#end,
      reason: this.#reason,
    });
  }

  stop(): Promise<void> {
    this.#closing ??= this.#close();
    return this.#closing;
  }

  async backup(out: string, seams: BackupSeams = {}): Promise<BackupWritten> {
    await this.started;
    if (this.#closing !== undefined || this.#db === undefined) throw handleClosed("database");
    return writeBackup(this.#backupInput(resolve(out)), seams);
  }

  pause(): Promise<void> {
    this.#pauseHold ??= this.#pauses.hold("pause");
    return this.#pausedOrEnded(this.#pauseHold);
  }

  resume(): void {
    const hold = this.#pauseHold;
    this.#pauseHold = undefined;
    hold?.release();
  }

  /** Resolves once the loop is paused for `hold`, or once processing has ended. */
  #pausedOrEnded(hold: PauseHold): Promise<void> {
    return Promise.race([hold.reached, this.ended.then(() => undefined)]);
  }

  /**
   * Listens for SIGUSR2 when the `core` revision sets `backupOnSignal` (BK-1, Q152 B; see the module comment), until
   * the process has closed.
   */
  #listenForBackups(core: CheckedEntry): void {
    const out = (core.settings as PlainObject).backupOnSignal;
    if (typeof out !== "string") return;
    const signals = this.#input.backupSignals ?? nodeSignals();
    if (signals === undefined) {
      this.#log("backupOnSignal is set, but this process receives no signals: SIGUSR2 writes no backup here");
      return;
    }
    const listener = (): void => this.#onBackupSignal(out);
    signals.on("SIGUSR2", listener);
    this.#unlisten = () => void signals.removeListener("SIGUSR2", listener);
    this.#log(`SIGUSR2 writes a backup to ${out} at the loop's next pause (backupOnSignal)`);
  }

  /** A SIGUSR2 (see the module comment): a backup to `out` at the loop's next pause, unless one is pending. */
  #onBackupSignal(out: string): void {
    if (this.#closing !== undefined) {
      this.#log("SIGUSR2: no backup on signal, the process is stopping");
      return;
    }
    if (this.#signalBackup !== undefined) {
      this.#log(`SIGUSR2: a backup on signal to ${out} is already being written; this signal adds none`);
      return;
    }
    this.#log(`SIGUSR2: a backup to ${out} at the loop's next pause`);
    this.#signalBackup = this.#backupOnSignal(out).finally(() => {
      this.#signalBackup = undefined;
    });
  }

  /**
   * The backup on signal (BK-1, Q152 B): a hold on the loop; once it is paused — or processing ended —, the backup of
   * the cursor's height to `out` (relative to the working directory) by the backup at stop's rules; then the hold
   * released. Logged; never rejects.
   */
  async #backupOnSignal(out: string): Promise<void> {
    const hold = this.#pauses.hold("signal");
    try {
      await this.#pausedOrEnded(hold);
      if (this.#closing !== undefined) {
        this.#log("backup on signal not written: the process is stopping");
        return;
      }
      try {
        await this.started;
      } catch {
        this.#log("backup on signal not written: startup refused, so no database is open");
        return;
      }
      const height = this.#cursor;
      const how = this.#end === null ? "paused" : "ended";
      this.#log(
        `backup on signal: processing ${how} ${height === null ? "before any height committed" : `at height ${height}`}`,
      );
      const input = this.#backupInput(resolve(out));
      const { written, manifest } =
        height === null ? { written: true, ...(await writeBackup(input)) } : await backupAtStop(input, height);
      this.#log(
        written
          ? `backup on signal written to ${out}: height ${manifest.height}, contents hash ${manifest.contentsHash}`
          : `backup on signal: ${out} holds a backup of height ${height} already, so none was written`,
      );
    } catch (error) {
      const code = error instanceof UmbraError ? error.code : "error";
      this.#log(`backup on signal failed (${code}): ${messageOf(error)}; no backup was written`);
    } finally {
      hold.release();
    }
  }

  /** What a backup of the process's database is given (BK-1): its backend, its opted-out tables, its side and opt-in. */
  #backupInput(out: string): BackupInput {
    const settings = (this.#core as CheckedEntry).settings as PlainObject;
    const target = databaseTarget(String(settings.database));
    return {
      db: this.#db as Database,
      target: target.backend === "postgres" ? { backend: "postgres", url: target.url } : { backend: "pglite" },
      out,
      optedOut: this.#optedOut,
      side: this.#input.side ?? "public",
      developmentOptIn: settings.developmentOptIn === true,
    };
  }

  /**
   * The backup at stop (CORE-ARCH §4.15, BK-1): after the core's `on-stop-height`, to the `core` revision's
   * `backupAtStop` when set — relative to the working directory —, unless the file there is a backup of `height`
   * already; logged, a failure too, which leaves the process `stopped`.
   */
  async #backupAtStop(height: bigint): Promise<void> {
    const out = ((this.#core as CheckedEntry).settings as PlainObject).backupAtStop;
    if (typeof out !== "string" || this.#db === undefined) return;
    try {
      const { written, manifest } = await backupAtStop(this.#backupInput(resolve(out)), height);
      this.#log(
        written
          ? `backup at stop written to ${out}: height ${height}, contents hash ${manifest.contentsHash}`
          : `backup at stop: ${out} holds a backup of height ${height} already, so none was written`,
      );
    } catch (error) {
      const code = error instanceof UmbraError ? error.code : "error";
      this.#log(`backup at stop failed (${code}): ${messageOf(error)}; no backup was written`);
    }
  }

  /** {@link stop}'s work. */
  async #close(): Promise<void> {
    const starting = this.#phase === "starting";
    this.#phase = "stopping";
    this.#admin?.publish();
    this.#stop.abort();
    // The waits for the chain end now, not once startup or the loop has ended (RN-13; tasks 5.3b, 5.3c).
    const waits = starting ? this.#endStartupWaits() : this.#endLoopWaits();
    await this.ended;
    try {
      await this.#api?.close();
    } finally {
      await waits;
      await this.#transport?.close();
      await this.#closeNode();
      await this.#ledger?.close();
      // A backup on SIGUSR2 being written ends before the database closes (task 15.1a).
      await this.#signalBackup;
      await this.#db?.close();
      await this.#source?.close?.();
      if (this.#admin !== undefined) await this.#admin.close();
      this.#unlisten?.();
      this.#resolveClosed();
    }
  }

  /**
   * A stop during startup (RN-13 as amended; task 5.3b): ends every wait of startup for the chain at once, rather than
   * once startup has ended — which it does not while a node call retries an unreachable node without limit (IN-10).
   * The node client is closed, so each call startup awaits on it — `checkChain`'s blocks, the node source's
   * subscriptions and head read, a module's call in `on-start-db` — ends with `handle-closed` and no connection is
   * attempted after the stop; the block source is closed, which ends a wait for its head and, on a private process, a
   * wait for its public side (its transport's connection, its reads). A step cut short fails, its transaction rolled
   * back, and startup ends with the stop. Both are closed again with the rest; closing is idempotent. Never rejects.
   */
  async #endStartupWaits(): Promise<void> {
    await Promise.allSettled([this.#closeNode(), this.#source?.close?.()]);
  }

  /**
   * A stop once startup has completed (RN-13 as amended; task 5.3c): ends every node call the loop awaits outside a
   * block transaction — the next height's block through the node source's prefetch, the state root that
   * `core-ledger-state`'s `on-compute` awaits, a module's node call — rather than once the loop has ended, which
   * it does not while such a call retries an unreachable node without limit (IN-10). The node client is closed now
   * when the loop has no block transaction open (`FinalizedLoop.blockTransaction`), else as soon as that one has
   * committed or rolled back: each call on it ends with `handle-closed`, its retries and the client's reconnection
   * included, and no connection is attempted after. The loop's failure that follows ends processing with the signal
   * ({@link nodeClientClosed}). Never rejects.
   */
  async #endLoopWaits(): Promise<void> {
    const open = this.#loop?.blockTransaction() ?? null;
    if (open !== null) await open;
    await this.#closeNode().catch(() => undefined);
  }

  /**
   * Closes the process's node client (every call and subscription ends with `handle-closed`), once: a stop closes it
   * early (tasks 5.3b, 5.3c) and the closes after it await the same.
   */
  async #closeNode(): Promise<void> {
    if (this.#nodeClient === null) return;
    this.#nodeClosed ??= this.#nodeClient.close();
    await this.#nodeClosed;
  }

  /**
   * What `/status` shows of the private side (PP-9, AE-5; task 14.4): on the core, its private instances from its
   * lockstep bookkeeping and its transport; on a private process, whether its source is lockstep.
   */
  #privateSide(): PrivateSideFacts {
    return Object.freeze({
      instances: privateInstancesOf(this.#lockstep?.instances() ?? [], this.#transport?.instances() ?? []),
      lockstep: publicLockstepOf(this.#source),
    });
  }

  /**
   * What `/status` shows of the node besides `status()` (AE-5; task 8.3a): the node client's connection state, and the
   * best head announced last and the queue's depth as the block source reports them (`nodeView`); null without them.
   */
  #nodeFacts(): NodeFacts {
    const view = this.#source?.nodeView?.();
    return Object.freeze({
      bestHead: view?.bestHead ?? null,
      connection: this.#nodeClient?.connection ?? null,
      queueDepth: view?.queueDepth ?? null,
    });
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
    // The configuration as loaded, once it is: what a refusal of its validation is redacted with.
    let loadedInput: ConfigInput | undefined;
    try {
      this.#step();
      // A module's ledger tasks run through points of its own (task 12.6, LG-17: `src/ledger/tasks.ts`).
      const declarations = withLedgerTaskPoints(validateDeclarations(input.declarations));
      const given = input.config ?? {};
      const loaded =
        "data" in given ? { file: given.file, data: plainData(given.data, given.file) } : await loadConfig(given);
      loadedInput = { config: loaded, declarations, side: input.side ?? "public" };
      this.#step();
      const checked = validateConfig(loadedInput);
      this.#redactor = configRedactor(checked);
      this.#start = BigInt(checked.start);
      const core = (input.processCore ?? processCoreEntry)(checked);
      this.#core = core;
      this.#listenForBackups(core);
      if (this.#admin !== undefined) {
        await this.#admin.serve(checked, core);
        this.#step();
      }
      const nodeOptions = nodeOptionsOf(core.settings as PlainObject);
      const makeClient = input.nodeClient ?? ((options: NodeClientOptions) => new NodeClient(options));
      this.#nodeClient =
        nodeOptions === null
          ? null
          : makeClient({
              ...nodeOptions,
              onRetry: (retry) => this.#nodeRetry(retry),
              onRetryingChange: (retrying) => {
                if (!retrying) this.#nodeAttempts = null;
              },
              // `/status` shows a change of the connection at once (task 8.3a): the heartbeat may be a second away.
              onConnectionChange: () => this.#admin?.publish(),
            });
      const shared: SourceShared = {
        nodeClient: this.#nodeClient,
        start: BigInt(checked.start),
        log: (line) => this.#log(line),
        ...(input.updateHash === undefined ? {} : { updateHash: input.updateHash }),
      };
      const source = typeof input.source === "function" ? input.source(core, shared) : input.source;
      this.#source = source;
      // `/status` shows the client's `connecting` and the source's queue from now on (task 8.3a).
      this.#admin?.publish();
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
        if (this.#core === undefined) {
          // A refusal of the configuration itself (Q137 B): every finding logged; `#run` then ends the process.
          for (const line of configurationRefusalLines(error, earlyRedactor(loadedInput).text)) this.#log(line);
        } else {
          this.#log(`startup refused: ${reasonOf(error).code}: ${messageOf(error)}`);
        }
      }
      // The module API opens in the last step, after which only a stop throws: the stop closes it.
      await this.#transport?.close();
      await this.#closeNode();
      await this.#ledger?.close();
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
    const { genesisHash, publicItems } = await (input.checkChain ?? source.checkChain?.bind(source) ?? checkChain)({
      source,
      identity,
      cursor,
      configured: configuredGenesisOf(settings),
      signal: this.#stop.signal,
      onWaiting: waiting,
    });
    this.#step();
    // A private process's graph counts the public core's table items its source read (PP-13, task 14.1a).
    const graph = resolveGraph({ ...graphInputOf(check, declarations), ...(publicItems === undefined ? {} : { publicItems }) });
    // A private process's source refuses a module it cannot run (PP-6: needsLockstep on an instance not lockstep).
    source.checkModules?.(graph.modules);
    const plan = schemaPlan(graph.modules);
    this.#optedOut = plan.optedOut;
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
    // The ledger worker (task 12.3): core-block-parsed parses there, core-ledger-state applies there (LG-7, LG-10).
    const parses = graph.modules.some((part) => part.id === CORE_BLOCK_PARSED_ID);
    const applies = graph.modules.some((part) => part.id === CORE_LEDGER_STATE_ID);
    if (parses || applies) {
      // No ledger package is imported before it is checked (LG-5, A173; task 12.2b): a changed one, or a version
      // ledgerSources says is released, refuses startup here, before the worker starts and before block S.
      const sources = settings.ledgerSources as VerifyLedgerPackagesOptions["sources"];
      (input.checkLedgerPackages ?? checkLedgerPackages)(sources === undefined ? {} : { sources });
      this.#ledger ??= (input.ledgerWorker ?? startLedgerWorker)();
      // A request given no read (a parse) reads stored nodes through the process's database.
      this.#ledger.useDatabase({ read: (body) => db.read(body) });
      if (parses) bindLedgerParser(contexts.of(CORE_BLOCK_PARSED_ID), this.#ledger);
      for (const part of graph.modules) if (hasLedgerTasks(part)) bindLedgerTasks(contexts.of(part.id), this.#ledger);
      if (applies && isBlockLedgerSource(source)) {
        bindCoreLedgerState(contexts.of(CORE_LEDGER_STATE_ID), { ledger: this.#ledger, source });
      }
    }
    await startDatabase(db, {
      plan,
      parts: graph.modules.map((part) => namedStartDb(contexts.startDbPart(part))),
      committedVersions: check.committedVersions,
      handles: { height: this.#cursor },
    });
    this.#step();
    contexts.seal();
    // The configuration hash (RN-16, PP-14, Q147; task 14.1b): once, now that core-chain recorded the configuration,
    // kept in memory for the run — on X-Umbra-Config-Hash of every module API answer and the transport's messages.
    const configHash = await db.read((read) => (input.configHash === undefined ? readConfigHash(read) : input.configHash(read, core)));
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
    // The process transport (PP-4, task 14.2): a public process given listen.transport listens for private ones from
    // here on — before the bootstrap's wait, so that they connect before S commits —, once.
    const { transport: transportAddress } = settings.listen as { readonly transport?: string };
    const lockstepInstances = (settings.lockstepInstances as unknown as readonly string[] | undefined) ?? [];
    // Lockstep (PP-6, task 14.3): one bookkeeping for the run, which the transport tells and the loop waits on.
    if (this.#lockstep === undefined && lockstepInstances.length > 0) {
      this.#lockstep = new Lockstep({ listed: lockstepInstances, log: (line) => this.#log(line) });
    }
    if (this.#transport === undefined && (input.side ?? "public") === "public" && transportAddress !== undefined) {
      this.#transport = await startCoreTransport({
        address: transportAddress,
        tls: settings.tls as TransportTls | undefined,
        db,
        genesis: genesisHash,
        start,
        cursor: () => this.#cursor,
        lockstepInstances,
        ...(this.#lockstep === undefined ? {} : { lockstep: this.#lockstep }),
        readTimeoutMs: settings.apiReadTimeoutMs as number,
        configHash,
        log: (line) => this.#log(line),
      });
      this.#step();
    }
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
      configHash,
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
      slowBlockMs: settings.slowBlockMs as number,
      ...(this.#lockstep === undefined ? {} : { lockstep: this.#lockstep }),
      pause: this.#pauses,
      observer: {
        slow: (event) => this.#slowBlockEvent(event, settings.slowBlockMs as number),
        head: (head) => {
          this.#head = head.height;
          // Nothing to process (the loop waits): whatever was retried works again.
          if (head.height < (this.#cursor === null ? graph.start : this.#cursor + 1n)) this.#recovered();
        },
        committed: (block) => {
          this.#cursor = block.height;
          this.#recovered();
          this.#admin?.committed();
          this.#transport?.committed(block);
        },
      },
    });
    this.#loop = loop;
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

  /** One retry the node client scheduled (IN-10): its attempts counted for `node-retrying`, and a log line. */
  #nodeRetry(retry: NodeRetry): void {
    this.#nodeAttempts = Math.max(retry.attempt, this.#nodeAttempts ?? 0);
    const what = `node-retrying, ${retry.operation}, attempt ${retry.attempt}`;
    this.#log(`node retries in ${retry.delayMs} ms (${what}): ${messageOf(retry.error)}`);
  }

  /**
   * `node-retrying` while the node client retries: `attempts`, at the height the loop processes or waits for now — the
   * cursor + 1, S before the first block — or null outside processing (startup).
   */
  #nodeRetrying(attempts: number): RetryCondition {
    const height = this.#phase === "running" ? (this.#cursor === null ? this.#start : this.#cursor + 1n) : null;
    return Object.freeze({ code: "node-retrying", attempts, height });
  }

  /** `paused` while the loop is paused between heights (AE-3, Q174 B; task 8.3b), else none. */
  #paused(): PausedCondition[] {
    const paused = this.#pauses.pausedAt;
    return paused === null ? [] : [Object.freeze({ code: "paused", since: utcText(paused.since), by: paused.by })];
  }

  /** `slow-block` while the loop's height in progress is slow (RN-17), else none. */
  #slowBlock(): SlowBlockCondition[] {
    const slow = this.#loop?.slowBlock() ?? null;
    if (slow === null) return [];
    return [Object.freeze({ code: "slow-block", height: slow.height, point: slow.point, module: slow.module })];
  }

  /**
   * A window became slow, or a slow window closed (RN-17, the loop's observer): logged — the window named unless it is
   * a height's processing (Q145 B) —, and published at once (the heartbeat's next tick may be a second away).
   */
  #slowBlockEvent(event: SlowBlockEvent, slowBlockMs: number): void {
    if (event.kind === "raised") {
      const { window, height, point, module } = event.activity;
      const where = module === null ? point : `${point} of ${module}`;
      const which = window === "height" ? "" : ` (${SLOW_WINDOW_NAMES[window].raised})`;
      this.#log(
        `slow block: height ${height} is still processing after slowBlockMs (${slowBlockMs} ms), in ${where}${which}`,
      );
    } else if (event.window === "height") {
      const how = event.completed ? "committed" : "stopped without committing";
      this.#log(`slow block: height ${event.height} ${how} after ${Math.round(event.ms)} ms`);
    } else {
      const how = event.completed ? "ended" : "failed";
      const what = SLOW_WINDOW_NAMES[event.window].ended;
      this.#log(`slow block: height ${event.height}'s ${what} ${how} after ${Math.round(event.ms)} ms`);
    }
    this.#admin?.publish();
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
      const end = this.#ended({ kind: "refused", error });
      // Refused before its `core` revision was known: by the configuration itself, which ends the process (Q137 B).
      if (this.#core === undefined) this.#closing ??= this.#endItself();
      return end;
    }
    let end: LoopEnd;
    for (;;) {
      try {
        end = await loop.run();
        break;
      } catch (error) {
        // A node call the stop's close of the node client ended (task 5.3c): the height in progress stored nothing and
        // is processed again after a restart, or, committed, has its later points re-delivered then (RN-11).
        if (this.#stop.signal.aborted && nodeClientClosed(error)) return this.#ended({ kind: "signal" });
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
    if (end.core) await this.#backupAtStop(end.height);
    return this.#ended(Object.freeze({ kind: "stopped", height: end.height, core: end.core, upgrade }));
  }

  /** Records how processing ended. */
  #ended(end: ProcessingEnd): ProcessingEnd {
    this.#end = end;
    return end;
  }

  /**
   * Ends the process after a refusal of its configuration (Q137 B), which opened nothing but the heartbeat: the
   * heartbeat stopped, `closed` resolved; the state stays `refused`, and {@link stop} returns this.
   */
  async #endItself(): Promise<void> {
    await this.#admin?.close();
    this.#resolveClosed();
  }
}

/**
 * Starts a process (see the module comment): returns its handle at once, startup running — `started` tells when it
 * completed, `ended` how processing ended, `status()` the state meanwhile.
 */
export function startProcess(input: ProcessInput): ProcessHandle {
  return new Process(input);
}
