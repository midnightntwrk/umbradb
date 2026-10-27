/**
 * `umbradb run [--config <file>]` (`openspec/changes/core-arch/specs/library-surface/spec.md` LS-6;
 * `specs/configuration/spec.md` CF-1; `specs/runner/spec.md` RN-13; `specs/admin-endpoints/spec.md` AE-1, AE-3;
 * `design.md` §12; owner decisions Q106 B, Q128 B; task 4.4a): starts a core or private process from its configuration
 * file, with the user modules the file exports, and runs it until it is signalled.
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
 * - its log on standard error, redacted by the process (CF-4, AE-6).
 * A file that cannot be loaded is handed to startup as the file, so that startup refuses it as itself (the runner's
 * `startup refused: invalid-configuration`, the process up and refused, AE-3), with the build's own modules.
 *
 * **Why startup refused, before the configuration was validated** ({@link refusalLines}). The process logs a refusal
 * with its message once the configuration is validated, and by its code only before that, when nothing yet tells the
 * file's secrets apart. The command knows more — it loaded the file —, so for a refusal of those first steps it adds
 * what `umbradb config check` would report, one line each (`umbradb run: <path>: <message> [<code>]`): the loader's
 * refusal (CF-1), a fault of the build's declarations with the file's modules (MD-2: a user module named by its place,
 * `modules[1]`), or every finding of the validation (CF-3) — the entry of a module neither the file exports nor UmbraDB
 * ships named with its id. Each step is a pure function of the file, so the command runs it again to find which one
 * refused; every line is redacted as `config check`'s report is (`configSecrets`, the URL patterns: CF-4, AE-6).
 *
 * **How it ends.** A refused or halted process stays up until it is stopped (IN-12, AE-3), the admin endpoints saying
 * why; so the command always runs until SIGTERM or SIGINT (Ctrl-C), which stop the process cleanly (RN-13: the height
 * in progress finishes, nothing else starts, the module API, the node client, the database and the admin listener
 * close). A second signal is not listened for: Node.js's default ends the command at once. The command then resolves
 * with how processing ended: `refused` or `failed` (a halt) is a failure (exit 1), anything else — the stop itself, the
 * core's stop height, an upgrade boundary — is not (exit 0).
 */

import { privateIntake } from "../backbone/core-private-source/index.js";
import { nodeSourceOf } from "../backbone/core-block-fetch/node-source.js";
import type { ProcessSide } from "../config/core-settings.js";
import { type LoadedConfig, loadConfig } from "../config/load.js";
import { redactor } from "../config/redact.js";
import { configSecrets, validateConfig } from "../config/validate.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { type ProcessHandle, type ProcessingEnd, type ProcessInput, startProcess } from "../runner/process.js";
import { buildDeclarations, commandBuild } from "./build-modules.js";
import { type CheckFinding, declarationFinding, findingLine, inferSide, refusalFindings } from "./config-check.js";

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
   * How the process is started; the runner's `startProcess` unless given (a test's that serves no admin endpoints, for
   * a file refused before it is loaded, whose admin listener would take CF-4's default address).
   */
  readonly start?: (input: ProcessInput) => ProcessHandle;
}

/** The configuration and build of a file that loaded, or of one handed to startup to refuse. */
function processOf(
  options: RunOptions,
  loaded: LoadedConfig | null,
  userModules: (loaded: LoadedConfig) => readonly unknown[],
): Pick<ProcessInput, "config" | "declarations" | "source" | "side"> {
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
  return { config, declarations: commandBuild(user), source: nodeSourceOf, side: "public" };
}

/** What the command knows of the file when startup refuses it: the loaded file or its loader's refusal, and the build. */
interface Refused {
  readonly loaded: LoadedConfig | null;
  readonly loadError: unknown;
  readonly user: readonly unknown[];
  readonly side: ProcessSide;
}

/** The findings of the first of startup's steps before the validation that refuses `refused`'s file, and its secrets. */
function earlyFindings(refused: Refused): { readonly findings: readonly CheckFinding[]; readonly secrets: string[] } {
  const { loaded } = refused;
  if (loaded === null) {
    const details = (refused.loadError as { readonly details?: { readonly file?: unknown } } | null)?.details;
    return { findings: refusalFindings(refused.loadError, String(details?.file)), secrets: [] };
  }
  let declarations: DeclarationSet<ModuleDeclaration>;
  try {
    declarations = buildDeclarations(refused.user, { side: refused.side });
  } catch (error) {
    return { findings: [declarationFinding(error, refused.user)], secrets: [] };
  }
  const input = { config: loaded, declarations, side: refused.side };
  const secrets = configSecrets(input);
  try {
    validateConfig(input);
  } catch (error) {
    return { findings: refusalFindings(error, loaded.file), secrets };
  }
  return { findings: [], secrets };
}

/**
 * The lines the command adds to a refusal of startup before the configuration was validated (see the module comment):
 * one per finding, redacted; none when a later step refused (the process logged it with its message).
 */
export function refusalLines(refused: Refused): string[] {
  let found: ReturnType<typeof earlyFindings>;
  try {
    found = earlyFindings(refused);
  } catch {
    // Not one of the refusals of these steps: the process logged it.
    return [];
  }
  const redact = redactor(found.secrets);
  return found.findings.map((finding) => redact.text(`umbradb run: ${findingLine(finding).trimStart()}`));
}

/**
 * Runs the process of `options` until it is stopped (see the module comment) and resolves with how processing ended
 * (null if it never started).
 */
export async function runProcess(options: RunOptions, seams: RunSeams = {}): Promise<ProcessingEnd | null> {
  const stop = stopSignal(seams.signals ?? process);
  try {
    let loaded: LoadedConfig | null = null;
    let loadError: unknown;
    try {
      loaded = await loadConfig({ ...(options.file === undefined ? {} : { file: options.file }), cwd: options.cwd });
    } catch (error) {
      loadError = error;
    }
    const userModules = seams.userModules ?? ((file: LoadedConfig) => file.modules);
    const input = processOf(options, loaded, userModules);
    const handle = (seams.start ?? startProcess)({ ...input, signal: stop.signal, log: options.log });
    seams.started?.(handle);
    handle.started.catch(() => {
      const user = loaded === null ? [] : userModules(loaded);
      for (const line of refusalLines({ loaded, loadError, user, side: input.side ?? "public" })) options.log(line);
    });
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
