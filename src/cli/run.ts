/**
 * `umbradb run [--config <file>] [--update-hash=<hash>]`: starts a core or private process from its configuration
 * file, with the user modules the file exports, and runs it until it is signalled, or until a refusal of the
 * configuration itself ends it. [LS-6; design §12]
 *
 * **What it starts** ({@link runProcess}). The process is the engine's (`startProcess`, `src/runner/process.ts`),
 * given: [CF-1, LM-1]
 * - the configuration file (`--config`, or `umbradb.config.ts` in the working directory: the command's default, which
 *   the engine never looks for itself), which the engine loads once, holding its data to the plain-data rule [CF-1];
 * - as its user modules, the ones the file exports in `modules`. The engine's resolver joins them to UmbraDB's own
 *   backbone parts and core modules for the side the file describes (private when a `core` entry has `instanceId` and
 *   none has `node`), validates them and refuses a fault, naming the module. A public process reads the chain from the
 *   `core` entry's `node`, a private one from its public database through its private intake; a public process's
 *   ledger worker imports the file for its user modules' ledger tasks, as the main thread does [MD-1, MD-2, LG-17,
 *   Q106 B];
 * - its ports, the program-level behaviour that only the command has [LM-2, L55]: the admin listener on `listen.admin`
 *   (`0.0.0.0:8081` unless configured, the admin worker's `startAdminServer`) [AE-1, Q128 B]; its log on standard
 *   error, redacted by the process [CF-4, AE-6]; the worker threads' output on the command's own standard output and
 *   standard error (`workerOutput: "inherit"`); the backup at the configured stop (`backupAtStop`) and SIGUSR2's
 *   relay (below) [BK-1];
 * - `--update-hash`, when given, as its `acceptPublicConfigHash`: the public configuration hash a private process
 *   accepts at this start, which a public process's block source ignores [PP-14, Q159].
 *
 * A file that cannot be loaded is refused by the engine as itself, with UmbraDB's own modules only.
 *
 * **Why startup refused** is in the process's log, which the command writes to stderr as it is. A refusal of the
 * configuration itself (the loader's, a fault of the build's declarations with the file's modules, or every finding of
 * the validation) is logged finding by finding, each with its path, redacted (`startup refused: <path>: <message>
 * [<code>]`, the runner's `./configuration-refusal.ts`). Any later refusal is logged with its code and message. The
 * command adds no line of its own, so no finding is printed twice. [CF-1, CF-3, MD-2]
 *
 * **How it ends.** A refusal of the configuration itself ends the process: it served no admin endpoint, and the
 * command exits 1 at once, with no signal. [Q137 B]
 *
 * Any other refused or halted process stays up until it is stopped, with the admin endpoints saying why. So the command
 * then runs until SIGTERM or SIGINT (Ctrl-C), which stop the process cleanly: the height in progress finishes, nothing
 * else starts, and the module API, the node client, the database and the admin listener close. A second signal is not
 * listened for: Node.js's default ends the command at once. [IN-12, AE-3, RN-13]
 *
 * The command then resolves with how processing ended. `refused` or `failed` (a halt) is a failure (exit 1); anything
 * else (the stop itself, the core's stop height, an upgrade boundary) is not (exit 0).
 *
 * **SIGUSR2** is listened for from the command's start to its end ({@link backupSignalRelay}), so a SIGUSR2 sent from
 * a shell never ends the indexer. With `backupOnSignal` set, the process writes a backup at the loop's next pause and
 * goes on. Without it, the signal is logged as ignored, in one line naming `backupOnSignal` (`SIGUSR2 ignored:
 * backupOnSignal is not set, so no backup is written`), and nothing else happens. A host program's own process
 * (`startUmbraDB`) adds no SIGUSR2 listener, so Node.js's default or the host's handler applies there. [BK-1, Q152 B,
 * Q173 C]
 */

import { startAdminServer } from "../admin/server.js";
import { DEFAULT_CONFIG_FILE } from "../config/load.js";
import {
  type BackupSignals,
  type EngineInput,
  type ProcessHandle,
  type ProcessingEnd,
  startProcess,
  type UserModulesSource,
} from "../runner/process.js";

/** The signals that stop the process. [RN-13] */
export const STOP_SIGNALS = Object.freeze(["SIGTERM", "SIGINT"] as const);

/** A signal that stops the process. */
export type StopSignal = (typeof STOP_SIGNALS)[number];

/** What delivers the signals: Node.js's `process`, or a test's emitter. */
export interface SignalSource {
  once(event: StopSignal, listener: () => void): unknown;
  removeListener(event: StopSignal, listener: () => void): unknown;
}

/**
 * An abort signal that the first SIGTERM or SIGINT of `source` aborts, and `dispose`, which stops listening; after the
 * first, neither is listened for (Node.js's default then ends the process at a second one).
 */
export function stopSignal(source: SignalSource): { readonly signal: AbortSignal; dispose(): void } {
  const controller = new AbortController();
  const dispose = (): void => {
    for (const name of STOP_SIGNALS) source.removeListener(name, stop);
  };
  const stop = (): void => {
    dispose();
    controller.abort();
  };
  for (const name of STOP_SIGNALS) source.once(name, stop);
  return Object.freeze({ signal: controller.signal, dispose });
}

/**
 * `umbradb run`'s SIGUSR2. The command listens for it from its start to its end, so that a SIGUSR2 sent from a shell
 * never ends the indexer. It hands the process a source of its own (`EngineOptions.backupSignals`), on which the
 * process listens only when its `core` revision sets `backupOnSignal`. [BK-1, Q173 C]
 *
 * A signal goes to the process's listener when it has one. Otherwise it is logged as ignored, in one line naming
 * `backupOnSignal`:
 * - before startup has settled (its `core` revision may not be read yet);
 * - once it has, when `backupOnSignal` is not set;
 * - after the process stopped listening (it has closed).
 */
export interface BackupSignalRelay {
  /** The process's source of SIGUSR2. */
  readonly signals: BackupSignals;
  /** Tells the relay that startup has completed or been refused, so a signal no listener takes means it is not set. */
  settled(): void;
  /** Stops listening on the command's source; afterwards a signal reaches nothing here. */
  dispose(): void;
}

/** The lines of a SIGUSR2 the relay ignores (see {@link BackupSignalRelay}). */
export const IGNORED_SIGUSR2 = Object.freeze({
  starting:
    "SIGUSR2 ignored: the process is starting and has not listened for it (backupOnSignal not set or not yet read)",
  unset: "SIGUSR2 ignored: backupOnSignal is not set, so no backup is written",
  closed: "SIGUSR2 ignored: the process has closed, so no backup on signal (backupOnSignal) is written",
});

/** Listens for SIGUSR2 on `source` until disposed and relays it (see {@link BackupSignalRelay}), logging to `log`. */
export function backupSignalRelay(source: BackupSignals, log: (line: string) => void): BackupSignalRelay {
  const listeners = new Set<() => void>();
  let listened = false;
  let settled = false;
  const relay = (): void => {
    if (listeners.size === 0) {
      log(listened ? IGNORED_SIGUSR2.closed : settled ? IGNORED_SIGUSR2.unset : IGNORED_SIGUSR2.starting);
      return;
    }
    for (const listener of [...listeners]) listener();
  };
  source.on("SIGUSR2", relay);
  const signals: BackupSignals = Object.freeze({
    on(_event: "SIGUSR2", listener: () => void) {
      listeners.add(listener);
      listened = true;
      return signals;
    },
    removeListener(_event: "SIGUSR2", listener: () => void) {
      listeners.delete(listener);
      return signals;
    },
  });
  return Object.freeze({
    signals,
    settled: () => {
      settled = true;
    },
    dispose: () => {
      listeners.clear();
      source.removeListener("SIGUSR2", relay);
    },
  });
}

/** What {@link runProcess} runs. */
export interface RunOptions {
  /** `--config`: the configuration file, relative to `cwd`; `umbradb.config.ts` when absent. [CF-1] */
  readonly file?: string | undefined;
  /** `--update-hash`: the public configuration hash a private process accepts at this start. [PP-14, Q159] */
  readonly updateHash?: string | undefined;
  /** The working directory. */
  readonly cwd: string;
  /** Where the process's log lines go (already redacted by the process). */
  readonly log: (line: string) => void;
}

/** What the tests replace (each a default otherwise). */
export interface RunSeams {
  /** The signals that stop the process; Node.js's `process` unless given. */
  readonly signals?: SignalSource;
  /** Where the command receives SIGUSR2 ({@link backupSignalRelay}); Node.js's `process` unless given. */
  readonly backupSignals?: BackupSignals;
  /** Told the process's handle once it is started (a test's view of it). */
  readonly started?: (handle: ProcessHandle) => void;
  /** The build's user modules; the file's `modules` export unless given (a negative control's list). [Q106 B] */
  readonly userModules?: UserModulesSource;
  /**
   * How the process is started; the engine's `startProcess` unless given (a test's: one that serves no admin endpoints,
   * or a negative control's).
   */
  readonly start?: (input: EngineInput) => ProcessHandle;
}

/**
 * Runs the process of `options` until it is stopped, or until a refusal of its configuration ends it (see the module
 * comment), and resolves with how processing ended (null if it never started).
 */
export async function runProcess(options: RunOptions, seams: RunSeams = {}): Promise<ProcessingEnd | null> {
  const stop = stopSignal(seams.signals ?? process);
  // From here to the end, SIGUSR2 is the command's: relayed to the process, or logged as ignored. [Q173 C]
  const usr2 = backupSignalRelay(seams.backupSignals ?? process, options.log);
  try {
    const handle = (seams.start ?? startProcess)({
      config: { file: options.file ?? DEFAULT_CONFIG_FILE },
      // Every surface whose address the file writes, admin at its default when none is. [LM-3]
      network: "configured",
      cwd: options.cwd,
      userModules: seams.userModules ?? { from: "config" },
      signal: stop.signal,
      log: options.log,
      adminListener: startAdminServer,
      workerOutput: "inherit",
      backupAtStop: true,
      backupSignals: usr2.signals,
      ...(options.updateHash === undefined ? {} : { acceptPublicConfigHash: options.updateHash }),
    });
    seams.started?.(handle);
    handle.started.then(usr2.settled, usr2.settled);
    // A refusal of the configuration itself closes the process by itself; anything else waits for a signal.
    await handle.closed;
    return handle.status().ended;
  } finally {
    stop.dispose();
    usr2.dispose();
  }
}

/** Whether how processing ended is a failure of the command (exit 1): a refusal or a halt. */
export function runFailed(end: ProcessingEnd | null): boolean {
  return end !== null && (end.kind === "refused" || end.kind === "failed");
}
