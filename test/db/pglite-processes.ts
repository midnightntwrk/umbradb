import { PGlite } from "@electric-sql/pglite";
import { type ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import type { Job, WorkerEvent } from "./pglite-writer.worker.js";

/**
 * The parent side of A17's process tests (DB-11): PGlite writers in processes of their own (`pglite-writer.worker.ts`,
 * started with `node --import tsx`), their events, signals, and a read-back of what was written. Each test works in a
 * temporary directory of its own ({@link workDirectory}), deleted by {@link cleanUp} with every process still alive
 * killed first.
 */

const WORKER = fileURLToPath(new URL("./pglite-writer.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** A worker process and what it reported so far. */
export interface WriterProcess {
  readonly child: ChildProcess;
  readonly events: WorkerEvent[];
  /** Resolves with the first event (already reported or later) that `match` accepts; rejects after `timeoutMs`. */
  next(match: (event: WorkerEvent) => boolean, timeoutMs?: number): Promise<WorkerEvent>;
  /** The highest height the process reported committed, if any. */
  lastCommitted(): number | undefined;
  /** Resolves when the process has exited. */
  readonly exited: Promise<void>;
  /** Sends `signal` and, for one that ends the process, waits until the operating system reports it gone. */
  signal(signal: NodeJS.Signals): Promise<void>;
}

const started: WriterProcess[] = [];
const directories: string[] = [];

/** A new temporary directory, deleted by {@link cleanUp}; the data directory to use is `<it>/pgdata`. */
export function workDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "umbradb-writer-lock-"));
  directories.push(directory);
  return directory;
}

/** Starts a worker process on `job`. */
export function startWriterProcess(job: Job): WriterProcess {
  const child = spawn(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const events: WorkerEvent[] = [];
  const waiters: { match: (event: WorkerEvent) => boolean; resolve: (event: WorkerEvent) => void }[] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  createInterface({ input: child.stdout! }).on("line", (line) => {
    if (!line.startsWith("{")) return;
    const event = JSON.parse(line) as WorkerEvent;
    events.push(event);
    for (const waiter of [...waiters]) {
      if (waiter.match(event)) {
        waiters.splice(waiters.indexOf(waiter), 1);
        waiter.resolve(event);
      }
    }
  });
  // "close", not "exit": it comes after the last line of stdout was delivered.
  const exited = once(child, "close").then(() => undefined);
  const worker: WriterProcess = {
    child,
    events,
    exited,
    next(match, timeoutMs = 60_000) {
      const found = events.find(match);
      if (found !== undefined) return Promise.resolve(found);
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`no matching event within ${timeoutMs} ms; events: ${JSON.stringify(events.slice(-5))}; stderr: ${stderr.slice(-2000)}`));
        }, timeoutMs);
        const waiter = {
          match,
          resolve: (event: WorkerEvent) => {
            clearTimeout(timer);
            resolve(event);
          },
        };
        waiters.push(waiter);
        void exited.then(() => {
          if (!waiters.includes(waiter)) return;
          waiters.splice(waiters.indexOf(waiter), 1);
          clearTimeout(timer);
          reject(new Error(`the worker exited (${child.exitCode}, ${child.signalCode}) without a matching event; events: ${JSON.stringify(events.slice(-5))}; stderr: ${stderr.slice(-2000)}`));
        });
      });
    },
    lastCommitted() {
      let last: number | undefined;
      for (const event of events) if (event.event === "committed") last = event.height;
      return last;
    },
    async signal(signal) {
      if (child.exitCode !== null || child.signalCode !== null) return;
      child.kill(signal);
      if (signal === "SIGKILL" || signal === "SIGTERM") await exited;
    },
  };
  started.push(worker);
  return worker;
}

/** Kills every worker still alive and deletes every work directory. */
export async function cleanUp(): Promise<void> {
  for (const worker of started.splice(0)) {
    if (worker.child.exitCode === null && worker.child.signalCode === null) {
      worker.child.kill("SIGCONT");
      await worker.signal("SIGKILL");
    }
  }
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
}

/** A process's first event of `kinds`. */
export const firstOf =
  (...kinds: WorkerEvent["event"][]) =>
  (event: WorkerEvent): boolean =>
    kinds.includes(event.event);

/**
 * Every row of `t.blocks` in `dataDir`, read with a plain PGlite engine outside the database API (and so without the
 * writer lock), once no worker runs on the directory.
 */
export async function blocksIn(dataDir: string): Promise<{ readonly height: number; readonly writer: number }[]> {
  const engine = await PGlite.create(dataDir);
  try {
    // Ordered by the bigint column, not by its text (an alias named like the column would sort as text).
    const result = await engine.query<{ h: string; writer: number }>(
      "SELECT height::text AS h, writer FROM t.blocks ORDER BY height",
    );
    return result.rows.map((row) => ({ height: Number(row.h), writer: row.writer }));
  } finally {
    await engine.close();
  }
}
