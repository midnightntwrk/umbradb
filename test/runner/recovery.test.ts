import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { PostgresParts } from "../../src/config/database-parts.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type CommitOutcome, FinalizedLoop, type HeldHeight, type LoopInput } from "../../src/runner/loop.js";
import type { ProcessHandle, ProcessStatus } from "../../src/runner/process.js";
import { type CommitFault, CommitProxy } from "./commit-proxy.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, settle, startProcess, testBuild } from "./process-build.js";

/**
 * Recovery after a lost database connection, through the process on PostgreSQL 18. PGlite runs inside the process: it
 * has no connection to lose, so neither case can happen there. Its held heights after a retryable failure are tested
 * in `held-height.test.ts`, on both backends. [IN-10, IN-11, A85, A86]
 *
 * - The writer's backend is terminated during `on-db-write` of h (`pg_terminate_backend`) and retried with
 *   `database-retrying`. The block transaction is gone, so h is processed again from `on-compute`:
 *   - the items a module published in `on-parse` at h are still visible to its `on-compute` on the retry;
 *   - the block is not fetched or parsed again (`on-fetch` and `on-parse` run once at h);
 *   - the cursor's `on-after-db-write` is not delivered again.
 *
 *   The clause "the ledger state is reloaded at the cursor, and h's root matches the node's" is not checked here: it
 *   waits for `core-ledger-state` and its reload. [A85]
 * - The writer's backend is terminated during the `COMMIT` of h. A proxy between the process and the server holds the
 *   `COMMIT` or its answer while `pg_terminate_backend` ends the backend (`./commit-proxy.ts`).
 *   - When the server committed h, the cursor is h after reconnecting, h is not processed again, and
 *     `on-after-db-write` fires for h.
 *   - When it did not, h is processed again from `on-compute`.
 *   - When the cursor is neither (another writer moved it while the process was away), processing halts with
 *     `unexpected-cursor` at h.
 *
 *   [A86]
 *
 * Negative controls are committed with it: a loop that drops the held height (h is fetched and parsed again), and two
 * that read an uncertain `COMMIT` the wrong way (as lost when it landed, as landed when it did not).
 */

const HEAD = 5n;
const H = 3n;
/** The back-off ceiling the retries run with here: 20 ms, so no test waits the default back-off's seconds. [IN-10] */
const CEILING = 20;
/**
 * A recovery run starts a database and a process and processes five heights: 3 to 9 s on PostgreSQL in Docker at load
 * averages of 10 to 40 (2026-10-26); a test of several runs gets this much per run.
 */
const RUN_MS = 60_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as (typeof PROCESS_BACKENDS)[number];

/** What module `rec` saw: each point it ran at each height, and what each `on-compute` read of its `on-parse` item. */
interface Recorded {
  readonly calls: string[];
  /** `on-compute` at each height, each time: the `rec-parsed` item's parse number, or null without it. */
  readonly computed: Map<bigint, (number | null)[]>;
  /** The conditions when `on-compute` ran again at H. */
  readonly retrying: ProcessStatus["conditions"][];
}

/**
 * Module `rec`: logs every point it has, puts the block item `rec-parsed` (`{ n }`, the count of its `on-parse` calls) in
 * `on-parse`, reads it in `on-compute`, writes a row in `on-db-write` — where, at H the first time, `fault` runs after
 * the row.
 */
function recorder(seen: Recorded, fault: () => Promise<void>, status: () => ProcessStatus): ModuleDeclaration {
  let parses = 0;
  let faulted = false;
  const note = (point: string, height: bigint) => seen.calls.push(`${point}@${height}`);
  return {
    id: "rec",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [
      { name: "rec-parsed", lifetimes: ["block"] },
      { name: "rec-rows", lifetimes: ["table"], table: { schema: "rec", tables: ["rows"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE rec.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-fetch"(_p, b) {
        note("on-fetch", b.height);
      },
      async "on-parse"(_p, b, sink) {
        note("on-parse", b.height);
        parses += 1;
        sink.put("rec-parsed", Object.freeze({ n: parses }));
      },
      async "on-compute"(_p, b) {
        note("on-compute", b.height);
        const item = b.items.get("rec-parsed") as { readonly n: number } | undefined;
        seen.computed.set(b.height, [...(seen.computed.get(b.height) ?? []), item?.n ?? null]);
        if (b.height === H && (seen.computed.get(H)?.length ?? 0) > 1) seen.retrying.push(status().conditions);
      },
      async "on-db-write"(_p, b, w) {
        note("on-db-write", b.height);
        await w.execute("INSERT INTO rec.rows (height) VALUES ($1)", [b.height]);
        if (b.height === H && !faulted) {
          faulted = true;
          await fault();
        }
      },
      async "on-after-db-write"(_p, b) {
        note("on-after-db-write", b.height);
      },
    },
  };
}

/** How a recovery run went. */
interface RecoveryObservation {
  readonly seen: Recorded;
  readonly status: ProcessStatus;
  readonly lines: readonly string[];
  /** `rec.rows` and the blocks table's heights. */
  readonly rows: readonly number[];
  readonly blocks: readonly number[];
  /** The writers terminated: by `on-db-write` (`"terminated"`), or the proxy's faults at the `COMMIT`. */
  readonly faults: readonly string[];
}

/**
 * The faults of the runs: the writer terminated in `on-db-write`; at the `COMMIT`, before or after the server
 * committed; or at the `COMMIT` before the server committed, with another writer's change meanwhile. [A85, A86]
 */
type Fault = "terminated" | CommitFault | "neither";

/**
 * A process on a fresh database through a {@link CommitProxy}, `rec` faulting at H with `fault`, up to HEAD or a halt;
 * `loop` a negative control's.
 */
async function recoveryRun(fault: Fault, loop?: new (input: LoopInput) => FinalizedLoop): Promise<RecoveryObservation> {
  const db = await backend.database();
  const proxy = await CommitProxy.start(db.setting as PostgresParts);
  const seen: Recorded = { calls: [], computed: new Map(), retrying: [] };
  const lines: string[] = [];
  const terminated: string[] = [];
  let handle!: ProcessHandle;
  const terminate = () => (db.terminateWriter as () => Promise<number>)();
  const faults: Record<Fault, () => Promise<void>> = {
    terminated: async () => {
      await terminate();
      terminated.push("terminated");
    },
    before: async () => void proxy.arm("before", { terminate }),
    after: async () => void proxy.arm("after", { terminate }),
    // Another writer moves the cursor while the process is away: blocks 2 and above are gone, the cursor 1.
    neither: async () => void proxy.arm("before", { terminate, then: () => rewindTo(db, H - 2n) }),
  };
  const rec = recorder(seen, faults[fault], () => handle.status());
  const source = new InMemoryBlockSource({ head: HEAD });
  handle = startProcess({
    declarations: testBuild([rec]).declarations,
    config: {
      data: { entries: [core(proxy.setting(db.setting as PostgresParts), 1, { extra: { backoffCeilingMs: CEILING } }), entryOf(rec, 1)] },
    },
    source,
    log: (line) => lines.push(line),
    ...(loop === undefined ? {} : { loop }),
  });
  let status: ProcessStatus;
  try {
    const end = await Promise.race([settle(handle, source, HEAD), handle.ended]);
    status = handle.status();
    if (end !== "waiting" && status.state !== "halted") throw new Error(`the process ended ${JSON.stringify(end)}`);
  } finally {
    await handle.stop();
    await proxy.close();
  }
  const heights = async (sql: string) => (await db.query(sql)).map((row) => Number(row.h));
  return {
    seen,
    status,
    lines,
    rows: await heights("SELECT height::int AS h FROM rec.rows ORDER BY height"),
    blocks: await heights("SELECT height::int AS h FROM core_block_commit.blocks ORDER BY height"),
    faults: [...terminated, ...proxy.faults],
  };
}

/** Deletes the blocks above `height` from outside the process: another writer's change. [A86] */
async function rewindTo(db: ProcessDatabase, height: bigint): Promise<void> {
  await db.query(`DELETE FROM core_block_commit.hashes WHERE height > ${height}`);
  await db.query(`DELETE FROM core_block_commit.blocks WHERE height > ${height}`);
  await db.query(`DELETE FROM rec.rows WHERE height > ${height}`);
}

/** The calls of `point` at `height`. */
const count = (observed: RecoveryObservation, point: string, height: bigint) =>
  observed.seen.calls.filter((call) => call === `${point}@${height}`).length;

/** JSON with bigints as text. */
const text = (value: unknown): string => JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? `${v}` : v));

/**
 * What every recovered run must show: the fault made once, every height committed once, in order, the other heights'
 * points once each; one retry logged; nothing halted.
 */
function committedProblems(observed: RecoveryObservation, fault: string): string[] {
  const problems: string[] = [];
  const all = [1, 2, 3, 4, 5];
  if (text(observed.faults) !== text([fault])) problems.push(`the faults made: ${text(observed.faults)}, not ${fault}`);
  if (observed.status.state !== "following" || observed.status.reason !== null) {
    problems.push(`the process is ${observed.status.state} with ${text(observed.status.reason)}`);
  }
  if (text(observed.rows) !== text(all)) problems.push(`rec.rows holds ${observed.rows}`);
  if (text(observed.blocks) !== text(all)) problems.push(`the blocks table holds ${observed.blocks}`);
  for (const height of [1n, 2n, 4n, 5n]) {
    for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"]) {
      if (count(observed, point, height) !== 1) problems.push(`${point} ran ${count(observed, point, height)} times at ${height}`);
    }
  }
  const retries = observed.lines.filter((line) => line.includes("retries in"));
  if (retries.length !== 1 || !/^processing retries in 20 ms \(database-retrying, attempt 1\): /.test(retries[0] as string)) {
    problems.push(`the retries logged: ${text(retries)}`);
  }
  return problems;
}

/** How many `on-parse` calls came before H's first: one per height below it. */
const parsesBefore = (observed: RecoveryObservation): number =>
  observed.seen.calls.slice(0, observed.seen.calls.indexOf(`on-parse@${H}`)).filter((call) => call.startsWith("on-parse@")).length;

/**
 * A connection lost during `on-db-write`, or during a `COMMIT` the server did not commit (the cursor still h − 1): h
 * is processed again from `on-compute`, its `on-parse` item still visible, and the block is not fetched or parsed
 * again; the retry runs under `database-retrying` at h. [A85, A86, IN-10, IN-11]
 */
function processedAgainProblems(observed: RecoveryObservation, fault: string): string[] {
  const problems = committedProblems(observed, fault);
  for (const [point, times] of [
    ["on-fetch", 1],
    ["on-parse", 1],
    ["on-compute", 2],
    ["on-db-write", 2],
    ["on-after-db-write", 1],
  ] as const) {
    if (count(observed, point, H) !== times) problems.push(`${point} ran ${count(observed, point, H)} times at ${H}, not ${times}`);
  }
  const computed = observed.seen.computed.get(H) ?? [];
  const parse = parsesBefore(observed) + 1;
  if (text(computed) !== text([parse, parse])) {
    problems.push(`on-compute at ${H} read the on-parse items ${text(computed)}: not the one parse of ${H} both times`);
  }
  const conditions = text(observed.seen.retrying);
  if (conditions !== text([[{ code: "database-retrying", attempts: 1, height: H }]])) {
    problems.push(`the retry's on-compute ran with the conditions ${conditions}`);
  }
  return problems;
}

/**
 * A `COMMIT` the server committed: the cursor is h after reconnecting, h is not processed again, and
 * `on-after-db-write` fires for h. [A86]
 */
function landedProblems(observed: RecoveryObservation): string[] {
  const problems = committedProblems(observed, "after");
  for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"]) {
    if (count(observed, point, H) !== 1) problems.push(`${point} ran ${count(observed, point, H)} times at ${H}, not once`);
  }
  if (observed.seen.calls.indexOf(`on-after-db-write@${H}`) > observed.seen.calls.indexOf(`on-fetch@${H + 1n}`)) {
    problems.push(`on-after-db-write at ${H} came after ${H + 1n}'s on-fetch`);
  }
  return problems;
}

/**
 * A cursor another writer moved: processing halts with `unexpected-cursor` at h, and the database is left as the other
 * writer left it. [A86]
 */
function neitherProblems(observed: RecoveryObservation): string[] {
  const problems: string[] = [];
  if (text(observed.faults) !== text(["before"])) problems.push(`the faults made: ${text(observed.faults)}`);
  if (observed.status.state !== "halted") problems.push(`the process is ${observed.status.state}, not halted`);
  const reason = text(observed.status.reason);
  if (reason !== text({ code: "unexpected-cursor", height: H, module: null, point: null })) problems.push(`the reason is ${reason}`);
  if (text(observed.blocks) !== "[1]") problems.push(`the blocks table holds ${observed.blocks}`);
  if (count(observed, "on-compute", H) !== 1) problems.push(`on-compute ran ${count(observed, "on-compute", H)} times at ${H}`);
  if (count(observed, "on-after-db-write", H) !== 0) problems.push(`on-after-db-write ran at ${H}`);
  if (!observed.lines.some((line) => /^processing halted \(unexpected-cursor\): /.test(line))) {
    problems.push(`no halt logged: ${text(observed.lines)}`);
  }
  return problems;
}

/** A loop that drops a height held for a retry: it is fetched and parsed again from its start. [A85] */
class DropsHeld extends FinalizedLoop {
  protected override held(_held: HeldHeight): HeldHeight | undefined {
    return undefined;
  }
}

/** A loop that reads every uncertain `COMMIT` as lost: h is processed again when it had landed. [A86] */
class AlwaysLost extends FinalizedLoop {
  protected override commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
    const outcome = super.commitOutcome(held, cursor);
    return outcome === "committed" ? "not-committed" : outcome;
  }
}

/** A loop that reads every uncertain `COMMIT` as landed: h is never processed again when it had not. [A86] */
class AlwaysLanded extends FinalizedLoop {
  protected override commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
    return held.uncertain ? "committed" : super.commitOutcome(held, cursor);
  }
}

describe("recovery after a lost database connection (IN-10, IN-11) on PostgreSQL 18", () => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A85: the writer's backend terminated during on-db-write of h is retried with database-retrying; h is processed again from on-compute with its on-parse items, not parsed again", async () => {
    expect(processedAgainProblems(await recoveryRun("terminated"), "terminated")).toEqual([]);
  }, RUN_MS);

  it("A85 negative control: a loop that drops the held height fetches and parses h again and fails A85", async () => {
    const problems = processedAgainProblems(await recoveryRun("terminated", DropsHeld), "terminated");
    expect(problems).toContain(`on-fetch ran 2 times at ${H}, not 1`);
    expect(problems).toContain(`on-parse ran 2 times at ${H}, not 1`);
  }, RUN_MS);

  it("[[ingest.uncertain-commit-recovery]] A86: the writer's backend terminated during the COMMIT of h — after the server committed it: the cursor is h after reconnecting, h is not processed again, on-after-db-write fires for h; before: h is processed again from on-compute; with the cursor neither h with the block's hash nor h − 1: processing halts with unexpected-cursor at h", async () => {
    expect(landedProblems(await recoveryRun("after"))).toEqual([]);
    expect(processedAgainProblems(await recoveryRun("before"), "before")).toEqual([]);
    expect(neitherProblems(await recoveryRun("neither"))).toEqual([]);
  }, 3 * RUN_MS);

  it("A86 negative controls: an uncertain COMMIT read as lost when it landed, or as landed when it did not, fails A86", async () => {
    const asLost = landedProblems(await recoveryRun("after", AlwaysLost));
    expect(asLost).toContain(`on-compute ran 2 times at ${H}, not once`);
    const asLanded = processedAgainProblems(await recoveryRun("before", AlwaysLanded), "before");
    expect(asLanded).toContain(`on-compute ran 1 times at ${H}, not 2`);
    // Read as landed, 3 is never committed, and the next block, 4, is refused by the parent check: the database holds
    // no block at 3. Nothing commits above the missing height. [IN-4]
    expect(asLanded).toContain(
      'the process is halted with {"code":"parent-mismatch","height":"4","module":"core-block-commit","point":"on-db-write"}',
    );
    expect(asLanded).toContain("rec.rows holds 1,2");
    expect(asLanded).toContain("the blocks table holds 1,2");
  }, 2 * RUN_MS);
});
