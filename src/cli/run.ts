/**
 * `umbradb run [--config <file>] [--update-hash=<hash>]` (`openspec/changes/core-arch/specs/library-surface/spec.md`
 * LS-6; `specs/configuration/spec.md` CF-1; `specs/runner/spec.md` RN-13; `specs/admin-endpoints/spec.md` AE-1, AE-3;
 * `specs/private-processes/spec.md` PP-14; `design.md` §12; owner decisions Q106 B, Q128 B, Q137 B, Q159; tasks 4.4a,
 * 8.1b, 14.1c): starts a core or private process from its configuration file, with the user modules the file exports,
 * and runs it until it is signalled, or until a refusal of the configuration itself ends it.
 *
 * **What it starts** ({@link runProcess}): the configuration file — `--config`, or `umbradb.config.ts` in the working
 * directory (CF-1) — is loaded once (`loadConfig`), and the process is the runner's `startProcess` with
 * - the evaluated data as its configuration, so startup holds it to CF-1 and validates it as it would the file;
 * - the command's build (`./build-modules.ts`): UmbraDB's backbone parts and core modules, and as its user modules the
 *   ones the file exports in `modules` (Q106 B; the runner validates them, MD-2, and refuses a fault naming the module);
 * - the side taken from the file (`inferSide`: private when a `core` entry has `instanceId` and none has `node`): a public
 *   process reads the chain from the `core` entry's `node` through `core-block-fetch`'s node source (`nodeSourceOf`,
 *   task 10.3), a private one from its public database through one private intake (`core-private-source`, task 14.1);
 * - the admin endpoints, served by default on `listen.admin` (AE-1, Q128 B: nothing is passed for them);
 * - a public process's ledger worker given the file to import for its user modules' ledger tasks (MD-1, LG-17: the file
 *   is the host program, imported in the worker as on the main thread; `LedgerWorkerOptions.modules`, task 12.6);
 * - its log on standard error, redacted by the process (CF-4, AE-6);
 * - `--update-hash`, when given, as its `updateHash`: the public configuration hash a private process accepts at this
 *   start (PP-14, owner decision Q159; task 14.1c), which a public process's block source ignores.
 * A file that cannot be loaded is handed to startup as the file, so that startup refuses it as itself, with the
 * build's own modules.
 *
 * **Why startup refused** is the process's log, which the command writes to stderr as it is: a refusal of the
 * configuration itself — the loader's (CF-1), a fault of the build's declarations with the file's modules (MD-2), every
 * finding of the validation (CF-3) — finding by finding, each with its path, redacted (`startup refused: <path>:
 * <message> [<code>]`, the runner's `./configuration-refusal.ts`); any later refusal with its code and message. The
 * command adds no line of its own, so no finding is printed twice.
 *
 * **How it ends.** A refusal of the configuration itself ends the process (owner decision Q137 B, task 8.1b): it
 * served no admin endpoint, and the command exits 1 at once, with no signal. Any other refused or halted process
 * stays up until it is stopped (IN-12, AE-3), the admin endpoints saying why; so the command then runs until SIGTERM or
 * SIGINT (Ctrl-C), which stop the process cleanly (RN-13: the height in progress finishes, nothing else starts, the
 * module API, the node client, the database and the admin listener close). A second signal is not listened for:
 * Node.js's default ends the command at once. The command then resolves with how processing ended: `refused` or
 * `failed` (a halt) is a failure (exit 1), anything else — the stop itself, the core's stop height, an upgrade
 * boundary — is not (exit 0).
 */

import { pathToFileURL } from "node:url";
import { privateIntake } from "../backbone/core-private-source/index.js";
import { nodeSourceOf } from "../backbone/core-block-fetch/node-source.js";
import { type LoadedConfig, loadConfig } from "../config/load.js";
import { startLedgerWorker } from "../ledger/worker/host.js";
import { type ProcessHandle, type ProcessingEnd, type ProcessInput, startProcess } from "../runner/process.js";
import { commandBuild } from "./build-modules.js";
import { inferSide } from "./config-check.js";

/** The signals that stop the process (RN-13). */
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

/** What {@link runProcess} runs. */
export interface RunOptions {
  /** `--config`: the configuration file, relative to `cwd`; `umbradb.config.ts` when absent (CF-1). */
  readonly file?: string | undefined;
  /** `--update-hash`: the public configuration hash a private process accepts at this start (PP-14, Q159). */
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
  /** Told the process's handle once it is started (a test's view of it). */
  readonly started?: (handle: ProcessHandle) => void;
  /** The build's user modules from the loaded file; its `modules` export (Q106 B) unless given (a negative control's). */
  readonly userModules?: (loaded: LoadedConfig) => readonly unknown[];
  /**
   * How the process is started; the runner's `startProcess` unless given (a test's: one that serves no admin endpoints,
   * or a negative control's).
   */
  readonly start?: (input: ProcessInput) => ProcessHandle;
}

/** The configuration and build of a file that loaded, or of one handed to startup to refuse. */
function processOf(
  options: RunOptions,
  loaded: LoadedConfig | null,
  userModules: (loaded: LoadedConfig) => readonly unknown[],
): Pick<ProcessInput, "config" | "declarations" | "source" | "side" | "ledgerWorker"> {
  if (loaded === null) {
    // Startup loads the file again and refuses it as itself (see the module comment).
    const file = options.file === undefined ? {} : { file: options.file };
    return { config: { ...file, cwd: options.cwd }, declarations: commandBuild(), source: nodeSourceOf };
  }
  const user = userModules(loaded);
  const config = { data: loaded.data, file: loaded.file };
  if (inferSide(loaded.data) === "private") {
    const intake = privateIntake();
    return {
      config,
      declarations: commandBuild(user, { side: "private", intake }),
      // The runner's S and log: a private process's transport `hello`s with S − 1 before its first commit (task 14.2).
      source: (core, shared) => intake.source(core, shared),
      side: "private",
    };
  }
  const modules = pathToFileURL(loaded.file);
  return {
    config,
    declarations: commandBuild(user),
    source: nodeSourceOf,
    side: "public",
    ledgerWorker: () => startLedgerWorker({ modules }),
  };
}

/**
 * Runs the process of `options` until it is stopped, or until a refusal of its configuration ends it (see the module
 * comment), and resolves with how processing ended (null if it never started).
 */
export async function runProcess(options: RunOptions, seams: RunSeams = {}): Promise<ProcessingEnd | null> {
  const stop = stopSignal(seams.signals ?? process);
  try {
    let loaded: LoadedConfig | null = null;
    try {
      loaded = await loadConfig({ ...(options.file === undefined ? {} : { file: options.file }), cwd: options.cwd });
    } catch {
      // Startup loads the file again and refuses it as itself, logging why (see the module comment).
    }
    const userModules = seams.userModules ?? ((file: LoadedConfig) => file.modules);
    const input = processOf(options, loaded, userModules);
    const handle = (seams.start ?? startProcess)({
      ...input,
      signal: stop.signal,
      log: options.log,
      ...(options.updateHash === undefined ? {} : { updateHash: options.updateHash }),
    });
    seams.started?.(handle);
    // A refusal of the configuration itself closes the process by itself; anything else waits for a signal.
    await handle.closed;
    return handle.status().ended;
  } finally {
    stop.dispose();
  }
}

/** Whether how processing ended is a failure of the command (exit 1): a refusal or a halt. */
export function runFailed(end: ProcessingEnd | null): boolean {
  return end !== null && (end.kind === "refused" || end.kind === "failed");
}
