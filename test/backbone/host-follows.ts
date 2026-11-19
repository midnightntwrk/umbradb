import { boundLedgerParser, CORE_BLOCK_PARSED_ID } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { boundLedger, CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { BlockContext, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { type CommitOutcome, FinalizedLoop, type HeightRun, type HeldHeight, type LoopInput } from "../../src/runner/loop.js";
import type { TransactionFollower } from "../../src/runner/transaction-follower.js";
import type { LoggedRequest } from "../ledger/fixtures/request-log-loader.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { type LostCommit, losingCommits } from "../runner/block-continues-harness.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { SWEEP_LOADER } from "./ledger-graph-tapes.js";
import { type DagRun, runDag } from "./refcount-process.js";

/**
 * The runs of the extended DAG fixture through the real process (`./refcount-process.ts`) that show what the ledger
 * worker's thread is sent of each block's transaction, shared by `ledger-host-follows.test.ts` and its negative
 * control. Imports nothing of Vitest.
 * - The thread records every request it receives and when it arrived, on the clock every thread of the process shares
 *   (`test/ledger/fixtures/request-log-loader.ts`, around the sweep test package).
 * - The process's loop records when each height's block transaction answered, or, after a `COMMIT` whose answer was
 *   lost, when the next run's cursor read found the height committed; and it loses the `COMMIT` of one height when
 *   asked, after it landed or with its transaction rolled back (`../runner/block-continues-harness.ts`'s `losingCommits`).
 *   The process runs the same loop again after its back-off, so the next run settles that height.
 * - A negative control's loop tells the process's follower otherwise ({@link FollowRunOptions.follower}).
 */

/** The loader that records the thread's requests. */
export const REQUEST_LOG_LOADER = new URL("../ledger/fixtures/request-log-loader.ts", import.meta.url);

/** What a run is given. */
export interface FollowRunOptions {
  /** The tape's last height. */
  readonly last: number;
  /** The height whose `COMMIT` is lost once, and how; none unless given. */
  readonly lose?: { readonly at: bigint; readonly how: LostCommit };
  /** The follower the loop tells, given the process's (the ledger worker's host): the process's unless given. */
  readonly follower?: (process: TransactionFollower) => TransactionFollower;
  /** Wait for a halt as well as the last height. */
  readonly halts?: boolean;
  /** The height at whose eviction the test package of the first thread refuses; none unless given. */
  readonly refuse?: bigint;
  /** The cursor the database already holds, for a run that restarts there. */
  readonly resume?: bigint;
  /**
   * The parent's build, rebuilt here to compare with: the loop tells no follower, `core-ledger-state`'s
   * `on-after-db-write` commits the block in the worker and `core-block-parsed`'s releases the parses kept up to it, as
   * both did before the engine told the host.
   */
  readonly parentBuild?: boolean;
}

/** What a run gave. */
export interface FollowRun {
  readonly run: DagRun;
  /** Every request the worker's thread received, in order. */
  readonly requests: readonly LoggedRequest[];
  /** When each height was last found committed: its `COMMIT` answered, or the cursor read after a lost one said so. */
  readonly settled: ReadonlyMap<bigint, number>;
  /** The test package's counters (`storeLoads`: states its threads loaded from the database). */
  readonly counters: Readonly<Record<keyof typeof COUNTERS, number>>;
  /**
   * What the process asked of the worker's host, in order: `lend <h>` and `taken back <h>` (a read lent while the
   * eviction of `h`'s settle is awaited, and that read taken back once no node request uses it), `evict <h>` and its
   * outcome (`evicted <h>`, `refused <h>`), `restart`, and the facts `written <h>`, `committed <h>`, `rolledBack <h>`.
   */
  readonly events: readonly string[];
}

/** The clock every thread of the process shares, in ms (as `src/trace/worker-trace.ts`'s `traceClock`). */
const clock = (): number => performance.timeOrigin + performance.now();

/** Runs the extended DAG on `db` (see the module comment). */
export async function followRun(db: ProcessDatabase, options: FollowRunOptions): Promise<FollowRun> {
  const memory = countersMemory();
  const settled = new Map<bigint, number>();
  const events: string[] = [];
  /** The height whose block transaction the loop has open or last had. */
  let latest = -1n;
  const { lose, follower } = options;
  let host: LedgerHost | undefined;
  let requests: readonly LoggedRequest[] = [];
  let losing: ReturnType<typeof losingCommits> | undefined;
  let lost = false;
  /** The loop's input over a database that can lose a `COMMIT`, its follower the given one. */
  const prepared = (input: LoopInput): LoopInput => {
    losing = losingCommits(input.db);
    const { follower: given, ...rest } = input;
    if (options.parentBuild === true) return { ...rest, db: losing.db };
    return { ...input, db: losing.db, ...(given === undefined || follower === undefined ? {} : { follower: follower(given) }) };
  };
  class Following extends FinalizedLoop {
    constructor(input: LoopInput) {
      super(prepared(input));
    }

    protected override async commit(run: HeightRun): Promise<void> {
      latest = run.height;
      if (lose !== undefined && run.height === lose.at && !lost && losing !== undefined) {
        lost = true;
        losing.state.armed = lose.how;
      }
      await super.commit(run);
      settled.set(run.height, clock());
    }

    protected override commitOutcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
      const outcome = super.commitOutcome(held, cursor);
      if (outcome === "committed") settled.set(held.run.height, clock());
      return outcome;
    }
  }
  const run = await runDag(db, {
    dag: "extended",
    last: options.last,
    ...(options.halts === undefined ? {} : { halts: options.halts }),
    ...(options.resume === undefined ? {} : { resume: options.resume }),
    ...(options.parentBuild === true ? { modules: parentPoints } : {}),
    data: { counters: memory, ...(options.refuse === undefined ? {} : { refuseAt: `${options.refuse}`, threads: 1 }) },
    settings: { backoffCeilingMs: 20 },
    loop: Following,
    loader: (data) => ({ loader: REQUEST_LOG_LOADER, loaderData: { loader: SWEEP_LOADER.href, data } }),
    worker: (recording) => {
      host = recording;
      return eventsOf(recording, events, () => latest);
    },
    atLast: async () => {
      // The last height's release (and, when it was applied, its commit) may still be on its way: they are sent when its
      // COMMIT answered, or by a parent build's on-after-db-write after it, while the cursor is already there.
      const last = BigInt(options.last);
      for (let attempt = 0; attempt < 200; attempt++) {
        requests = ((await host?.probe()) as readonly LoggedRequest[] | undefined) ?? [];
        const sent = (type: string) => requests.some((request) => request.type === type && (type === "release" ? request.upTo : request.height) === last);
        if (options.halts === true || (sent("release") && sent("commit"))) break;
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    },
  });
  const shared = new Int32Array(memory);
  const counters = Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<
    keyof typeof COUNTERS,
    number
  >;
  return { run, requests: requests.filter((request) => request.type !== "probe"), settled, counters, events };
}

/** `host`, what the process asks of it recorded in `events` (see {@link FollowRun.events}), `at` the height in progress. */
function eventsOf(host: LedgerHost, events: string[], at: () => bigint): LedgerHost {
  return new Proxy(host, {
    get(target, property, receiver) {
      switch (property) {
        case "lend":
          return (read: Parameters<LedgerHost["lend"]>[0]) => {
            const height = at();
            events.push(`lend ${height}`);
            const takeBack = target.lend(read);
            return async () => {
              await takeBack();
              events.push(`taken back ${height}`);
            };
          };
        case "evict":
          return async (keys: Parameters<LedgerHost["evict"]>[0]) => {
            const height = at();
            events.push(`evict ${height}`);
            try {
              const evicted = await target.evict(keys);
              events.push(`evicted ${height}`);
              return evicted;
            } catch (error) {
              events.push(`refused ${height}`);
              throw error;
            }
          };
        case "restart":
          return async () => {
            events.push("restart");
            await target.restart();
          };
        case "written":
        case "committed":
        case "rolledBack":
          return (block: Parameters<LedgerHost["committed"]>[0]) => {
            events.push(`${property} ${block.height}`);
            target[property](block);
          };
        default:
          return Reflect.get(target, property, receiver);
      }
    },
  });
}

/**
 * What the thread must have been sent of the commits of heights 0 to `last`, as problems (none when it holds): one
 * commit per height, in height order, none for a transaction that did not commit; each reaching the thread after the
 * height was found committed (its `COMMIT` answered, or the cursor read after a lost answer); each followed at once by
 * the release of the parses kept up to its height.
 */
export function commitProblems(follow: FollowRun, last: number): string[] {
  const problems: string[] = [];
  const { requests, settled } = follow;
  const commits = requests.flatMap((request, index) => (request.type === "commit" ? [{ request, index }] : []));
  const heights = commits.map(({ request }) => String(request.height));
  const expected = Array.from({ length: last + 1 }, (_, h) => String(h));
  if (heights.join(",") !== expected.join(",")) {
    problems.push(`the thread got commits for ${heights.join(",")}, not one for each height of 0 to ${last} in order`);
  }
  for (const { request, index } of commits) {
    const height = request.height as bigint;
    const found = settled.get(height);
    if (found === undefined) problems.push(`commit ${height} for a height never found committed`);
    else if (request.at < found) problems.push(`commit ${height} reached the thread before its COMMIT answered`);
    const next = requests[index + 1];
    if (next?.type !== "release" || next.upTo !== height) {
      problems.push(`commit ${height} not followed at once by the release up to ${height} (${next === undefined ? "nothing" : `${next.type} ${String(next.upTo ?? next.height)}`})`);
    }
  }
  return problems;
}

/**
 * `module` with the parent's `on-after-db-write` (see {@link FollowRunOptions.parentBuild}), as each was before the
 * engine told the host: `core-ledger-state` commits the block in the worker, `core-block-parsed` releases the parses kept
 * up to it, neither awaited.
 */
function parentPoints(module: ModuleDeclaration): ModuleDeclaration {
  const after =
    module.id === CORE_LEDGER_STATE_ID
      ? (p: ProcessContext, b: BlockContext) => void boundLedger(p).ledger.commit({ height: b.height, hash: b.hash }).catch(() => undefined)
      : module.id === CORE_BLOCK_PARSED_ID
        ? (p: ProcessContext, b: BlockContext) => void boundLedgerParser(p).release({ upTo: b.height }).catch(() => undefined)
        : undefined;
  if (after === undefined) return module;
  return {
    ...module,
    points: {
      ...module.points,
      async "on-after-db-write"(p: ProcessContext, b: BlockContext) {
        after(p, b);
      },
    },
  } as ModuleDeclaration;
}
