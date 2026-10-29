/**
 * The process that `umbradb run` starts. {@link startProcess} assembles the runner's startup from the build's
 * declarations, the configuration and a block source, runs the finalized loop, and publishes the process's state.
 * [RN-1, RN-7–RN-13, CF-3, CF-4, CF-6, CF-8, IN-10, IN-12, AE-3, AE-4, Q43, Q102; design §1, §2, §7, §11; CORE-ARCH
 * §4.6, §4.12, §4.15, §4.17, §4.18]
 *
 * **Startup** runs these steps in order; each step refuses with its own typed error:
 * 1. Validate the build's declarations (`validateDeclarations`).
 * 2. Load the configuration (`loadConfig`: the file, or the data given) and validate it (`validateConfig`). [CF-1]
 * 3. Take the `core` entry's operational and secret fields from its latest revision of the build's version, for the
 *    whole run (`processCoreEntry`): the database, the node, `listen.api`, the timeouts, the development opt-in, the
 *    core's stop. The process's one node client is made from this revision's `node` (`nodeOptionsOf`). A block source
 *    given as a function is made from the revision and that client (`core-block-fetch`'s node source,
 *    `nodeSourceOf`). [Q102]
 * 4. Open the database that revision names (`openConfiguredDatabase`; PGlite is refused without its opt-in) and start
 *    its writer (`startWriter`: the lock, and the durability probe, whose warnings are logged). [CF-9]
 * 5. In one read, read the cursor (the block source's), the configuration history (`readHistory`) and the chain's
 *    identity (`readIdentity`). Check the history against the configuration (`checkHistory`), so that every refusal
 *    comes before any migration. [RN-14, CF-5, CF-6, CF-8]
 * 6. Run `core-chain`'s startup checks against the node, through the block source (`checkChain`), also before any
 *    migration. At every start, the genesis hash is checked against the configured network's (`configuredGenesisOf`
 *    of the `core` revision). On a database with a cursor, the checks also compare the stored genesis hash
 *    (`genesis-mismatch`), wait while the node's finalized head is below the cursor (the condition
 *    `waiting-for-node`), and compare the node's hash at the cursor (`cursor-hash-mismatch`). [IN-3]
 * 7. Resolve the graph from the check (`resolveGraph`, `graphInputOf`); on a private process the graph also counts the
 *    public core's `table` items that its source's check read. Then [PP-13]:
 *    - build the schema plan and the process contexts, with each part's revisions ({@link processRevisions});
 *    - bind `core-chain` to its context with what startup checked and opened (`bindCoreChain`: the configuration, the
 *      declarations, the cursor, the database, S, the genesis hash, the node client, the revision's ledger table);
 *    - bind `core-block-fetch` to the block source when the source gives block items (`bindCoreBlockFetch`), and the
 *      core module `core-chain-events` when it is enabled and the source gives a block's events
 *      (`bindCoreChainEvents`);
 *    - when the graph has `core-block-parsed` or `core-ledger-state`: check the vendored ledger packages
 *      (`checkLedgerPackages`: `package-hash-mismatch` names a changed file, `invalid-configuration` names a
 *      `ledgerSources` entry that is not `vendored`), start the process's ledger worker once per process
 *      (`startLedgerWorker`), and bind the parts to it (`bindLedgerParser`; `bindCoreLedgerState`, with the source's
 *      ledger calls) [LG-5];
 *    - run the migrations and `on-start-db` (`startDatabase`), each through its context's publishing window.
 *      `core-chain`'s `on-start-db` records the history and the identity and publishes its `process` items. A failing
 *      `on-start-db` names its point and module, as a failing `on-start-api` does (a `CallbackFailure`);
 *    - seal the contexts (`process-item-missing`).
 * 8. On a database without a cursor, after every bootstrap step has run, wait while S is above the node's finalized
 *    head (`waitForNode`). The process stays `starting`, with the condition `waiting-for-node`. [IN-2]
 * 9. Run `on-start-api` and serve the module API on `listen.api` (`startModuleApi`).
 * 10. Run the finalized loop, with the core's stop and the upgrade boundary ({@link upgradeBoundary}). [RN-12]
 *
 * A refusal closes what startup opened: the node client, the ledger worker, the database (its writer lock released),
 * then the block source. It rejects {@link ProcessHandle.started} with the refusal. The process stays up, `refused`
 * with the refusal's reason, until it is stopped. [IN-12, AE-3]
 *
 * **A refusal of the configuration itself** ends the process instead. This covers steps 1 to 3, before the process's
 * `core` revision is known: the declarations, loading the configuration, its plain data and validation, and the choice
 * of its revision. The process logs every finding with its path (`./configuration-refusal.ts`) and opens no admin
 * listener (there is no validated `listen.admin`). It is `refused` with `closed` resolved, so nothing is left to stop,
 * and `umbradb run` then exits 1. Every later refusal keeps the process up, as above. [Q137 B]
 *
 * A retryable failure of steps 4 to 8 (`connection-lost`, `node-unreachable`) refuses nothing. After the retry back-off
 * (see **Retries**), steps 4 to 10 run again, with new process contexts and new bindings of `core-chain` and
 * `core-block-fetch`; the node client and the block source are kept. The waits come before the module API, so a retry
 * never finds it open. [IN-10]
 *
 * **The state** ({@link ProcessStatus}) is exactly one of these [AE-3; CORE-ARCH §4.18]:
 * - `starting` until the loop runs;
 * - `refused` when startup refused;
 * - `syncing` or `following`, by the lag (the finalized head the loop last read minus the cursor) against
 *   `followingThreshold`;
 * - `stopped` once processing ended at the core's stop or before an upgrade boundary. At a boundary it has the
 *   condition `upgrade-required`. The process stays up, and the module API answers at the cursor [RN-12];
 * - `halted` when processing failed. A failure before the `COMMIT` left nothing of its height (the loop rolled it
 *   back); one after it left the height committed. The process stays up: the module API answers at the cursor, and the
 *   database stays open until the process is stopped [RN-8];
 * - `stopping` from {@link ProcessHandle.stop} on.
 *
 * `refused` and `halted` carry their reason ({@link ProcessReason}: the error code, the height, the module and the
 * point; `./failures.ts`). The process is ready (`/health/ready`, `readinessOf`) when `stopped`, and otherwise unless a
 * set `readinessLag` is exceeded; it is never ready while `starting`, `refused`, `halted` or `stopping`.
 * [AE-4; design §11]
 *
 * While startup waits for the node (steps 6 and 8), the process is `starting` with the condition `waiting-for-node`,
 * next to a retry's condition when one is raised. The block source's own conditions are the process's too, such as
 * `finality-stall` while the node source's queue is full. [IN-6]
 *
 * `slow-block` shows while the loop's height in progress has run longer than the process revision's `slowBlockMs`. It
 * gives the height, the point it is in, and the first module running there or null (`./loop.ts` defines the window and
 * its limits). It is logged when raised and when that height commits or its run fails, and published at once each
 * time. Nothing cuts the height off or retries it because of its time. [RN-17, Q71]
 *
 * The same condition shows while callbacks that the loop awaits outside a height's processing run too long: a height's
 * `on-after-db-write` and `on-stop-height` after its commit (one window), an `on-finalized` (at the height of the head
 * it announces), and the callbacks delivered again at a run's start (at the cursor's height). It clears when its
 * window ends; the log lines name the window. The admin endpoints show all of this. [RN-11, Q145 B]
 *
 * **Retries.** A lost database connection (`connection-lost`) and an unreachable node (`node-unreachable`) are the two
 * retryable codes. Wherever startup's later steps or the loop meet them, they never halt or refuse. The process raises
 * the condition `database-retrying` or `node-retrying` with the attempts and the height, waits the back-off
 * (`backoffDelay`: 1 s, doubling up to the process revision's `backoffCeilingMs`), and runs again [IN-10; CORE-ARCH
 * §4.6]:
 * - startup runs again from its database steps;
 * - the loop runs again. It first reads the cursor on the writer, whose new session takes the lock again. A
 *   height that failed after its `on-parse` and is not committed is processed again from `on-compute`, its earlier
 *   items kept. After a lost `COMMIT` that did land, the loop goes on with the height's `on-after-db-write`. A cursor
 *   that is neither halts with `unexpected-cursor` (`./loop.ts`) [DB-11, IN-11];
 * - after any other failure, the loop runs again from the cursor, which it delivers again [RN-11].
 *
 * The condition clears, and the back-off starts again from 1 s, once startup completes, a height commits, or the loop
 * finds nothing to process. A stop ends the wait at once. [IN-10]
 *
 * The node client retries its own calls and its connection without limit, with the same back-off
 * (`../node/client.ts`), so a finalized call never fails with `node-unreachable`. While it retries, the process shows
 * `node-retrying` too, with the most attempts the client counted for one call or for the connection since it began
 * retrying, and the height the loop processes or waits for (null during startup). The process logs each of the
 * client's retries (`node retries in <ms> ms (node-retrying, <call or connect>, attempt <n>): …`). The condition clears
 * when the client stops retrying. [IN-10]
 *
 * **SIGTERM.** {@link terminationSignal} gives a signal that SIGTERM aborts. Aborting {@link ProcessInput.signal}, or
 * calling {@link ProcessHandle.stop}, enters `stopping` and aborts the loop's signal. The loop finishes the height in
 * progress (so a block whose transaction is open commits) and starts no other. The process awaits it, then closes the
 * module API (WebSocket clients get 1001, every connection ends), the node client, the database and the block source.
 * [RN-13]
 *
 * During startup, a stop takes effect before the next step and ends every wait for the chain at once. It closes the
 * node client and the block source first. So each node call that startup awaits ends (an unreachable node's retries
 * included), no connection is attempted after the stop, and on a private process a wait for its public side ends too.
 * [RN-13]
 *
 * Once the loop runs, a stop closes the node client at once when no block transaction is open, or else as soon as the
 * open one has committed or rolled back. A node call that the loop awaits outside a transaction then ends with
 * `handle-closed`, its retries included: for example the next height's block through the node source's prefetch, or
 * the state root that `core-ledger-state`'s `on-compute` awaits. Processing ends with the signal. The height in
 * progress stores nothing and is processed again after a restart; if it had committed, its later points are delivered
 * again then. [RN-11, RN-13]
 *
 * **The pause, and the backup on SIGUSR2.** The loop pauses between heights while a hold of the process's
 * {@link LoopPauses} is kept (`./pause.ts`, `./loop.ts`). {@link ProcessHandle.pause} takes one until
 * {@link ProcessHandle.resume}. [BK-1, Q152 B]
 *
 * A process whose `core` revision sets `backupOnSignal` listens for SIGUSR2 ({@link ProcessInput.backupSignals}:
 * Node.js's `process` unless given), from the moment that revision is known until the process has closed. Each SIGUSR2
 * takes a hold, writes the backup of the cursor's height once the loop is paused there (by the same rules as the backup
 * at stop: `backupAtStop`, `../backup/backup.ts`), and releases the hold, so processing goes on from the next height.
 * All of it is logged. [BK-1, CF-4, Q152 B]
 * - A SIGUSR2 while a backup is pending or being written adds none.
 * - After processing ended (the core's stop, a halt), a SIGUSR2 writes at once.
 * - While stopping, or after a refused startup, it writes none.
 *
 * A stop waits for a backup being written before it closes the database. [BK-1]
 *
 * **A private process** (`side: "private"`) starts the same way, with the private `core` schema. Its block source is
 * `core-private-source`'s (`src/backbone/core-private-source/`): its cursor and committed height are the private
 * cursor's, and its blocks are the public database's. Step 6 is that source's own check: it reads the public
 * database's chain identity, whose genesis hash `core-chain` records (the binding to the public side is the part's
 * own). Step 8's bootstrap wait waits for the public cursor to reach the private S. The source is closed with the
 * database. [PP-1, PP-2, CF-4]
 *
 * **The configuration hash** is read once at startup, after step 7's `on-start-db` recorded the configuration
 * (`readConfigHash`: the hash of the process's own `core_chain.config`). It is kept in memory for the run: the module
 * API sets it as `X-Umbra-Config-Hash` on every answer, and the core's transport sends it on its messages.
 * [RN-16, PP-14, Q147]
 *
 * **The process transport** (`../private/core-transport.ts`). A public process whose `core` revision has
 * `listen.transport` starts it once its database is open and its chain known (step 7, before the bootstrap's wait). The
 * process tells it each commit (`committed`) and closes it at its stop or at a refusal. A listener that cannot listen
 * refuses startup (`listen-failed`). [PP-4]
 *
 * On PostgreSQL the transport's reads run on a read pool of their own, logged in as `core.transportReader`
 * (`../private/transport-reader.ts`). Startup first checks that this login cannot write (`transport-reader-can-write`),
 * and the pool closes with the transport. On PGlite the reads share the database's one session. [CF-4, Q175 A]
 *
 * A private process's side of the transport belongs to its block source (`openPublicSide`), which the process gives S
 * and its log ({@link SourceShared}). [PP-4]
 *
 * **Lockstep** (`../private/lockstep.ts`). A public process whose `core` revision lists `lockstepInstances` keeps one
 * bookkeeping of them for its run. Its transport tells that bookkeeping of the instances' `hello`s, reports and closes,
 * and the loop awaits it before each block's `BEGIN` (`LoopInput.lockstep`). While the loop waits, the process raises
 * `waiting-for-lockstep`. Without `listen.transport` no listed instance can connect, and the core waits for them.
 * [PP-6, PP-7, Q24]
 *
 * On a private process, the source checks the resolved graph's modules after step 7 resolves the graph and before any
 * migration (`BlockSource.checkModules`: `needs-lockstep-not-listed`). [PP-6]
 *
 * **Logs** go through the configuration's redaction (`configRedactor`) once it is validated. A refusal of the
 * configuration itself is logged finding by finding, with its secrets redacted as the validation reads them
 * (`earlyRedactor`: the configuration as loaded, else the URL patterns only): `startup refused: <code> (<n> findings);
 * the process ends`, then `startup refused: <path>: <message> [<code>]` for each finding. A later refusal, a halt and
 * each retry are logged with their reason's code (`startup refused: <code>: …`, `processing halted (<code>): …`,
 * `processing retries in <ms> ms (<condition>, attempt <n>): …`, `startup retries …`). [CF-4, AE-6]
 *
 * **The admin endpoints** (`../admin/`) are served unless {@link ProcessInput.admin} is `false` [AE-1, AE-2, Q128 B]:
 * - The heartbeat ticks from `startProcess` on and publishes `status()` to the admin worker. It ends when a refusal of
 *   the configuration ends the process.
 * - The admin listener starts on `listen.admin` once the process's `core` revision is known, before the database
 *   opens, and never before (a refusal before that ends the process, as above). A listener that cannot listen (for
 *   example, when another listener holds the address) refuses startup with `listen-failed`. It closes after the
 *   database at {@link ProcessHandle.stop}.
 * - `/status`'s node shows the node client's connection state (published at once when it changes, and once the client
 *   and the source are made), and the block source's best head announced last and its queue depth
 *   (`BlockSource.nodeView`) [AE-5].
 */

import { cursorHeight } from "../backbone/core-block-commit/sql.js";
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
import { type DatabaseParts, databaseText, type TransportReader } from "../config/database-parts.js";
import { openPostgres } from "../db/postgres.js";
import { refuseWritingReader, transportReaderFacts, type TransportReaderFacts } from "../private/transport-reader.js";
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
 * The configuration a process runs with: a file to load, or its data (a browser's bundle, a test's). Startup holds
 * given data to the same plain-data rules as a file's default export (`plainData`). [CF-1]
 */
export type ProcessConfig = LoadOptions | { readonly data: unknown; readonly file?: string };

/** What {@link startProcess} takes. */
export interface ProcessInput {
  /**
   * The build's declarations, not yet validated: UmbraDB's backbone parts (among them `core-chain`, `CORE_CHAIN`,
   * which startup binds to its process context), its core modules, and the host's user modules.
   */
  readonly declarations: DeclarationSet;
  /** The configuration; `umbradb.config.ts` in the working directory when absent. [CF-1] */
  readonly config?: ProcessConfig;
  /**
   * The block source, or how to make it (`nodeSourceOf` for the node) from the process's `core` revision and what the
   * process shares with it, its node client. A function is called once, after the configuration is validated and
   * before the database opens. [RN-14, Q102]
   */
  readonly source: BlockSource | ((core: CheckedEntry, shared: SourceShared) => BlockSource);
  /** The process's side, which decides the `core` schema that applies; public unless given. [CF-4] */
  readonly side?: ProcessSide;
  /** Stops the process when it aborts ({@link terminationSignal} for SIGTERM). [RN-13] */
  readonly signal?: AbortSignal;
  /** Where each log line goes, redacted (see the module comment); standard error when absent. */
  readonly log?: (line: string) => void;
  /** The negative controls' startup checks against the node; `core-chain`'s `checkChain` unless given. [IN-3] */
  readonly checkChain?: (input: ChainCheckInput) => Promise<ChainCheck>;
  /** The negative controls' loop; the finalized loop unless given. */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** The negative controls' choice of the process's `core` revision; `processCoreEntry` unless given. [Q102] */
  readonly processCore?: (config: CheckedConfig) => CheckedEntry;
  /**
   * The tests' node client: makes the process's one client from the options the process gives it (the `core`
   * revision's, with the process's `onRetry` and `onRetryingChange`) — on a clock of the test's own; `new
   * NodeClient(options)` unless given.
   */
  readonly nodeClient?: (options: NodeClientOptions) => NodeClient;
  /**
   * The admin endpoints (`../admin/`), served unless `false` (an opt-out). Absent or `true` serves them on
   * `listen.admin` from the admin worker, with the heartbeat, from startup until {@link ProcessHandle.stop}; a starter
   * serves them through itself (the negative controls'). A program or a test that starts several processes gives each
   * its own `listen.admin` (port 0 for a free one) or opts out: a second process on one address refuses startup with
   * `listen-failed` before its database opens. [AE-1, AE-2, Q128 B]
   */
  readonly admin?: boolean | AdminStarter;
  /**
   * The process's ledger worker: started when the graph has `core-block-parsed` or `core-ledger-state`, with
   * `startLedgerWorker` unless given (a test package's, a negative control's), and closed with the process. [LG-10]
   */
  readonly ledgerWorker?: () => LedgerHost;
  /**
   * The startup check of the vendored ledger packages, given the `core` revision's `ledgerSources` before the ledger
   * worker starts: `checkLedgerPackages` (`../ledger/identity.ts`) unless given (a test's, over a copy of the packages;
   * a negative control's, which checks nothing). [LG-5, A173]
   */
  readonly checkLedgerPackages?: (options: VerifyLedgerPackagesOptions) => void;
  /**
   * The process's configuration hash, read once at startup after `core-chain` recorded the configuration:
   * `readConfigHash` of its own database unless given (a negative control's, over its secrets). [RN-16, PP-14]
   */
  readonly configHash?: (read: ReadHandle, core: CheckedEntry) => Promise<string>;
  /**
   * The public configuration hash the operator accepts for this start (`umbradb run --update-hash`). A private
   * process's source records it after the full checks, when it is the hash the start finds in place of the one the
   * private database accepted. It is given to the block source ({@link SourceShared}); a public process's source
   * ignores it. [PP-14, Q159]
   */
  readonly updateHash?: string;
  /**
   * Where SIGUSR2 comes from for the `core` revision's `backupOnSignal`: Node.js's `process` unless given (a test's
   * emitter, or `umbradb run`'s relay, which listens for SIGUSR2 itself for the whole command and logs one it ignores).
   * It is listened to only when `backupOnSignal` is set, from the moment the process's `core` revision is known until
   * the process has closed (see the module comment). Without it the process adds no SIGUSR2 listener, so Node.js's
   * default or the host program's own handler applies. [CF-4, BK-1, Q152 B, Q173 C]
   */
  readonly backupSignals?: BackupSignals;
  /**
   * A test seam for the core transport's read path. `"unconfined"` turns off the transport's check of each statement,
   * so that a statement it would refuse reaches the database, which then refuses a write by the transport reader's
   * login. Unless given, each statement is checked first (`"confined"`). [A177]
   */
  readonly transportReads?: "confined" | "unconfined";
  /**
   * The negative control's judgement of the transport reader's login: `canWriteFindings`
   * (`../private/transport-reader.ts`) unless given. [A177]
   */
  readonly transportReaderCheck?: (facts: TransportReaderFacts) => readonly string[];
}

/** What delivers SIGUSR2 for `backupOnSignal`: Node.js's `process`, or a test's emitter. */
export interface BackupSignals {
  on(event: "SIGUSR2", listener: () => void): unknown;
  removeListener(event: "SIGUSR2", listener: () => void): unknown;
}

/** What the process shares with the block source it makes: its one node connection, S and its log. */
export interface SourceShared {
  /** The node client made from the process's `core` revision (`nodeOptionsOf`), or null for a revision with no node. */
  readonly nodeClient: NodeClient | null;
  /** S, the database's start (a private process's `hello` before its first commit gives S − 1). */
  readonly start: bigint;
  /** The process's log, redacted (a private source's transport logs its connections). */
  readonly log: (line: string) => void;
  /** {@link ProcessInput.updateHash}, when given (a private source's). */
  readonly updateHash?: string;
}

/** The process's state: exactly one at a time. [AE-3; CORE-ARCH §4.18] */
export type ProcessState = "starting" | "refused" | "syncing" | "following" | "stopped" | "halted" | "stopping";

/** One entry at an upgrade boundary: its id, the revision's start, the version it needs, the build's. [RN-12] */
export interface UpgradeEntry {
  readonly id: string;
  readonly start: number;
  readonly needed: string | CoreVersion;
  readonly build: string | CoreVersion;
}

/** An upgrade boundary: its height, and the entries whose revision starting there this build does not carry. [RN-12] */
export interface UpgradeBoundary {
  readonly height: bigint;
  readonly entries: readonly UpgradeEntry[];
}

/** A condition of the process: `upgrade-required` at an upgrade boundary. [RN-12; CORE-ARCH §4.18] */
export interface UpgradeCondition extends UpgradeBoundary {
  readonly code: "upgrade-required";
}

/**
 * A condition of the process, in one of two cases:
 * - a failure is being retried (`database-retrying` for a lost database connection, `node-retrying` for an unreachable
 *   node), after `attempts` failures since startup completed or the last commit, at `height` (null at startup, or at
 *   the loop's cursor read);
 * - the node client retries (`node-retrying`): its most attempts for one call or the connection since it began, at the
 *   height the loop processes or waits for (null at startup).
 * [IN-10, AE-3]
 */
export interface RetryCondition {
  readonly code: RetryCode;
  readonly attempts: number;
  readonly height: bigint | null;
}

/**
 * The condition `waiting-for-node`: startup waits, `starting`, for the node's finalized head to reach `height` (S on a
 * new database, the cursor on one with a cursor). `head` is the node's head when the wait began. [IN-2, IN-3]
 */
export interface WaitingCondition extends NodeWait {
  readonly code: "waiting-for-node";
}

/**
 * The condition `slow-block`: the height in progress has run longer than `slowBlockMs` (the window of `./loop.ts`), or
 * callbacks that the loop awaits outside a height's processing have: the points after its commit, an `on-finalized`
 * (`height` is the head's), or the callbacks delivered again at a run's start. `point` is the point it is in, and
 * `module` the first module whose callback runs there, or null while none runs. [RN-11, RN-17, AE-3, Q71, Q145 B]
 *
 * It clears when its window ends: the height commits or its run fails, or the callbacks end or fail. Nothing cuts
 * anything off. [RN-17]
 */
export interface SlowBlockCondition {
  readonly code: "slow-block";
  readonly height: bigint;
  readonly point: PointName;
  readonly module: string | null;
}

/** How the log names a window outside a height's processing: when it is raised, and when it ended. [Q145 B] */
const SLOW_WINDOW_NAMES: Readonly<
  Record<Exclude<SlowWindow, "height">, { readonly raised: string; readonly ended: string }>
> = {
  "after-commit": { raised: "after its commit", ended: "points after its commit" },
  finalized: { raised: "the new finalized head", ended: "on-finalized" },
  redelivery: { raised: "its re-delivery at the run's start", ended: "re-delivery" },
};

/**
 * The condition `paused`: the finalized loop is paused between heights (`./pause.ts`). `since` is the time it paused,
 * as RFC 3339 text in UTC; `by` is `pause` while a {@link ProcessHandle.pause} is kept, else `signal` (a backup on
 * SIGUSR2). It is gone once the loop runs again. Like every condition, it does not change readiness.
 * [AE-3, AE-4, BK-1, Q68, Q174 B]
 */
export interface PausedCondition {
  readonly code: "paused";
  readonly since: string;
  readonly by: PauseBy;
}

/**
 * The process's conditions, among them the block source's own (`finality-stall`), `slow-block`, `waiting-for-lockstep`
 * and `paused`. [AE-3, IN-6, PP-6]
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

/** The process's state now. [AE-3, AE-4; CORE-ARCH §4.18] */
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
   * Why startup refused or processing halted: the reason's code, height, module and point, never a message. Null
   * before either; kept once the process is `stopping`. [AE-5, AE-6]
   */
  readonly reason: ProcessReason | null;
}

/** What a process that started gives. */
export interface StartedProcess {
  /** The `core` revision whose operational and secret fields the process runs with. [Q102] */
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
   * Stops the process: enters `stopping`, aborts the loop's signal and awaits the loop, then closes the module API and
   * the database. During startup the node client and the block source are closed first, so every wait of startup for
   * the chain ends at once. Once the loop runs, the node client is closed first (when a block transaction is open, once
   * it has committed or rolled back), so every node call the loop awaits outside a transaction ends at the stop.
   * [RN-13]
   *
   * Resolves once all of it is done; calling it again returns the same promise. After a refusal of the configuration
   * ended the process, it returns {@link closed}, and the state stays `refused`.
   */
  stop(): Promise<void>;
  /**
   * Resolves once {@link stop} completed, or once a refusal of the configuration itself ended the process (see the
   * module comment). [Q137 B]
   */
  readonly closed: Promise<void>;
  /**
   * Writes a backup of the process's database at its committed height to the file `out` (`../backup/`), while
   * processing runs or after it ended: on PostgreSQL in one read's snapshot beside the commits, on PGlite as one job of
   * the database's queue, so commits wait for it. Resolves with the backup once its file is complete; rejects with
   * startup's refusal, with `handle-closed` once the process is stopping, and with the backup's refusals
   * (`private-backup-refused`, `backup-tools-missing`, `no-committed-height`), writing no file. `seams` are the
   * negative controls' only (`BackupSeams`: a dump outside the manifest's snapshot), not for programs. [BK-1]
   */
  backup(out: string, seams?: BackupSeams): Promise<BackupWritten>;
  /**
   * Pauses the finalized loop between heights. At its next point between two heights (no transaction open, every read
   * of the previous height ended; at once while it waits for the head), it stops and starts nothing (no head read, no
   * point, no height) until {@link resume}. Reads go on meanwhile: the module API, the admin endpoints, a
   * {@link backup}. [BK-1, Q152 B]
   *
   * Resolves once the loop is paused, once processing has ended (nothing processes then), or once `resume()` came
   * first. Asked again before `resume()`, it is the same pause. A stop while paused ends the process. [RN-13]
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
 * The upgrade boundary for a startup's history check: the lowest start of a scheduled revision (one above the cursor
 * whose version this build does not carry). It lists every entry whose scheduled revision starts there, in the
 * configuration's order, with the version the build carries for it. Null when no revision is scheduled. [RN-12]
 *
 * The history check's version rule has made sure that the revision covering cursor + 1 is the build's, so the
 * boundary is above it. [CF-8]
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

/** A revision of the process contexts: frozen. [MD-7] */
function revisionOf(entry: CheckedEntry, stop: bigint | null, settings: PlainObject): Revision {
  return Object.freeze({ start: BigInt(entry.start), stop, version: versionText(entry.version), settings: Object.freeze(settings) });
}

/**
 * Each part's revisions for its process context, in start order, since a callback's settings are its revision's at
 * the height [RN-7]:
 * - a module's come from the history check's entries, with their effective stops (`graphEntries`) and their settings:
 *   the parsed settings of the build's version with defaults applied, or an earlier `versionEntry`'s `config` as
 *   recorded, or none for a scheduled one [CF-5];
 * - every backbone part's are the `core` entry's, since the backbone runs with the core: each revision's data fields,
 *   plus every operational and secret field of `process`, the process's `core` revision. Data fields apply from each
 *   revision's start; the others hold for the process's whole run [Q102].
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
 * For a Node.js process: a signal that aborts on the first SIGTERM `target` receives (the {@link ProcessInput.signal}
 * of `umbradb run`), and `dispose`, which stops listening. [RN-13]
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
 * `part`, with an `on-start-db` that fails with a `CallbackFailure` naming the point and the part (as a failing
 * `on-start-api` does, `registerModuleApis`), its error the cause. The refusal's reason then names them. [AE-5]
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
 * Whether `error`, a failure of the loop, came from a call on the node client after it was closed: `handle-closed` of
 * the node client, as the error itself or as the cause of what failed (a callback's, a height's). While the loop runs,
 * only the process's stop closes the client. The cause chain is followed eight levels deep at most. Exported for its
 * tests.
 */
export function nodeClientClosed(error: unknown): boolean {
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
  /** The failure being retried, and the failures since startup completed or a height committed. [IN-10] */
  #retrying: RetryCondition | null = null;
  #attempts = 0;
  /** While the node client retries: the most attempts it reported since it began; null while it does not. [IN-10] */
  #nodeAttempts: number | null = null;
  #db: Database | undefined;
  #source: BlockSource | undefined;
  #api: StartedModuleApi | undefined;
  readonly #admin: ProcessAdmin | undefined;
  /** The process's one node client, shared by `core-chain`'s `node-client` item and the block source. */
  #nodeClient: NodeClient | null = null;
  /** The node client's close, once begun (`#closeNode`). */
  #nodeClosed: Promise<void> | undefined;
  /** The process's ledger worker, once its graph needs one; kept across a retried startup. */
  #ledger: LedgerHost | undefined;
  /** A public process's process transport on `listen.transport` (`../private/core-transport.ts`). [PP-4] */
  #transport: CoreTransport | undefined;
  /** The transport's read pool on PostgreSQL, logged in as `core.transportReader`. [Q175 A] */
  #transportReader: Database | undefined;
  /** The loop startup made (for its slow height). [RN-17] */
  #loop: FinalizedLoop | undefined;
  /** A public process's bookkeeping of its `lockstepInstances`, once startup read them. [PP-6] */
  #lockstep: Lockstep | undefined;
  /** The schema plan's tables declared `deterministic: false`, for a backup's contents hash. [BK-2, Q76] */
  #optedOut: readonly TableName[] = [];
  /**
   * The holds that pause the loop between heights: {@link pause}'s and SIGUSR2's. A change of the pause that `/status`
   * shows is published at once. [BK-1, Q152 B, Q174 B]
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
   * Listens for SIGUSR2 when the `core` revision sets `backupOnSignal` (see the module comment), until the process has
   * closed. [BK-1, Q152 B]
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
   * The backup on signal: a hold on the loop; once it is paused (or processing ended), the backup of the cursor's
   * height to `out` (relative to the working directory) by the same rules as the backup at stop; then the hold
   * released. Logged; never rejects. [BK-1, Q152 B]
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

  /**
   * What a backup of the process's database is given: its backend, its opted-out tables, its side and its opt-in.
   * [BK-1]
   */
  #backupInput(out: string): BackupInput {
    const settings = (this.#core as CheckedEntry).settings as PlainObject;
    const target = databaseTarget(settings.database as unknown as DatabaseParts);
    return {
      db: this.#db as Database,
      target: target.backend === "postgres" ? { backend: "postgres", connection: target.connection } : { backend: "pglite" },
      out,
      optedOut: this.#optedOut,
      side: this.#input.side ?? "public",
      developmentOptIn: settings.developmentOptIn === true,
    };
  }

  /**
   * The backup at stop: after the core's `on-stop-height`, to the `core` revision's `backupAtStop` when set (relative
   * to the working directory), unless the file there is a backup of `height` already. Logged, a failure too, which
   * leaves the process `stopped`. [BK-1; CORE-ARCH §4.15]
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
    // The waits for the chain end now, not once startup or the loop has ended. [RN-13]
    const waits = starting ? this.#endStartupWaits() : this.#endLoopWaits();
    await this.ended;
    try {
      await this.#api?.close();
    } finally {
      await waits;
      await this.#transport?.close();
      await this.#transportReader?.close();
      await this.#closeNode();
      await this.#ledger?.close();
      // A backup on SIGUSR2 being written ends before the database closes.
      await this.#signalBackup;
      await this.#db?.close();
      await this.#source?.close?.();
      if (this.#admin !== undefined) await this.#admin.close();
      this.#unlisten?.();
      this.#resolveClosed();
    }
  }

  /**
   * A stop during startup: ends every wait of startup for the chain at once, rather than once startup has ended, which
   * it does not while a node call retries an unreachable node without limit. [RN-13, IN-10]
   *
   * The node client is closed, so each call startup awaits on it (`checkChain`'s blocks, the node source's
   * subscriptions and head read, a module's call in `on-start-db`) ends with `handle-closed`, and no connection is
   * attempted after the stop. The block source is closed, which ends a wait for its head and, on a private process, a
   * wait for its public side (its transport's connection, its reads). A step cut short fails, its transaction rolled
   * back, and startup ends with the stop. Both are closed again with the rest; closing is idempotent. Never rejects.
   */
  async #endStartupWaits(): Promise<void> {
    await Promise.allSettled([this.#closeNode(), this.#source?.close?.()]);
  }

  /**
   * A stop once startup has completed: ends every node call the loop awaits outside a block transaction (the next
   * height's block through the node source's prefetch, the state root that `core-ledger-state`'s `on-compute` awaits,
   * a module's node call), rather than once the loop has ended, which it does not while such a call retries an
   * unreachable node without limit. [RN-13, IN-10]
   *
   * The node client is closed now when the loop has no block transaction open (`FinalizedLoop.blockTransaction`), else
   * as soon as that one has committed or rolled back. Each call on it ends with `handle-closed`, its retries and the
   * client's reconnection included, and no connection is attempted after. The loop's failure that follows ends
   * processing with the signal ({@link nodeClientClosed}). Never rejects.
   */
  async #endLoopWaits(): Promise<void> {
    const open = this.#loop?.blockTransaction() ?? null;
    if (open !== null) await open;
    await this.#closeNode().catch(() => undefined);
  }

  /**
   * Closes the process's node client (every call and subscription ends with `handle-closed`), once: a stop closes it
   * early, and the closes after it await the same.
   */
  async #closeNode(): Promise<void> {
    if (this.#nodeClient === null) return;
    this.#nodeClosed ??= this.#nodeClient.close();
    await this.#nodeClosed;
  }

  /**
   * What `/status` shows of the private side: on the core, its private instances from its lockstep bookkeeping and its
   * transport; on a private process, whether its source is lockstep. [PP-9, AE-5]
   */
  #privateSide(): PrivateSideFacts {
    return Object.freeze({
      instances: privateInstancesOf(this.#lockstep?.instances() ?? [], this.#transport?.instances() ?? []),
      lockstep: publicLockstepOf(this.#source),
    });
  }

  /**
   * What `/status` shows of the node besides `status()`: the node client's connection state, and the best head
   * announced last and the queue's depth as the block source reports them (`nodeView`); null without them. [AE-5]
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
      // A module's ledger tasks run through points of its own (`src/ledger/tasks.ts`). [LG-17]
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
              // `/status` shows a change of the connection at once: the heartbeat may be a second away.
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
      // `/status` shows the client's `connecting` and the source's queue from now on.
      this.#admin?.publish();
      // A read's height is the cursor's: the core's cursor table, or a private process's own (its source's). [DB-2]
      const db = await openConfiguredDatabase(core, {
        committedHeight: source.committedHeight ?? cursorHeight,
        log: (line) => this.#log(line),
      });
      // The log shows the database's parts, except the password. [CF-4, Q167 A]
      this.#log(`database: ${databaseText((core.settings as PlainObject).database as unknown as DatabaseParts)}`);
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
          // A refusal of the configuration itself: every finding logged; `#run` then ends the process. [Q137 B]
          for (const line of configurationRefusalLines(error, earlyRedactor(loadedInput).text)) this.#log(line);
        } else {
          this.#log(`startup refused: ${reasonOf(error).code}: ${messageOf(error)}`);
        }
      }
      // The module API opens in the last step, after which only a stop throws: the stop closes it.
      await this.#transport?.close();
      await this.#transportReader?.close();
      await this.#closeNode();
      await this.#ledger?.close();
      await this.#db?.close();
      await this.#source?.close?.();
      throw error;
    }
  }

  /** Startup's steps once the database opened (4 to 7 of the module comment), run again after a retryable failure. */
  /**
   * What the process transport reads on:
   * - on PostgreSQL, a read pool of its own, logged in as `core.transportReader` (with the host, port, name and `ssl`
   *   of `database`; the schema requires it there). It is refused with `transport-reader-can-write` when that login
   *   could write (`../private/transport-reader.ts`); the judgement is `input.transportReaderCheck`'s when given (the
   *   negative control's);
   * - on PGlite, the database itself, whose one session is the writer's.
   * [CF-4, PP-4, Q175 A]
   */
  async #transportReads(settings: PlainObject, db: Database, source: BlockSource): Promise<Pick<Database, "read">> {
    const database = settings.database as unknown as DatabaseParts;
    if (database.kind !== "postgres") return db;
    const reader = settings.transportReader as unknown as TransportReader;
    const { kind: _kind, password: _password, ...parts } = database;
    const connection = { ...parts, user: reader.user, ...(reader.password === undefined ? {} : { password: reader.password }) };
    // A retried startup opens it again.
    await this.#transportReader?.close();
    const pool = openPostgres({ connection, committedHeight: source.committedHeight ?? cursorHeight });
    this.#transportReader = pool;
    const facts = await pool.read((read) => transportReaderFacts(read, database.user));
    refuseWritingReader(facts, this.#input.transportReaderCheck);
    this.#log(`transport reads as ${facts.user}, a login that may only read`);
    return pool;
  }

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
    // A private process's source checks its chain itself, since a private process never talks to the node. [PP-1]
    const { genesisHash, publicItems } = await (input.checkChain ?? source.checkChain?.bind(source) ?? checkChain)({
      source,
      identity,
      cursor,
      configured: configuredGenesisOf(settings),
      signal: this.#stop.signal,
      onWaiting: waiting,
    });
    this.#step();
    // A private process's graph counts the public core's table items its source read. [PP-13]
    const graph = resolveGraph({ ...graphInputOf(check, declarations), ...(publicItems === undefined ? {} : { publicItems }) });
    // A private process's source refuses a module it cannot run: needsLockstep on an instance that is not lockstep.
    // [PP-6]
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
    // The ledger worker: core-block-parsed parses there, core-ledger-state applies there. [LG-7, LG-10]
    const parses = graph.modules.some((part) => part.id === CORE_BLOCK_PARSED_ID);
    const applies = graph.modules.some((part) => part.id === CORE_LEDGER_STATE_ID);
    if (parses || applies) {
      // No ledger package is imported before it is checked: a changed one, or a version ledgerSources says is
      // released, refuses startup here, before the worker starts and before block S. [LG-5, A173]
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
    // The configuration hash: read once, now that core-chain recorded the configuration, and kept in memory for the
    // run. It goes on X-Umbra-Config-Hash of every module API answer and on the transport's messages.
    // [RN-16, PP-14, Q147]
    const configHash = await db.read((read) => (input.configHash === undefined ? readConfigHash(read) : input.configHash(read, core)));
    // `/status` and `/config` show the database's parts from here on, and what startup read. [AE-5]
    this.#admin?.opened({
      declarations,
      modules: graph.modules,
      revisionsOf: processRevisions(check, core),
      db,
      check,
      history,
      genesisHash,
    });
    // The process transport: a public process given listen.transport listens for private ones from here on, once,
    // before the bootstrap's wait, so that they connect before S commits. [PP-4]
    const { transport: transportAddress } = settings.listen as { readonly transport?: string };
    const lockstepInstances = (settings.lockstepInstances as unknown as readonly string[] | undefined) ?? [];
    // Lockstep: one bookkeeping for the run, which the transport tells and the loop waits on. [PP-6]
    if (this.#lockstep === undefined && lockstepInstances.length > 0) {
      this.#lockstep = new Lockstep({ listed: lockstepInstances, log: (line) => this.#log(line) });
    }
    if (this.#transport === undefined && (input.side ?? "public") === "public" && transportAddress !== undefined) {
      const reads = await this.#transportReads(settings, db, source);
      this.#transport = await startCoreTransport({
        address: transportAddress,
        tls: settings.tls as TransportTls | undefined,
        db: reads,
        ...(input.transportReads === undefined ? {} : { reads: input.transportReads }),
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
    // The bootstrap's wait: every bootstrap step has run, and nothing is processed until block S commits. It comes
    // before the module API, so that a retried startup (a node unreachable meanwhile) never finds it listening. [IN-2]
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
   * The retry of `error`, which `where` met at `height` (`code` is its condition): the condition raised, the failure
   * logged, the back-off waited (a stop ends it at once). Resolves true to run again, false when the process stops.
   * [IN-10]
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

  /** One retry the node client scheduled: its attempts counted for `node-retrying`, and a log line. [IN-10] */
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

  /** `paused` while the loop is paused between heights, else none. [AE-3, Q174 B] */
  #paused(): PausedCondition[] {
    const paused = this.#pauses.pausedAt;
    return paused === null ? [] : [Object.freeze({ code: "paused", since: utcText(paused.since), by: paused.by })];
  }

  /** `slow-block` while the loop's height in progress is slow, else none. [RN-17] */
  #slowBlock(): SlowBlockCondition[] {
    const slow = this.#loop?.slowBlock() ?? null;
    if (slow === null) return [];
    return [Object.freeze({ code: "slow-block", height: slow.height, point: slow.point, module: slow.module })];
  }

  /**
   * A window became slow, or a slow window closed (the loop's observer): logged, naming the window unless it is a
   * height's processing, and published at once (the heartbeat's next tick may be a second away). [RN-17, Q145 B]
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
      // Refused before its `core` revision was known: by the configuration itself, which ends the process. [Q137 B]
      if (this.#core === undefined) this.#closing ??= this.#endItself();
      return end;
    }
    let end: LoopEnd;
    for (;;) {
      try {
        end = await loop.run();
        break;
      } catch (error) {
        // A node call ended by the stop's close of the node client: the height in progress stored nothing and is
        // processed again after a restart, or, if it committed, has its later points delivered again then. [RN-11]
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
   * Ends the process after a refusal of its configuration, which opened nothing but the heartbeat: the heartbeat
   * stopped, `closed` resolved. The state stays `refused`, and {@link stop} returns this. [Q137 B]
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
