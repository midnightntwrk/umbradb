import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnChild } from "../child-processes.js";

/**
 * A child process for the library's quiet-host criteria: a script of the tests (`node --import tsx`) run with one
 * job, whose standard output and standard error the parent reads whole — every byte the process wrote, its worker
 * threads' and PGlite's included, which no stub of `process.stdout` in the test's own process could see. The child
 * writes what it observed to a result file (never to its streams), which the parent reads after it exited.
 */

const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** What a child run gave: its exit, its two streams' whole text, and the result it wrote. */
export interface QuietRun<Result> {
  readonly code: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly result: Result | null;
}

/** How long a child may run on a loaded machine. */
export const CHILD_PATIENCE_MS = 240_000;

/**
 * Runs `script` (relative to this directory) with `job` (its argument, as JSON, with `resultFile` added) and resolves
 * once it exited, or kills it after {@link CHILD_PATIENCE_MS}.
 */
export async function runQuietChild<Result>(
  script: string,
  job: Readonly<Record<string, unknown>>,
  env: Readonly<Record<string, string>> = {},
): Promise<QuietRun<Result>> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-quiet-child-"));
  const resultFile = join(dir, "result.json");
  try {
    const child = spawnChild(
      process.execPath,
      ["--import", "tsx", fileURLToPath(new URL(script, import.meta.url)), JSON.stringify({ ...job, resultFile })],
      { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...env } },
    );
    let stdout = "";
    let stderr = "";
    child.stdout!.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr!.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    const timer = setTimeout(() => child.kill("SIGKILL"), CHILD_PATIENCE_MS);
    try {
      await once(child, "close");
    } finally {
      clearTimeout(timer);
    }
    let result: Result | null = null;
    try {
      result = JSON.parse(readFileSync(resultFile, "utf8")) as Result;
    } catch {
      result = null;
    }
    return { code: child.exitCode, signal: child.signalCode, stdout, stderr, result };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
