import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { spawnChild } from "../child-processes.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf } from "../runner/process-build.js";
import { blockRef, branchOf, type ChainBlock, chainOf, content, finalized, headRead, newHead, opening, RUNTIME, subscriptions } from "./fetch-fixtures.js";
import { a76Problems } from "./ingest-checks.js";
import type { CrashEvent, CrashJob } from "./ingest-crash.worker.js";
import { FENCE, fenceAt, ingest, PATIENCE_MS, until, watched, watcher } from "./ingest-harness.js";

/**
 * A76 `[FAULT]` (task 10.3; IN-1): the database holds finalized blocks only. A real process — `ingest-crash.worker.ts`,
 * started as `umbradb run` starts one, over the node source and a tape node in this test — syncs to the finalized head
 * F = 3, queues 20 best blocks above it (4–23; `tipCap` 20, so the queue is full: `finality-stall`), and is killed with
 * SIGKILL; then no table holds a row of a block above F, and a restart, which queues the 20 again, writes none either.
 * The criterion names PostgreSQL; the test runs PGlite too, in the same test (the required id tags exactly one test).
 * The committed negative control is a source that writes each best block into a module's table.
 */

const WORKER = fileURLToPath(new URL("./ingest-crash.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const F = 3n;

const chain = chainOf(F);
const genesis = chain[0] as ChainBlock;
const head = chain[Number(F)] as ChainBlock;
const best = branchOf(head, F + 20n, "tip");

/** The 20 best blocks' notifications and calls, after the head. */
const bestRecords = (): TapeRecord[] => best.flatMap((block, index) => [newHead(block), ...content(block, RUNTIME, index === 0)]);

/**
 * The killed process's tape: a new database synced to F, then the 20 best blocks — sent once F committed: the fence
 * module's call after F's commit lets them out (TT-3).
 */
const firstTape = (): TapeRecord[] => [
  ...opening(genesis, head),
  ...chain.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
  FENCE,
  ...bestRecords(),
];

/**
 * The restart's tape: startup's checks on a database with the cursor F, then the 20 best blocks again — once the loop
 * runs: the fence module's `on-after-db-write` of F, re-delivered at the restart (RN-11), lets them out.
 */
const restartTape = (): TapeRecord[] => [
  ...blockRef(genesis),
  ...subscriptions(),
  ...headRead(head),
  ...blockRef(head),
  FENCE,
  ...bestRecords(),
];

/** The modules of both runs: the watching one and the fence at F. */
const USER = [watcher(watched()), fenceAt(F)];

/** Runs the worker on `db` against a tape node until its queue holds the 20, then kills it with SIGKILL. */
async function killedWhileQueued(db: ProcessDatabase, tipsTo?: string): Promise<{ readonly exit: NodeJS.Signals | null }> {
  const node = await TapeNode.start({ records: firstTape() });
  const directory = mkdtempSync(join(tmpdir(), "umbradb-ingest-crash-"));
  let child: ChildProcess | undefined;
  try {
    const configFile = join(directory, "umbradb.config.ts");
    const entries = [core(db.setting, 1, { extra: { node: node.url, tipCap: 20 } }), ...USER.map((module) => entryOf(module, 1))];
    writeFileSync(configFile, `export default ${JSON.stringify({ entries })};\n`);
    const job: CrashJob = { configFile, finalized: String(F), ...(tipsTo === undefined ? {} : { tipsTo }) };
    child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] });
    const events: CrashEvent[] = [];
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    createInterface({ input: child.stdout as NodeJS.ReadableStream }).on("line", (line) => {
      if (line.startsWith("{")) events.push(JSON.parse(line) as CrashEvent);
    });
    const exited = once(child, "close");
    const deadline = Date.now() + PATIENCE_MS;
    while (!events.some((event) => event.event === "queued")) {
      if (child.exitCode !== null || Date.now() > deadline || events.some((event) => event.event === "refused")) {
        throw new Error(`the worker queued nothing: events ${JSON.stringify(events)}; stderr ${stderr.slice(-2000)}`);
      }
      await sleep(20);
    }
    expect(events.find((event) => event.event === "queued")).toEqual({ event: "queued", height: String(F + 20n) });
    child.kill("SIGKILL");
    await Promise.race([exited, sleep(PATIENCE_MS)]);
    return { exit: child.signalCode };
  } finally {
    if (child !== undefined && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    await node.close();
    rmSync(directory, { recursive: true, force: true });
  }
}

/** The blocks table's heights. */
async function heightsIn(db: ProcessDatabase): Promise<number[]> {
  return (await db.query("SELECT height::int AS h FROM core_block_commit.blocks ORDER BY height")).map((row) => Number(row.h));
}

describe("A76 (IN-1): the database holds finalized blocks only", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[ingest.no-unfinalized-rows-after-crash]] killing the process while 20 best blocks are queued leaves no row of a non-finalized block, nor does the restart, on PostgreSQL and PGlite", async () => {
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const { exit } = await killedWhileQueued(db);
      expect(exit, backend.name).toBe("SIGKILL");
      expect(await heightsIn(db), backend.name).toEqual([1, 2, 3]);
      expect(await a76Problems(db, F), backend.name).toEqual([]);
      // The restart: startup's checks on the cursor F, the 20 queued again, nothing of them written.
      const run = await ingest(db, restartTape(), { start: 1n, settings: { tipCap: 20 }, user: [fenceAt(F)] });
      try {
        // The queue may fill before the loop's first read of the head, which makes the state following: wait for both.
        const full = (): boolean => run.handle.status().conditions.some((c) => c.code === "finality-stall" && c.height === F + 20n);
        await until(run, () => full() && run.handle.status().state === "following", "the queue full again, following");
        expect(run.handle.status()).toMatchObject({ cursor: F, state: "following" });
        expect(run.seen.queue).toHaveLength(20);
      } finally {
        await run.close();
      }
      expect(await heightsIn(db), backend.name).toEqual([1, 2, 3]);
      expect(await a76Problems(db, F), backend.name).toEqual([]);
    }
  }, PATIENCE_MS * 4);

  it("a source that writes a best block to the database fails A76 (its committed negative control, PostgreSQL)", async () => {
    const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as ProcessBackend;
    const db = await backend.database();
    await killedWhileQueued(db, db.setting);
    expect(await heightsIn(db)).toEqual([1, 2, 3]);
    expect(await a76Problems(db, F)).toEqual(["watch.rows holds 20 rows above the finalized head 3"]);
  }, PATIENCE_MS * 2);
});
