import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { FinalizedLoop, HeightFailure, type LoopInput } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { type LostCommit, loggingFollower, losingCommits } from "./block-continues-harness.js";
import { CHECKED_BACKBONE, recorder, type Seen } from "./loop-chunk-harness.js";
import { InMemoryBlockSource, type RunnerBackend, RUNNER_BACKENDS, startWith } from "./loop-harness.js";

/**
 * The failure rule of chunks in the finalized loop (`src/runner/loop.ts`, fast-sync mode), on PostgreSQL 18 and
 * PGlite 0.5.10: heights 1 to 10 in chunks of 5 (1..5, 6..10), against the mode off with the same fault, at block 8,
 * in the middle of the chunk 6..10. A fault at `on-fetch`, `on-parse`, `on-compute`, `on-db-write`, `on-settle`, the
 * cursor check and `on-after-db-write`, retryable (a lost connection, `connection-lost`) and not, once; a `COMMIT`
 * whose answer is lost after it landed and with the transaction rolled back (both backends, through a database that
 * loses it), and a lost connection inside the chunk (PostgreSQL, the writer's backend terminated). And, with a
 * deferred constraint in the database, which keeps every block in a transaction of its own: the constraint broken at 8
 * and at 10 fails that block's own `COMMIT`, as with the mode off. The process's retry is the test's: the loop runs
 * again after a retryable failure.
 *
 * Each case checks the halt (height, point, module, committed) or the retry; the cursor; the follower's facts; the
 * callback log (the failing block's failing callback once; nothing fetched or parsed again; `continues` false at every
 * block stored again); and the tables at every height committed, against the mode off.
 */

const HEAD = 10n;
const K = 8n;

/** Where the fault is: a point of module `f`, or the cursor check. */
type FaultAt = "on-fetch" | "on-parse" | "on-compute" | "on-db-write" | "on-settle" | "cursor-check" | "on-after-db-write";

/** What one case's runs gave. */
interface Outcome {
  readonly failures: HeightFailure[];
  readonly cursor: bigint | null;
  /** The follower's `committed` and `rolledBack` facts, in order. */
  readonly facts: string[];
  /** `f`'s calls, `<point>@<h>`. */
  readonly calls: string[];
  readonly seen: Seen[];
  readonly order: string[];
  /** The tables after each `COMMIT`, by the cursor's height. */
  readonly snapshots: Map<bigint, string>;
}

/** What a case asks of its database and modules. */
interface Case {
  readonly blocks?: number;
  readonly fault?: { readonly at: FaultAt; readonly retryable: boolean };
  /** A `COMMIT` lost after it landed or rolled back, armed at `f`'s `on-db-write` of K. */
  readonly lostCommit?: LostCommit;
  /** `f`'s table has a deferred unique constraint, and at this block `f` inserts a value it refuses at the block's `COMMIT`. */
  readonly deferred?: bigint;
  /** PostgreSQL: the writer's backend terminated at `f`'s `on-db-write` of K, before its write. */
  readonly terminate?: boolean;
}

/** The highest heights of `r.rows`, `f.rows` and the blocks table, as one text. */
async function snapshot(db: Database): Promise<string> {
  return db.read(async (read) => {
    const [cursor] = await read.query("SELECT max(height) AS h FROM core_block_commit.blocks");
    const r = await read.query("SELECT height FROM r.rows ORDER BY height");
    const f = await read.query("SELECT height, k FROM f.rows ORDER BY height");
    const blocks = await read.query("SELECT height, hash FROM core_block_commit.blocks ORDER BY height");
    const hex = (value: unknown): string => Buffer.from(value as Uint8Array).toString("hex");
    return JSON.stringify({
      cursor: String(cursor?.h),
      r: r.map((row) => String(row.height)),
      f: f.map((row) => `${row.height}:${row.k}`),
      blocks: blocks.map((row) => `${row.height}:${hex(row.hash)}`),
    });
  });
}

/** Module `f`: logs its calls, writes `(height, k)` at `on-db-write` (k 1 at 6 and at the block `deferred`), and faults. */
function faulting(calls: string[], options: Case, arm: { cursor: boolean; lost: () => void; terminate?: () => Promise<void> }): ModuleDeclaration {
  let fired = false;
  const fault = (point: FaultAt, height: bigint): void => {
    if (options.fault?.at !== point || height !== K || fired) return;
    fired = true;
    if (options.fault.retryable) throw new UmbraError("connection-lost", `the connection was lost at ${point} of ${height} (the test's module)`);
    throw new Error(`f failed at ${point} of ${height}`);
  };
  return declaration("f", {
    migrations: [
      {
        id: "001",
        sql: `CREATE TABLE f.rows (height bigint PRIMARY KEY, k int${options.deferred === undefined ? "" : ", CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY DEFERRED"})`,
      },
    ],
    points: {
      async "on-fetch"(_p, b: BlockContext) {
        calls.push(`on-fetch@${b.height}`);
        fault("on-fetch", b.height);
      },
      async "on-parse"(_p, b: BlockContext) {
        calls.push(`on-parse@${b.height}`);
        fault("on-parse", b.height);
      },
      async "on-compute"(_p, b: BlockContext) {
        calls.push(`on-compute@${b.height}`);
        fault("on-compute", b.height);
      },
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        calls.push(`on-db-write@${b.height}`);
        if (b.height === K && options.terminate === true && !fired) {
          fired = true;
          await arm.terminate?.();
        }
        const k = b.height === 6n || b.height === options.deferred ? 1 : null;
        await w.execute("INSERT INTO f.rows (height, k) VALUES ($1, $2)", [b.height, k]);
        if (b.height === K && options.lostCommit !== undefined && !fired) {
          fired = true;
          arm.lost();
        }
        fault("on-db-write", b.height);
      },
      async "on-settle"(_p, run) {
        calls.push(`on-settle@${run.first}`);
        if (options.fault?.at === "cursor-check" && run.first === K && !fired) {
          fired = true;
          arm.cursor = true;
        }
        fault("on-settle", run.first);
      },
      async "on-after-db-write"(_p, b: BlockContext) {
        calls.push(`on-after-db-write@${b.height}`);
        fault("on-after-db-write", b.height);
      },
    },
  });
}

/** Runs heights 1 to HEAD with `options` on a new database of `backend`, the loop again after each retryable failure. */
async function runCase(backend: RunnerBackend, options: Case): Promise<Outcome> {
  const opened = await backend.database();
  const raw = opened.db;
  const order: string[] = [];
  const seen: Seen[] = [];
  const calls: string[] = [];
  const log: string[] = [];
  const snapshots = new Map<bigint, string>();
  const losing = losingCommits(raw);
  const arm = {
    cursor: false,
    lost: () => {
      losing.state.armed = options.lostCommit;
    },
    ...(opened.terminateWriter === undefined ? {} : { terminate: opened.terminateWriter }),
  };
  const user = [recorder(order, seen), faulting(calls, options, arm)];
  const started = await startWith(raw, user, user.map((part) => entry(part.id, 1)), { backbone: CHECKED_BACKBONE });
  const memory = new InMemoryBlockSource({ head: HEAD });
  // The cursor check reads the cursor through the transaction: once armed, it reads none.
  const source: BlockSource = {
    cursor: async (read) => {
      if (arm.cursor && "execute" in read) {
        arm.cursor = false;
        return null;
      }
      return memory.cursor(read);
    },
    finalizedHead: () => memory.finalizedHead(),
    latestHead: () => memory.latestHead(),
    waitForHead: (above, signal) => memory.waitForHead(above, signal),
    block: (height) => memory.block(height),
  };
  const db: Database = {
    read: (body, readOptions) => raw.read(body, readOptions),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      const result = await losing.db.transaction((tx) => {
        order.push("BEGIN");
        return body(tx);
      });
      order.push("COMMIT");
      const shot = await snapshot(raw);
      const { cursor } = JSON.parse(shot) as { cursor: string };
      snapshots.set(cursor === "null" ? -1n : BigInt(cursor), shot);
      return result;
    },
    writerSession: () => raw.writerSession(),
    close: () => raw.close(),
  };
  const controller = new AbortController();
  const input: LoopInput = {
    db,
    graph: started.graph,
    plan: started.plan,
    source,
    contextOf: (id) => started.contexts.of(id),
    signal: controller.signal,
    follower: loggingFollower(log),
    ...(options.blocks === undefined ? {} : { fastSync: { blocks: options.blocks, distance: 0 } }),
  };
  const loop = new FinalizedLoop(input);
  const failures: HeightFailure[] = [];
  for (let runs = 0; runs < 4; runs++) {
    const running = loop.run().then(
      () => undefined,
      (error: unknown) => error,
    );
    if ((await Promise.race([memory.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") {
      controller.abort();
      await running;
      break;
    }
    const failure = await running;
    expect(failure).toBeInstanceOf(HeightFailure);
    failures.push(failure as HeightFailure);
    const cause = (failure as HeightFailure).cause;
    const inner = cause instanceof Error && cause.cause instanceof UmbraError ? cause.cause : cause;
    if (!(inner instanceof UmbraError && inner.retryable)) break;
  }
  const [cursorRow] = await raw.read((read) => read.query("SELECT max(height) AS h FROM core_block_commit.blocks"));
  return {
    failures,
    cursor: (cursorRow?.h as bigint | null | undefined) ?? null,
    facts: log.filter((line) => !line.startsWith("told written")),
    calls,
    seen,
    order,
    snapshots,
  };
}

/** A failure's fields, for one assertion. */
const where = (failure: HeightFailure) => ({ height: failure.height, point: failure.point, module: failure.module, committed: failure.committed });

/** `committed` facts for `from`..`to`. */
const committed = (from: bigint, to: bigint): string[] =>
  Array.from({ length: Number(to - from + 1n) }, (_, i) => `told committed ${from + BigInt(i)}`);
const rolledBack = (...heights: bigint[]): string[] => heights.map((h) => `told rolledBack ${h}`);

/** How many times `point@h` is in `calls`. */
const count = (calls: readonly string[], key: string): number => calls.filter((call) => call === key).length;

/** Checks the tables `on` saw after each COMMIT against `off`'s at every height both committed. */
function sameTables(on: Outcome, off: Outcome): void {
  let compared = 0;
  for (const [height, shot] of on.snapshots) {
    if (!off.snapshots.has(height)) continue;
    compared += 1;
    expect(shot, `the tables at height ${height}`).toBe(off.snapshots.get(height));
  }
  expect(compared).toBeGreaterThan(0);
}

describe.each(RUNNER_BACKENDS)("the failure rule of chunks on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const POINTS: readonly FaultAt[] = ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-settle", "cursor-check", "on-after-db-write"];

  for (const at of POINTS) {
    for (const retryable of at === "cursor-check" ? [false] : [false, true]) {
      it(`a ${retryable ? "retryable" : "non-retryable"} failure at ${at} of block ${K}, in the middle of the chunk 6..10`, async () => {
        const fault = { at, retryable };
        const off = await runCase(backend, { fault });
        const on = await runCase(backend, { fault, blocks: 5 });
        // The same halt, or the same retry, as the mode off.
        expect(on.failures.map(where)).toEqual(off.failures.map(where));
        expect(on.failures[0]?.height).toBe(K);
        const writes = at === "on-db-write" || at === "on-settle" || at === "cursor-check";
        if (retryable) {
          expect(on.cursor).toBe(HEAD);
          expect(off.cursor).toBe(HEAD);
        } else if (at === "on-after-db-write") {
          // The one difference: the chunk committed, so the cursor is its last block, not K.
          expect(off.cursor).toBe(K);
          expect(on.cursor).toBe(HEAD);
        } else {
          expect(on.cursor).toBe(K - 1n);
          expect(off.cursor).toBe(K - 1n);
        }
        // The follower's facts.
        if (writes && retryable) {
          expect(on.facts).toEqual([...committed(1n, 5n), ...rolledBack(6n, 7n, K), ...committed(6n, HEAD)]);
        } else if (writes) {
          expect(on.facts).toEqual([...committed(1n, 5n), ...rolledBack(6n, 7n, K), ...committed(6n, 7n)]);
        } else if (at === "on-after-db-write" && !retryable) {
          expect(on.facts).toEqual(committed(1n, HEAD));
        } else {
          expect(on.facts).toEqual(off.facts);
        }
        // The failing callback as often as the mode off calls it (once, unless retried); nothing fetched or parsed again
        // up to K where the mode off does not fetch it again.
        const failingCall = at === "cursor-check" ? `on-settle@${K}` : `${at}@${K}`;
        if (at === "on-after-db-write" && retryable) {
          // The retry re-delivers the cursor's block: 10 for the chunk, 8 with the mode off; 9's is never delivered.
          expect([8n, 9n, 10n].map((h) => count(on.calls, `on-after-db-write@${h}`))).toEqual([1, 0, 1]);
          expect([8n, 9n, 10n].map((h) => count(off.calls, `on-after-db-write@${h}`))).toEqual([2, 1, 1]);
        } else {
          expect(count(on.calls, failingCall)).toBe(count(off.calls, failingCall));
        }
        for (let h = 1n; h <= K; h++) {
          for (const point of ["on-fetch", "on-parse"]) {
            const offCount = count(off.order, `${point}@${h}`);
            expect(count(on.order, `${point}@${h}`), `${point}@${h}`).toBe(offCount);
            expect(offCount).toBeLessThanOrEqual(retryable && (at === "on-fetch" || at === "on-parse") && h === K ? 2 : 1);
          }
        }
        // Blocks stored again: from on-compute, continues false.
        if (writes) {
          for (const h of [6n, 7n]) {
            const computes = on.seen.filter((entry) => entry.point === "on-compute" && entry.height === h);
            // In the chunk (6 its first block, the block before committed in this run), then stored again.
            expect(computes.map((entry) => entry.continues), `on-compute@${h}`).toEqual([true, false]);
          }
        }
        sameTables(on, off);
      }, 120_000);
    }
  }

  for (const at of [K, HEAD]) {
    it(`a deferred constraint in the database, broken by block ${at}: no chunk forms, and the block fails at its own COMMIT, called once, as with the mode off`, async () => {
      const off = await runCase(backend, { deferred: at });
      const on = await runCase(backend, { deferred: at, blocks: 5 });
      expect(on.failures.map(where)).toEqual(off.failures.map(where));
      expect(on.failures.map((failure) => failure.height)).toEqual([at]);
      expect(on.failures[0]?.cause).toMatchObject({ code: "database-error", details: { sqlstate: "23505" } });
      expect(on.cursor).toBe(at - 1n);
      expect(off.cursor).toBe(at - 1n);
      // Every block in a transaction of its own: the facts of the mode off, and each callback as often.
      expect(off.facts).toEqual([...committed(1n, at - 1n), ...rolledBack(at)]);
      expect(on.facts).toEqual(off.facts);
      expect(on.calls).toEqual(off.calls);
      expect(count(on.calls, `on-db-write@${at}`)).toBe(1);
      // One transaction more than the mode off: the read before the first chunk would form.
      expect(count(on.order, "BEGIN")).toBe(count(off.order, "BEGIN") + 1);
      sameTables(on, off);
    }, 120_000);
  }

  for (const lost of ["landed", "lost"] as const) {
    it(`a COMMIT whose answer was lost, ${lost === "landed" ? "after it landed" : "with the transaction rolled back"}: held, then settled by the next run's cursor read`, async () => {
      const off = await runCase(backend, { lostCommit: lost });
      const on = await runCase(backend, { lostCommit: lost, blocks: 5 });
      expect(on.cursor).toBe(HEAD);
      expect(on.failures.map((failure) => [failure.height, failure.committed])).toEqual([[HEAD, false]]);
      if (lost === "landed") {
        expect(on.facts).toEqual(committed(1n, HEAD));
        // Every block's on-after-db-write once, after the next run's cursor read.
        for (let h = 6n; h <= HEAD; h++) expect(count(on.calls, `on-after-db-write@${h}`), `on-after-db-write@${h}`).toBe(1);
      } else {
        expect(on.facts).toEqual([...committed(1n, 5n), ...rolledBack(6n, 7n, 8n, 9n, 10n), ...committed(6n, HEAD)]);
        for (let h = 6n; h <= HEAD; h++) {
          const computes = on.seen.filter((entry) => entry.point === "on-compute" && entry.height === h);
          expect(computes.at(-1)?.continues, `on-compute@${h}`).toBe(false);
        }
      }
      for (let h = 1n; h <= HEAD; h++) expect(count(on.order, `on-fetch@${h}`), `on-fetch@${h}`).toBe(1);
      expect(off.cursor).toBe(HEAD);
      sameTables(on, off);
    }, 120_000);
  }

  it.runIf(backend.name.startsWith("PostgreSQL"))("a lost connection inside the chunk: held; the next run stores 6 and 7 again, then 8 alone", async () => {
    const off = await runCase(backend, { terminate: true });
    const on = await runCase(backend, { terminate: true, blocks: 5 });
    expect(on.failures.map((failure) => [failure.height, failure.committed])).toEqual([[K, false]]);
    expect(off.failures.map((failure) => [failure.height, failure.committed])).toEqual([[K, false]]);
    expect(on.cursor).toBe(HEAD);
    expect(on.facts).toEqual([...committed(1n, 5n), ...rolledBack(6n, 7n, K), ...committed(6n, HEAD)]);
    // The blocks stored again are not fetched again; 9 and 10, taken in the first run and never begun, are in the next.
    for (let h = 1n; h <= K; h++) expect(count(on.order, `on-fetch@${h}`), `on-fetch@${h}`).toBe(1);
    sameTables(on, off);
  }, 120_000);
});
