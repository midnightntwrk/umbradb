import { type ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startProcess } from "../../src/runner/process.js";
import { cursorIn, pairs, PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, settle, testBuild } from "./process-build.js";
import { type WorkEvent, workModule } from "./sigterm-module.js";
import type { Job, WorkerEvent } from "./sigterm.worker.js";

/**
 * A48 (task 5.3; RN-13) with a real process and a real signal: SIGTERM during `on-db-write` of h ends with h fully
 * present or fully absent, and a restart resumes from the cursor. The process is `sigterm.worker.ts`, started as
 * `umbradb run` starts one (`startProcess` with its configuration file and `terminationSignal`); module `w` holds its
 * block's transaction open until the SIGTERM has arrived, so the signal always comes during `on-db-write` of h.
 *
 * RN-13's "let a block whose transaction is open commit or roll back, and then exit" is checked from the database's
 * side too: on PostgreSQL no session of the process was abandoned (`pg_stat_database.sessions_abandoned`: a client that
 * exits without ending its session, its transaction rolled back by the server), on PGlite the data directory was shut
 * down (`global/pg_control`'s state 1, `DB_SHUTDOWNED`; 6, in production, after an exit without closing). A process
 * that exits at once on SIGTERM leaves the database atomic as well — the server or PGlite's recovery drops the open
 * transaction — but abandoned, which is what its negative control shows.
 */

const WORKER = fileURLToPath(new URL("./sigterm.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const HEAD = 8;
const AT = 5;
const ROWS = 5;
/** How long a worker may take to report, or to exit after its signal, under a loaded machine. */
const PATIENCE_MS = 120_000;

/** A worker process and its events, the parent's `sigterm` marker among them. */
interface Worker {
  readonly child: ChildProcess;
  readonly events: (WorkerEvent | { readonly event: "sigterm" })[];
  next(event: WorkerEvent["event"]): Promise<void>;
  readonly exited: Promise<{ readonly code: number | null; readonly signal: NodeJS.Signals | null }>;
  readonly stderr: () => string;
}

function startWorker(job: Job): Worker {
  const child = spawn(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const events: Worker["events"] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  const lines = createInterface({ input: child.stdout! });
  lines.on("line", (line) => {
    if (line.startsWith("{")) events.push(JSON.parse(line) as WorkerEvent);
  });
  const exited = once(child, "close").then(() => ({ code: child.exitCode, signal: child.signalCode }));
  return {
    child,
    events,
    exited,
    stderr: () => stderr,
    async next(event) {
      const deadline = Date.now() + PATIENCE_MS;
      while (!events.some((e) => e.event === event)) {
        if (child.exitCode !== null || child.signalCode !== null || Date.now() > deadline) {
          throw new Error(`no ${event} event; events ${JSON.stringify(events.slice(-6))}; stderr ${stderr.slice(-2000)}`);
        }
        await sleep(20);
      }
    },
  };
}

/** PostgreSQL's count of the database's abandoned sessions, once no session of the process is left. */
async function abandoned(db: ProcessDatabase): Promise<number> {
  for (let attempt = 0; attempt < 400; attempt++) {
    const [row] = await db.query(
      "SELECT count(*)::int AS n FROM pg_stat_activity WHERE datname = current_database() AND application_name = 'umbradb'",
    );
    if (row?.n === 0) break;
    await sleep(50);
  }
  const [row] = await db.query("SELECT sessions_abandoned::int AS n FROM pg_stat_database WHERE datname = current_database()");
  return Number(row?.n);
}

/** PGlite's `pg_control` state: 1 when shut down, 6 in production (`DBState`, at byte 16). */
const controlState = (directory: string): number => readFileSync(join(directory, "global", "pg_control")).readUInt32LE(16);

/** What one A48 run showed. */
interface A48Observation {
  readonly events: Worker["events"];
  readonly exit: { readonly code: number | null; readonly signal: NodeJS.Signals | null; readonly timedOut: boolean };
  /** Rows of `w` per height, and the cursor, after the process exited. */
  readonly rows: readonly [number, unknown][];
  readonly cursor: number | null;
  /** Null when the database was left closed cleanly; otherwise how it was not. */
  readonly unclean: string | null;
  /** The restart: the first height it fetched, and the rows and cursor after it reached the head. */
  readonly restart: { readonly first: number | null; readonly rows: readonly [number, unknown][]; readonly cursor: number | null };
}

async function a48Run(backend: ProcessBackend, mode: Job["mode"]): Promise<A48Observation> {
  const db = await backend.database();
  const directory = mkdtempSync(join(tmpdir(), "umbradb-sigterm-"));
  try {
    const configFile = join(directory, "umbradb.config.ts");
    const entries = [core(db.setting), entryOf({ id: "w", version: "1.0.0" }, 1)];
    writeFileSync(configFile, `export default ${JSON.stringify({ entries })};\n`);
    const before = backend.kind === "postgres" ? await abandoned(db) : 0;
    const worker = startWorker({ configFile, head: HEAD, at: AT, rows: ROWS, mode });
    let timedOut = false;
    try {
      await worker.next("in-db-write");
      worker.events.push({ event: "sigterm" });
      worker.child.kill("SIGTERM");
      const exit = await Promise.race([worker.exited, sleep(PATIENCE_MS).then(() => null)]);
      if (exit === null) timedOut = true;
    } finally {
      if (worker.child.exitCode === null && worker.child.signalCode === null) worker.child.kill("SIGKILL");
    }
    const exit = await worker.exited;
    let unclean: string | null = null;
    if (backend.kind === "postgres") {
      const lost = (await abandoned(db)) - before;
      if (lost > 0) unclean = "PostgreSQL counted sessions of the process abandoned by their client";
    } else if (controlState(db.directory as string) !== 1) {
      unclean = `PGlite's pg_control state is ${controlState(db.directory as string)}, not 1 (shut down)`;
    }
    const rows = await pairs(db, "SELECT height::int AS h, count(*)::int AS v FROM w.rows GROUP BY height ORDER BY height");
    const cursor = await cursorIn(db);

    const seen: WorkEvent[] = [];
    const build = testBuild([workModule({ rows: ROWS, report: (event) => seen.push(event) })]);
    const source = new InMemoryBlockSource({ head: BigInt(HEAD) });
    const handle = startProcess({ declarations: build.declarations, config: { file: configFile }, source, log: () => undefined });
    try {
      expect(await settle(handle, source, BigInt(HEAD))).toBe("waiting");
    } finally {
      await handle.stop();
    }
    const first = seen.find((event) => event.event === "fetch")?.height ?? null;
    const restart = {
      first,
      rows: await pairs(db, "SELECT height::int AS h, count(*)::int AS v FROM w.rows GROUP BY height ORDER BY height"),
      cursor: await cursorIn(db),
    };
    return { events: worker.events, exit: { ...exit, timedOut }, rows, cursor, unclean, restart };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

/** A48's oracle: every problem with what was observed, none when A48 holds. */
function a48Problems(observed: A48Observation): string[] {
  const problems: string[] = [];
  const { exit, events } = observed;
  if (exit.timedOut) problems.push(`the process did not exit within ${PATIENCE_MS} ms of SIGTERM`);
  else if (exit.code !== 0 || exit.signal !== null) {
    problems.push(`the process ended with code ${exit.code} and signal ${exit.signal}, not by itself with code 0`);
  }
  const marker = events.findIndex((event) => event.event === "sigterm");
  const after = events.slice(marker + 1);
  const closed = after.find((event) => event.event === "closed");
  if (closed === undefined) problems.push("the process exited before its stop completed: no closed event");
  else if (closed.state !== "stopping" || closed.ended !== "signal") {
    problems.push(`the process closed ${closed.state}, its processing ended by ${closed.ended}`);
  }
  for (const event of after) {
    if (event.event === "fetch" && event.height > AT) problems.push(`the process started height ${event.height} after SIGTERM`);
  }
  if (observed.cursor !== AT && observed.cursor !== AT - 1) {
    problems.push(`the cursor is ${observed.cursor}, neither ${AT} (h present) nor ${AT - 1} (h absent)`);
  }
  const complete = (rows: readonly [number, unknown][], last: number | null): boolean =>
    rows.length === (last ?? 0) && rows.every(([height, count], index) => height === index + 1 && count === ROWS);
  if (!complete(observed.rows, observed.cursor)) {
    problems.push(`the rows per height after the exit are ${JSON.stringify(observed.rows)} with the cursor ${observed.cursor}`);
  }
  if (observed.unclean !== null) problems.push(`the database was not closed cleanly: ${observed.unclean}`);
  const resumed = observed.cursor === null ? 1 : observed.cursor + 1;
  if (observed.restart.first !== resumed) {
    problems.push(`the restart began at ${observed.restart.first}, not at the cursor + 1 (${resumed})`);
  }
  if (observed.restart.cursor !== HEAD || !complete(observed.restart.rows, HEAD)) {
    problems.push(`after the restart the rows are ${JSON.stringify(observed.restart.rows)}, the cursor ${observed.restart.cursor}`);
  }
  return problems;
}

describe("A48: SIGTERM stops cleanly (RN-13), with a real process and signal", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[runner.fault.sigterm-in-transaction]] A48: SIGTERM during on-db-write of h leaves h fully present or fully absent, and a restart resumes from the cursor, on PostgreSQL and on PGlite", async () => {
    for (const backend of PROCESS_BACKENDS) {
      const observed = await a48Run(backend, "runner");
      expect(a48Problems(observed), backend.name).toEqual([]);
      // This build lets the block in its transaction commit: h is present, and nothing of h + 1 began.
      expect(observed.cursor, backend.name).toBe(AT);
      const kinds = observed.events.map((event) => ("height" in event ? `${event.event}@${event.height}` : event.event));
      const from = kinds.indexOf("sigterm");
      expect(kinds.slice(from).filter((kind) => kind !== "log"), backend.name).toEqual([
        "sigterm",
        `db-write-end@${AT}`,
        `after-write@${AT}`,
        "closed",
      ]);
    }
  }, 600_000);

  it("negative control: a process that exits on SIGTERM without awaiting the block fails A48", async () => {
    for (const backend of PROCESS_BACKENDS) {
      const observed = await a48Run(backend, "exit-at-once");
      const unclean =
        backend.kind === "postgres"
          ? "PostgreSQL counted sessions of the process abandoned by their client"
          : "PGlite's pg_control state is 6, not 1 (shut down)";
      expect(a48Problems(observed), backend.name).toEqual([
        "the process exited before its stop completed: no closed event",
        `the database was not closed cleanly: ${unclean}`,
      ]);
      // The database itself stayed atomic: h's open transaction was dropped.
      expect(observed.cursor, backend.name).toBe(AT - 1);
    }
  }, 600_000);
});
