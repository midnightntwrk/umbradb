import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { spawnChild } from "../child-processes.js";

// A characterization test of the operating-system lock the PGlite backend takes in Node.js. A process opens `<data
// directory>.lock.sqlite` with the built-in `node:sqlite` (`DatabaseSync`), sets `busy_timeout` to 0 and runs `BEGIN
// EXCLUSIVE`, never committing. SQLite's file locks are operating-system locks: a second process is refused at once
// while the holder lives — also while it is stopped with SIGSTOP — and a new process takes the lock at once after the
// holder is killed with SIGKILL. These tests exercise Node.js and SQLite, not UmbraDB code.
// [Q50; design §4 "Writer lock", §14]

/**
 * The lock-taking process. It prints one JSON line: `{ locked: true }` once `BEGIN EXCLUSIVE` succeeded, or
 * `{ locked: false, ... }` with SQLite's error when it was refused. With `hold` it then keeps the transaction open
 * until it is killed; with `try` it exits.
 */
const LOCK_PROCESS = `
const { DatabaseSync } = require("node:sqlite");
const [, file, mode] = process.argv;
const db = new DatabaseSync(file);
db.exec("PRAGMA busy_timeout = 0");
const started = performance.now();
try {
  db.exec("BEGIN EXCLUSIVE");
} catch (error) {
  const ms = performance.now() - started;
  process.stdout.write(JSON.stringify({ locked: false, message: error.message, errcode: error.errcode, ms }) + "\\n");
  process.exit(0);
}
process.stdout.write(JSON.stringify({ locked: true, ms: performance.now() - started }) + "\\n");
if (mode === "hold") setInterval(() => {}, 1 << 30);
else process.exit(0);
`;

type LockResult = { locked: boolean; message?: string; errcode?: number; ms: number };

let dir: string;
let lockFile: string;
const children: ChildProcess[] = [];

/** Starts a lock process and resolves with its first report, together with the process. */
async function startLockProcess(mode: "hold" | "try"): Promise<{ child: ChildProcess; result: LockResult }> {
  const child = spawnChild(process.execPath, ["--no-warnings", "-e", LOCK_PROCESS, lockFile, mode], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => (stderr += chunk.toString()));
  const lines = createInterface({ input: child.stdout! });
  const exited = once(child, "exit").then(([code, signal]) => {
    throw new Error(`lock process exited (${String(code)}, ${String(signal)}) before reporting: ${stderr}`);
  });
  const [line] = (await Promise.race([once(lines, "line"), exited])) as [string];
  lines.close();
  return { child, result: JSON.parse(line) as LockResult };
}

/** Kills the process with `signal` and waits until the operating system reports it gone. */
async function kill(child: ChildProcess, signal: NodeJS.Signals): Promise<void> {
  const exited = once(child, "exit");
  child.kill(signal);
  await exited;
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "umbradb-sqlite-lock-"));
  lockFile = join(dir, "pgdata.lock.sqlite");
});

afterEach(async () => {
  for (const child of children.splice(0)) {
    if (child.exitCode === null && child.signalCode === null) await kill(child, "SIGKILL");
  }
  rmSync(dir, { recursive: true, force: true });
});

describe("node:sqlite — BEGIN EXCLUSIVE as an operating-system writer lock (DB-11)", () => {
  it("refuses a second process at once while the holder runs", async () => {
    const holder = await startLockProcess("hold");
    expect(holder.result.locked).toBe(true);

    const second = await startLockProcess("try");
    expect(second.result).toMatchObject({ locked: false, message: "database is locked", errcode: 5 });
    expect(second.result.ms).toBeLessThan(1_000);
  });

  it("refuses a second process while the holder is stopped with SIGSTOP, and frees the lock after SIGKILL", async () => {
    const holder = await startLockProcess("hold");
    expect(holder.result.locked).toBe(true);
    expect(holder.child.kill("SIGSTOP")).toBe(true);

    const whileStopped = await startLockProcess("try");
    expect(whileStopped.result).toMatchObject({ locked: false, message: "database is locked", errcode: 5 });

    await kill(holder.child, "SIGKILL");
    const afterKill = await startLockProcess("try");
    expect(afterKill.result.locked).toBe(true);
  });

  it("lets a new process take the lock at once after the running holder is killed with SIGKILL", async () => {
    const holder = await startLockProcess("hold");
    expect(holder.result.locked).toBe(true);

    await kill(holder.child, "SIGKILL");
    const next = await startLockProcess("hold");
    expect(next.result.locked).toBe(true);
    expect(next.result.ms).toBeLessThan(1_000);

    // The new holder now refuses others in turn.
    const third = await startLockProcess("try");
    expect(third.result).toMatchObject({ locked: false, message: "database is locked", errcode: 5 });
  });
});
