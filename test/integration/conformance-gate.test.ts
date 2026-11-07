import type { ChildProcess } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { guardPid, spawnChild } from "../child-processes.js";

/**
 * The conformance gate's deadline on its Vitest run (`scripts/conformance-gate.mjs`): a run whose test worker hangs where
 * no test timeout reaches it — V8's fatal path while freeing WebAssembly, a busy loop inside PGlite — ends the gate with
 * a named failure once the deadline passes, and the kill reaches Vitest's whole process tree, its forked workers too.
 * The gate is copied into a scratch repository root whose `node_modules/vitest/vitest.mjs` is a stand-in
 * (`conformance-gate.vitest-stand-in.mjs`), so the gate under test is the committed file, unchanged, with nothing in it
 * that only a test uses. [docs/issues/00027, docs/issues/00054]
 *
 * The hung stand-in holds at a named point: it writes its pid and its grandchild's once both ignore SIGTERM and its
 * event loop is about to block for good. The negative controls: a run that ends on its own passes its exit code through
 * untouched by the deadline, and killing the stand-in alone leaves its grandchild running, so the test's check that no
 * process survives the gate can fail. [docs/issues/00027, docs/issues/00054]
 */

const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const GATE = join(REPOSITORY, "scripts/conformance-gate.mjs");
const STAND_IN = fileURLToPath(new URL("./conformance-gate.vitest-stand-in.mjs", import.meta.url));

/** The deadline the hung run gets: long enough for the stand-in to start its grandchild and hold on a loaded machine. */
const DEADLINE_MS = 5_000;
/** The SIGTERM grace the hung run gets before SIGKILL; both stand-in processes ignore SIGTERM. */
const GRACE_MS = 500;
/** How long the test waits for the gate to end on its own before calling it hung. */
const GATE_BOUND_MS = 30_000;
/** How long killed processes may take to be gone (reaped) on a loaded machine. */
const GONE_MS = 10_000;
const TEST_MS = GATE_BOUND_MS + GONE_MS + 20_000;

interface Pids {
  readonly child: number;
  readonly grandchild: number;
}

interface GateRun {
  /** The gate's exit code, `null` if a signal ended it, `undefined` if it was still running at the bound. */
  readonly code: number | null | undefined;
  readonly stdout: string;
  readonly stderr: string;
}

/** True while `pid` names a process (one of another user would answer EPERM). */
function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

/** Waits up to {@link GONE_MS} for every pid to be gone and returns those still alive. */
async function survivors(pids: readonly number[]): Promise<number[]> {
  const until = Date.now() + GONE_MS;
  while (pids.some(alive) && Date.now() < until) await sleep(50);
  return pids.filter(alive);
}

/** A scratch repository root holding a copy of the gate, with the stand-in as Vitest's CLI entry. */
function scratchRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "umbradb-conformance-gate-"));
  mkdirSync(join(root, "scripts"));
  mkdirSync(join(root, "node_modules", "vitest"), { recursive: true });
  copyFileSync(GATE, join(root, "scripts", "conformance-gate.mjs"));
  copyFileSync(STAND_IN, join(root, "node_modules", "vitest", "vitest.mjs"));
  return root;
}

/** The environment of a run: this process's, without any deadline setting it inherited, plus `extra`. */
function runEnv(extra: Record<string, string>): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  delete env.UMBRADB_CONFORMANCE_DEADLINE_MS;
  delete env.UMBRADB_CONFORMANCE_KILL_GRACE_MS;
  delete env.CONFORMANCE_GATE_STAND_IN;
  delete env.CONFORMANCE_GATE_STAND_IN_PIDS;
  return { ...env, ...extra };
}

/** The pids the hung stand-in wrote, each listed with this process's orphan guard; `undefined` if it never held. */
function readPids(path: string): Pids | undefined {
  if (!existsSync(path)) return undefined;
  const pids = JSON.parse(readFileSync(path, "utf8")) as Pids;
  guardPid(pids.child);
  guardPid(pids.grandchild);
  return pids;
}

/** SIGKILL to `pid` (or a process group, when negative), if it is still there. */
function kill(pid: number): void {
  try {
    process.kill(pid, "SIGKILL");
  } catch {
    // Already gone.
  }
}

/**
 * Runs the gate copy under `root` in a process group of its own and waits up to {@link GATE_BOUND_MS} for it to end;
 * `cleanup` then kills the gate's group whatever happened.
 */
async function runGate(root: string, env: NodeJS.ProcessEnv): Promise<GateRun & { readonly gate: ChildProcess }> {
  const gate = spawnChild(process.execPath, [join(root, "scripts", "conformance-gate.mjs")], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let stdout = "";
  let stderr = "";
  gate.stdout!.setEncoding("utf8").on("data", (chunk: string) => (stdout += chunk));
  gate.stderr!.setEncoding("utf8").on("data", (chunk: string) => (stderr += chunk));
  const code = await new Promise<number | null | undefined>((resolve) => {
    const timer = setTimeout(() => resolve(undefined), GATE_BOUND_MS);
    gate.once("exit", (exitCode) => {
      clearTimeout(timer);
      resolve(exitCode);
    });
  });
  return { gate, code, stdout, stderr };
}

describe("conformance gate — the deadline on its Vitest run", () => {
  it(
    "a run that never ends fails the gate at the deadline, naming it, and its whole process tree is killed",
    async () => {
      const root = scratchRoot();
      const pidsPath = join(root, "stand-in-pids.json");
      let gate: ChildProcess | undefined;
      let pids: Pids | undefined;
      try {
        const run = await runGate(
          root,
          runEnv({
            UMBRADB_CONFORMANCE_DEADLINE_MS: String(DEADLINE_MS),
            UMBRADB_CONFORMANCE_KILL_GRACE_MS: String(GRACE_MS),
            CONFORMANCE_GATE_STAND_IN: "hang",
            CONFORMANCE_GATE_STAND_IN_PIDS: pidsPath,
          }),
        );
        gate = run.gate;
        pids = readPids(pidsPath);
        expect(pids, "the stand-in never reached its hold before the gate ended it").toBeDefined();
        expect(run.code, `the gate was still running after ${GATE_BOUND_MS} ms: no deadline ended it`).not.toBeUndefined();
        expect(run.code).toBe(124);
        expect(run.stderr).toContain(`ran past its deadline of ${DEADLINE_MS} ms (UMBRADB_CONFORMANCE_DEADLINE_MS)`);
        expect(run.stderr).toMatch(/test worker has most likely hung/);
        expect(run.stderr).toContain("docs/issues/00027-v8-fatal-wasm-free-hangs-test-worker.md");
        expect(run.stderr).toContain("docs/issues/00054-slow-block-case-hung-in-pglite.md");
        // No reconciliation of a report this run never wrote.
        expect(run.stdout).not.toContain("reconciling the required-tests manifest");
        expect(await survivors([pids!.child, pids!.grandchild]), "processes of the run still alive after the gate").toEqual(
          [],
        );
      } finally {
        pids ??= readPids(pidsPath);
        if (pids !== undefined) {
          kill(pids.child);
          kill(pids.grandchild);
        }
        if (gate?.pid !== undefined) kill(-gate.pid);
        rmSync(root, { recursive: true, force: true });
      }
    },
    TEST_MS,
  );

  it(
    "negative control: a run that ends on its own passes its exit code through, untouched by the deadline",
    async () => {
      const root = scratchRoot();
      let gate: ChildProcess | undefined;
      try {
        const run = await runGate(root, runEnv({ CONFORMANCE_GATE_STAND_IN: "exit:3" }));
        gate = run.gate;
        expect(run.code).toBe(3);
        expect(run.stderr).toContain("vitest produced no JSON report");
        expect(run.stderr).not.toContain("deadline");
      } finally {
        if (gate?.pid !== undefined) kill(-gate.pid);
        rmSync(root, { recursive: true, force: true });
      }
    },
    TEST_MS,
  );

  it(
    "negative control: killing the hung stand-in alone leaves its grandchild running",
    async () => {
      const root = scratchRoot();
      const pidsPath = join(root, "stand-in-pids.json");
      const standIn = spawnChild(process.execPath, [join(root, "node_modules", "vitest", "vitest.mjs")], {
        env: runEnv({ CONFORMANCE_GATE_STAND_IN: "hang", CONFORMANCE_GATE_STAND_IN_PIDS: pidsPath }),
        stdio: "ignore",
      });
      let pids: Pids | undefined;
      try {
        const until = Date.now() + GATE_BOUND_MS;
        while (!existsSync(pidsPath) && Date.now() < until) await sleep(50);
        pids = readPids(pidsPath);
        expect(pids, "the stand-in never reached its hold").toBeDefined();
        const exited = new Promise((resolve) => standIn.once("exit", resolve));
        kill(pids!.child);
        await exited;
        expect(alive(pids!.grandchild), "the grandchild should outlive a kill of its parent alone").toBe(true);
      } finally {
        if (pids !== undefined) kill(pids.grandchild);
        if (standIn.pid !== undefined) kill(standIn.pid);
        rmSync(root, { recursive: true, force: true });
      }
    },
    TEST_MS,
  );

  it("refuses a deadline or grace that is not a positive integer of milliseconds, before starting vitest", async () => {
    const bad: Array<[string, string]> = [
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", "0"],
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", "-5"],
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", "1.5"],
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", "60m"],
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", ""],
      ["UMBRADB_CONFORMANCE_DEADLINE_MS", "2147483648"],
      ["UMBRADB_CONFORMANCE_KILL_GRACE_MS", "0"],
    ];
    const root = scratchRoot();
    try {
      for (const [name, value] of bad) {
        // A started stand-in would end the gate with 3; the refusal ends it with 2 before vitest starts.
        const run = await runGate(root, runEnv({ [name]: value, CONFORMANCE_GATE_STAND_IN: "exit:3" }));
        if (run.gate.pid !== undefined) kill(-run.gate.pid);
        expect({ name, value, code: run.code }).toEqual({ name, value, code: 2 });
        expect(run.stderr).toContain(`${name} must be a positive integer of milliseconds`);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
