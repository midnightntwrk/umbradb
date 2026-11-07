import type { ChildProcess } from "node:child_process";
import { readdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { statusWhen } from "../admin/admin-harness.js";
import { type ChainBlock, chainOf, finalized, hex, opening, RUNTIME } from "../backbone/fetch-fixtures.js";
import { spawnChild } from "../child-processes.js";
import type { CliProject } from "../cli/cli-fixtures.js";
import { adminPortIn, type RunningCommand, runCoreSettings } from "../cli/run-fixtures.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * What the ignored-signal tests share: a chain whose heights keep committing for minutes, a configuration of `umbradb
 * run` without `backupOnSignal`, the command's stand-in for the negative control (`./signal-ignored.worker.ts`), and
 * two oracles: [A175, BK-1, Q173 C]
 *
 * - {@link sigusr2Ignored}: SIGUSR2 sent to a running `umbradb run` while blocks commit is logged as ignored in one
 *   line naming the signal and `backupOnSignal`; no file is written; heights keep committing; SIGTERM then ends it with
 *   exit 0.
 * - {@link listenerProblems}: a process a host program starts with `startProcess` without `backupOnSignal` leaves
 *   `process.listenerCount("SIGUSR2")` as it was while it starts, runs and closes.
 *
 * **The chain** is synthetic, as `test/cli/run-fixtures.ts`'s: blocks 0 to {@link PACED_HEAD}, the head read at once,
 * but every `chain_getBlockHash` of a height from 2 answered {@link PACE_MS} after the call (a tape call record's
 * `delayMs`), so the node source's prefetch (8 at once) brings at most about 16 heights a second: the process keeps
 * committing for minutes, long past what a test needs.
 */

/** The paced chain's last block (see the module comment). */
export const PACED_HEAD = 3_000n;

/** How long the tape node takes to answer each height's `chain_getBlockHash` from height 2. */
export const PACE_MS = 500;

const PACED: readonly ChainBlock[] = Object.freeze(chainOf(PACED_HEAD));

/** The paced chain's genesis hash, for the `core` entry. */
export const PACED_GENESIS = hex((PACED[0] as ChainBlock).hash);

/** The paced chain's tape (see the module comment). */
export function pacedTape(): TapeRecord[] {
  const at = (height: bigint) => PACED[Number(height)] as ChainBlock;
  const records: TapeRecord[] = [...opening(at(0n), at(PACED_HEAD)), ...finalized(at(1n), RUNTIME, true)];
  for (let height = 2n; height <= PACED_HEAD; height++) {
    const [hash, ...content] = finalized(at(height));
    records.push({ ...(hash as Extract<TapeRecord, { method: string; result: unknown }>), delayMs: PACE_MS }, ...content);
  }
  return records;
}

/** A tape node serving {@link pacedTape}. */
export function pacedNode(): Promise<TapeNode> {
  return TapeNode.start({ records: pacedTape() });
}

/**
 * Writes `umbradb run`'s configuration file `name` in `project`: the `core` entry alone, on `database`, reading the
 * paced chain from `node`, its admin listener on a free loopback port, `extra` added (none sets `backupOnSignal` in
 * these tests); returns its absolute path. [A175]
 */
export function writeRunConfig(
  project: CliProject,
  name: string,
  database: DatabaseParts,
  node: string,
  extra: Readonly<Record<string, unknown>> = {},
): string {
  return project.write(
    name,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
      `const core = coreEntry({ start: 1, config: ${runCoreSettings(database, node, { genesisHash: PACED_GENESIS, ...extra })} });`,
      "export default defineConfig({ entries: [core] });",
      "",
    ].join("\n"),
  );
}

const WORKER = fileURLToPath(new URL("./signal-ignored.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** How `./signal-ignored.worker.ts` gets SIGUSR2 for the process: the command's own way, or none of it (a control). */
export type WorkerSignals = "command" | "unconnected";

/** What `./signal-ignored.worker.ts` runs: `runProcess` on `configFile` in `cwd`, SIGUSR2 as `signals` says. */
export interface IgnoredJob {
  readonly configFile: string;
  readonly cwd: string;
  readonly signals: WorkerSignals;
}

/** `./signal-ignored.worker.ts` in a child process, as {@link RunningCommand} (the command's own shape). */
export function runWorkerInChild(job: IgnoredJob): RunningCommand {
  const child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return watched(child);
}

/** A child's output as it comes, its exit (−1 for a signal), and its admin port once logged. */
export function watched(child: ChildProcess): RunningCommand {
  let out = "";
  let err = "";
  child.stdout?.setEncoding("utf8").on("data", (chunk: string) => {
    out += chunk;
  });
  child.stderr?.setEncoding("utf8").on("data", (chunk: string) => {
    err += chunk;
  });
  let ended = false;
  const exited = new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => {
      ended = true;
      resolve(code ?? -1);
    });
  });
  return {
    child,
    stdout: () => out,
    stderr: () => err,
    exited,
    async adminPort(patienceMs) {
      const deadline = Date.now() + patienceMs;
      for (;;) {
        const port = adminPortIn(err);
        if (port !== null) return port;
        if (ended) throw new Error(`the command ended before its admin listener listened:\n${out}\n${err}`);
        if (Date.now() > deadline) throw new Error(`no admin listener within ${patienceMs} ms:\n${out}\n${err}`);
        await sleep(25);
      }
    },
  };
}

/** The log lines that mention SIGUSR2. */
export const signalLines = (log: string): string[] => log.split("\n").filter((line) => line.includes("SIGUSR2"));

/**
 * Every file and directory under `dir` (relative), the database `skip` left out: the directory, what is under it, and
 * PGlite's writer lock beside it (`<skip>.lock.sqlite` and its journal). [DB-11]
 */
function namesUnder(dir: string, skip: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((name) => {
      const top = name.split("/")[0] as string;
      return top !== skip && !top.startsWith(`${skip}.lock.`);
    })
    .sort();
}

/**
 * The oracle for `umbradb run` (see the module comment): `run` is a running command on the paced chain whose working
 * directory is `cwd`, its database the directory `database` under it. Once at least height 3 has committed it is sent
 * SIGUSR2; then it must log exactly one line naming SIGUSR2 and `backupOnSignal`, still be running, commit at least
 * three more heights, have written nothing in `cwd` outside its database, and exit 0 on SIGTERM. Throws naming the
 * first part that fails; the command is ended either way. [A175]
 */
export async function sigusr2Ignored(run: RunningCommand, cwd: string, database: string, patienceMs: number): Promise<void> {
  try {
    const origin = `http://127.0.0.1:${await run.adminPort(patienceMs)}`;
    const committed = (at: bigint) => (body: { state: string; cursor: string | null }) => {
      if (body.state === "refused" || body.state === "halted") throw new Error(`the process ${body.state}:\n${run.stderr()}`);
      return body.cursor !== null && BigInt(body.cursor) >= at;
    };
    await statusWhen(origin, committed(3n), patienceMs);
    const before = namesUnder(cwd, database);
    run.child.kill("SIGUSR2");
    const deadline = Date.now() + patienceMs;
    while (signalLines(run.stderr()).length === 0) {
      if (run.child.exitCode !== null || run.child.signalCode !== null) {
        throw new Error(
          `the command ended on SIGUSR2 (exit ${String(run.child.exitCode)}, signal ${String(run.child.signalCode)}), ` +
            `logging nothing of it:\n${run.stderr()}`,
        );
      }
      if (Date.now() > deadline) throw new Error(`no line logged of SIGUSR2 within ${patienceMs} ms:\n${run.stderr()}`);
      await sleep(25);
    }
    const lines = signalLines(run.stderr());
    if (lines.length !== 1 || !(lines[0] as string).includes("backupOnSignal") || !/ignored/.test(lines[0] as string)) {
      throw new Error(`not one line saying SIGUSR2 was ignored, naming backupOnSignal: ${JSON.stringify(lines)}`);
    }
    // Heights keep committing after the signal.
    const at = await statusWhen(origin, () => true, patienceMs);
    if (at.cursor === null || BigInt(at.cursor) >= PACED_HEAD - 3n) throw new Error(`the chain ran out: cursor ${String(at.cursor)}`);
    await statusWhen(origin, committed(BigInt(at.cursor) + 3n), patienceMs);
    if (run.child.exitCode !== null || run.child.signalCode !== null) throw new Error("the command ended after SIGUSR2");
    run.child.kill("SIGTERM");
    const code = await Promise.race([
      run.exited,
      sleep(patienceMs).then(() => {
        throw new Error(`the command did not exit within ${patienceMs} ms of SIGTERM:\n${run.stderr()}`);
      }),
    ]);
    if (code !== 0) throw new Error(`the command exited ${code} on SIGTERM:\n${run.stderr()}`);
    const after = namesUnder(cwd, database);
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      throw new Error(`files written outside the database: before ${JSON.stringify(before)}, after ${JSON.stringify(after)}`);
    }
    if (/backup on signal|backup to /.test(run.stderr())) throw new Error(`a backup was asked for:\n${run.stderr()}`);
    if (signalLines(run.stderr()).length !== 1) throw new Error(`more SIGUSR2 lines: ${JSON.stringify(signalLines(run.stderr()))}`);
  } finally {
    run.child.kill("SIGKILL");
  }
}

/** What {@link listenerProblems} watches: a process started, run to a height, and stopped. */
export interface ListenedRun {
  /** Starts the process. */
  start(): Promise<void>;
  /** Resolves once the process has committed a few heights. */
  running(): Promise<void>;
  /** Stops and closes the process. */
  stop(): Promise<void>;
}

/**
 * The oracle for a host program's process (see the module comment): `process.listenerCount("SIGUSR2")` before
 * `run` starts, once it runs and once it has closed; while it runs `whileRunning` more than before (0 for a process
 * without `backupOnSignal`, 1 with it), once closed as many as before. Resolves with every difference found, none when
 * it holds. [A175]
 */
export async function listenerProblems(run: ListenedRun, whileRunning = 0): Promise<string[]> {
  const before = process.listenerCount("SIGUSR2");
  const problems: string[] = [];
  await run.start();
  try {
    await run.running();
    const running = process.listenerCount("SIGUSR2");
    if (running - before !== whileRunning) {
      problems.push(`while it runs: ${running - before} SIGUSR2 listeners added, not ${whileRunning}`);
    }
  } finally {
    await run.stop();
  }
  const after = process.listenerCount("SIGUSR2");
  if (after !== before) problems.push(`once it has closed: ${after - before} SIGUSR2 listeners left, not 0`);
  return problems;
}
