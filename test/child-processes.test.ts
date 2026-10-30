import { type ChildProcess, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { createInterface, type Interface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { guardPid, spawnChild } from "./child-processes.js";
import type { ParentJob } from "./child-processes.parent.js";

/**
 * The orphan guard of every test child process (`child-processes.ts`): children are orphaned on purpose — a parent
 * process starts one and is killed — and every process the parent had started must end, whether the child runs (and
 * ignores SIGTERM, as the SIGTERM-during-write test's worker does until its block ends), is stopped, has its event loop
 * blocked, or the signal reached the parent's whole process group. The committed negative control starts the same
 * children with plain `spawn`: each is still running once the same time has passed. And no test starts a child process
 * without the guard. [A153, A48; docs/issues/00015, docs/issues/00022]
 */

const PARENT = fileURLToPath(new URL("./child-processes.parent.ts", import.meta.url));
const WATCHER = fileURLToPath(new URL("./orphan-watcher.mjs", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("..", import.meta.url));

/** How long the processes a dead parent had started may take to end: the watcher acts at once; this is load's margin. */
const GUARD_MS = 15_000;
/** A test that waits {@link GUARD_MS} once, with room for starting its processes on a loaded machine. */
const TEST_MS = GUARD_MS + 60_000;

/** True while `pid` names a process (one of another user would answer EPERM). */
function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

/** The next line `lines` reads; rejects after `ms` or when the stream ends first. */
function nextLine(lines: Interface, what: string, ms = 60_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`no ${what} within ${ms} ms`)), ms);
    const onLine = (line: string) => {
      clearTimeout(timer);
      lines.off("close", onClose);
      resolve(line);
    };
    const onClose = () => {
      clearTimeout(timer);
      lines.off("line", onLine);
      reject(new Error(`the parent ended before its ${what}`));
    };
    lines.once("line", onLine);
    lines.once("close", onClose);
  });
}

/** The pids of the processes whose parent is `pid` (`pgrep -P`). */
function childrenOf(pid: number): number[] {
  try {
    return execFileSync("pgrep", ["-P", String(pid)], { encoding: "utf8" }).split("\n").filter(Boolean).map(Number);
  } catch {
    return []; // pgrep exits 1 when it finds none
  }
}

/** The command line of `pid` (`ps`), empty once it is gone. */
function commandOf(pid: number): string {
  try {
    return execFileSync("ps", ["-o", "command=", "-p", String(pid)], { encoding: "utf8" }).trim();
  } catch {
    return ""; // ps exits 1 when the process is gone
  }
}

/** How a scenario ends the parent. */
type Kill = "SIGKILL" | "SIGTERM to its process group";

interface Orphaned {
  /** The child the parent started. */
  readonly child: number;
  /**
   * Every process the parent had started when it was killed: its child, with the guard its watcher, and whatever its
   * loader runs (`tsx`'s esbuild service, which ends with its input).
   */
  readonly started: readonly number[];
  /** The parent's watchers among {@link started}. */
  readonly watchers: readonly number[];
  /** Unlists the child from this test process's own guard (the safety net below). */
  readonly unlist: () => void;
}

/**
 * Starts a parent process on `job`, waits for its child, stops the child with `SIGSTOP` if `stop`, and kills the parent
 * as `kill` says. The child is also listed with this test process's own guard, so that a child left running by a failed
 * check is still killed when this process ends.
 */
async function orphan(job: ParentJob, kill: Kill, stop = false): Promise<Orphaned> {
  const parent = spawnChild(process.execPath, ["--import", "tsx", PARENT, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "ignore"],
    detached: kill !== "SIGKILL",
  });
  const exited = new Promise<void>((resolve) => parent.once("exit", () => resolve()));
  const lines = createInterface({ input: parent.stdout! });
  const { child } = JSON.parse(await nextLine(lines, "child's pid")) as { child: number };
  const unlist = guardPid(child);
  const started = childrenOf(parent.pid!);
  expect(started).toContain(child);
  const watchers = started.filter((pid) => commandOf(pid).includes("orphan-watcher.mjs"));
  if (stop) process.kill(child, "SIGSTOP");
  if (kill === "SIGKILL") parent.kill("SIGKILL");
  else process.kill(-parent.pid!, "SIGTERM");
  await exited;
  return { child, started, watchers, unlist };
}

/** Every one of `pids` ends within {@link GUARD_MS}. */
async function expectAllEnd(pids: readonly number[]): Promise<void> {
  const deadline = Date.now() + GUARD_MS;
  while (pids.some(alive) && Date.now() < deadline) await sleep(50);
  expect(pids.filter(alive), "processes still running after their parent died").toEqual([]);
}

/** The assertion error `check` fails with; fails the test if `check` passes or fails otherwise. */
async function assertionFailure(check: Promise<unknown>): Promise<Error> {
  try {
    await check;
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed, but the negative control must make it fail");
}

/** The scenarios: what the child does, whether it is stopped, and how its parent dies. */
const SCENARIOS: readonly { readonly name: string; readonly child: ParentJob["child"]; readonly stop: boolean; readonly kill: Kill }[] = [
  { name: "a running child that ignores SIGTERM, its parent killed with SIGKILL", child: "running", stop: false, kill: "SIGKILL" },
  { name: "a stopped child (SIGSTOP, as A17's pause), its parent killed with SIGKILL", child: "running", stop: true, kill: "SIGKILL" },
  { name: "a child whose event loop is blocked (as PGlite's hung engine), its parent killed with SIGKILL", child: "blocked", stop: false, kill: "SIGKILL" },
  { name: "a running child that ignores SIGTERM, SIGTERM sent to its parent's whole process group", child: "running", stop: false, kill: "SIGTERM to its process group" },
];

describe("the orphan guard: a test's child processes end when the test process ends (A153)", () => {
  it.each(SCENARIOS)("ends $name, and the watcher with it", async ({ child, stop, kill }) => {
    const orphaned = await orphan({ guarded: true, child }, kill, stop);
    expect(orphaned.watchers).toHaveLength(1);
    await expectAllEnd(orphaned.started);
    orphaned.unlist();
  }, TEST_MS);

  it("negative control: the same children started with plain spawn are still running once the time has passed", async () => {
    const orphans = await Promise.all(SCENARIOS.map(({ child, stop, kill }) => orphan({ guarded: false, child }, kill, stop)));
    try {
      for (const orphaned of orphans) expect(orphaned.watchers).toEqual([]);
      const failures = await Promise.all(orphans.map((orphaned) => assertionFailure(expectAllEnd([orphaned.child]))));
      for (const failure of failures) expect(failure.message).toMatch(/processes still running after their parent died/);
    } finally {
      for (const orphaned of orphans) {
        if (alive(orphaned.child)) process.kill(orphaned.child, "SIGKILL");
        orphaned.unlist();
      }
    }
  }, TEST_MS);

  it("keeps nothing alive: a parent whose child has exited ends by itself, and so does its watcher", async () => {
    const parent = spawnChild(process.execPath, ["--import", "tsx", PARENT, JSON.stringify({ guarded: true, child: "exits" })], {
      cwd: REPOSITORY,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const exited = new Promise<number | null>((resolve) => parent.once("exit", (code) => resolve(code)));
    const lines = createInterface({ input: parent.stdout! });
    await nextLine(lines, "child's pid");
    const started = childrenOf(parent.pid!);
    expect(JSON.parse(await nextLine(lines, "child's exit"))).toEqual({ exited: true });
    expect(await Promise.race([exited, sleep(GUARD_MS).then(() => "still running")])).toBe(0);
    await expectAllEnd(started);
  }, TEST_MS);

  describe("the watcher's input", () => {
    /** A watcher of its own, in a process group of its own (so a pid misread as 0 could only kill that group). */
    function watcher(): { readonly process: ChildProcess; readonly exited: Promise<[number | null, NodeJS.Signals | null]> } {
      const started = spawnChild(process.execPath, [WATCHER], { stdio: ["pipe", "ignore", "ignore"], detached: true });
      const exited = new Promise<[number | null, NodeJS.Signals | null]>((resolve) =>
        started.once("exit", (code, signal) => resolve([code, signal])),
      );
      return { process: started, exited };
    }

    /** A process that waits until it is killed, listed with this test process's guard. */
    function bystander(): ChildProcess {
      return spawnChild(process.execPath, ["--no-warnings", "-e", "setInterval(() => undefined, 1 << 30)"], { stdio: "ignore" });
    }

    it("kills what it lists when its input ends, and nothing it unlisted, nor a line its input ended in", async () => {
      const [listed, alsoListed, unlisted, cut] = [bystander(), bystander(), bystander(), bystander()];
      try {
        const own = watcher();
        // One write, several lines: each line counts.
        own.process.stdin!.end(`+${listed.pid}\n+${alsoListed.pid}\n+${unlisted.pid}\n-${unlisted.pid}\n+${cut.pid}`);
        expect(await own.exited).toEqual([0, null]);
        await expectAllEnd([listed.pid!, alsoListed.pid!]);
        // These are this process's children: one killed stays a zombie, which `kill(pid, 0)` still finds, until this
        // process has seen its exit; so their own exit is what is checked, a moment after the watcher's kills.
        await sleep(1_000);
        expect([unlisted, cut].map((child) => child.signalCode)).toEqual([null, null]);
      } finally {
        for (const process of [listed, alsoListed, unlisted, cut]) process.kill("SIGKILL");
      }
    }, TEST_MS);

    it("is given only a child's pid: guardPid refuses 0, 1, a negative, a fraction and NaN", () => {
      for (const pid of [0, 1, -1, 1.5, Number.NaN]) expect(() => guardPid(pid), String(pid)).toThrow(/not a child's pid/);
    });

    it("reads only pids above 1: 0 (its own process group), 1, a leading zero and other text are ignored", async () => {
      const own = watcher();
      own.process.stdin!.end("+0\n+1\n+01\n+1e3\n+x\n-\n\n");
      expect(await own.exited).toEqual([0, null]);
    }, TEST_MS);
  });
});

// ── no test starts a child process without the guard ───────────────────────────────────────────────────────────────

interface SourceFile {
  readonly path: string;
  readonly text: string;
}

/** The ways of `node:child_process` to start a process that runs on while the test does (its `Sync` ones block it). */
const ASYNC_STARTS = new Set(["spawn", "fork", "exec", "execFile"]);
const MODULE = String.raw`["'](?:node:)?child_process["']`;
const IMPORT = new RegExp(String.raw`import\s+([^;]*?)\s+from\s+${MODULE}`, "g");
const LOADED = new RegExp(String.raw`(?:require|import)\s*\(\s*${MODULE}\s*\)`);

/**
 * The files that may start children otherwise: the guard itself, the negative control's parent, this file (it plants the
 * forbidden imports in its negative controls), and the conformance gate test's stand-in for Vitest, whose grandchild
 * must be unguarded so that the test shows the gate's own kill reaching it (the test lists both pids with the guard
 * once it reads them). [docs/issues/00027, docs/issues/00054]
 */
const UNGUARDED = new Set([
  "test/child-processes.ts",
  "test/child-processes.parent.ts",
  "test/child-processes.test.ts",
  "test/integration/conformance-gate.vitest-stand-in.mjs",
]);

/** Every way the files start a child process without {@link spawnChild}. */
function unguardedStarts(files: readonly SourceFile[]): string[] {
  const found: string[] = [];
  for (const file of files) {
    if (UNGUARDED.has(file.path)) continue;
    const text = file.text
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line))
      .join("\n");
    for (const [, clause] of text.matchAll(IMPORT)) {
      const bindings = clause!.trim();
      if (/^type\s/.test(bindings)) continue;
      const named = /^\{([^}]*)\}$/.exec(bindings);
      if (named === null) {
        found.push(`${file.path}: imports node:child_process whole (${bindings})`);
        continue;
      }
      for (const binding of named[1]!.split(",").map((part) => part.trim())) {
        const name = binding.replace(/\s+as\s+.*$/, "");
        if (ASYNC_STARTS.has(name)) found.push(`${file.path}: imports ${name} from node:child_process`);
      }
    }
    if (LOADED.test(text)) found.push(`${file.path}: loads node:child_process with require or import()`);
  }
  return found;
}

const SOURCE = new Set([".ts", ".mts", ".cts", ".js", ".mjs", ".cjs"]);

/** Every source file under `test/` that git tracks or would track (untracked included, ignored not). */
function testFiles(): SourceFile[] {
  const listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "test"], {
    cwd: REPOSITORY,
    encoding: "utf8",
  });
  return listed
    .split("\0")
    .filter((path) => path !== "" && SOURCE.has(extname(path)))
    .flatMap((path) => {
      try {
        return [{ path, text: readFileSync(join(REPOSITORY, path), "utf8") }];
      } catch {
        return []; // listed by git but deleted in the working tree
      }
    });
}

describe("every test child process is started with the guard", () => {
  const files = testFiles();

  it("finds no other start of a child process under test/", () => {
    expect(unguardedStarts(files)).toEqual([]);
  });

  it("reads the files that start children, each through spawnChild", () => {
    expect(files.length).toBeGreaterThan(200);
    const starters = files.filter((file) => /\bspawnChild\(/.test(file.text)).map((file) => file.path);
    expect(starters).toEqual(
      expect.arrayContaining([
        "test/db/pglite-processes.ts",
        "test/db/pglite-timeouts.test.ts",
        "test/postgres/setup.ts",
        "test/runner/crash.test.ts",
        "test/runner/sigterm.test.ts",
        "test/tape/command.test.ts",
      ]),
    );
  });

  it("negative controls: each way of starting a child without the guard is caught", () => {
    const planted = [
      'import { spawn } from "node:child_process";',
      'import { type ChildProcess, fork } from "child_process";',
      "import { execFile as run } from 'node:child_process';",
      'import { exec, spawnSync } from "node:child_process";',
      'import * as processes from "node:child_process";',
      'import processes from "node:child_process";',
      'const { spawn } = require("node:child_process");',
      'const { spawn } = await import("child_process");',
    ];
    for (const text of planted) expect(unguardedStarts([{ path: "test/planted.ts", text }]), text).toHaveLength(1);
    const harmless = [
      'import { execFileSync, spawnSync } from "node:child_process";',
      'import type { ChildProcess } from "node:child_process";',
      'import { type ChildProcess, type SpawnOptions } from "node:child_process";',
      '// import { spawn } from "node:child_process";',
      'import { spawnChild } from "../child-processes.js";',
    ];
    for (const text of harmless) expect(unguardedStarts([{ path: "test/planted.ts", text }]), text).toEqual([]);
  });
});
