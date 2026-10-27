import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { BlockItems } from "../../src/runner/block-context.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import {
  type CommitOutcome,
  FinalizedLoop,
  HeightFailure,
  type HeightRun,
  type HeldHeight,
  type LoopInput,
  UnexpectedCursor,
} from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { cursorOf, heightsIn, InMemoryBlockSource, loopInput, RUNNER_BACKENDS, type Started, startWith } from "./loop-harness.js";

/**
 * A height held for a retry of its loop (task 10.4; IN-10, IN-11; `src/runner/loop.ts`), on PostgreSQL 18 and PGlite
 * 0.5.10: the loop fails at h with a retryable failure (`connection-lost`, `node-unreachable`), and the process runs it
 * again on the same `FinalizedLoop` (task 5.4) — here the test does, after the first run rejected.
 *
 * - A failure once `on-compute` began, in the block transaction too: h is processed again from `on-compute`, the
 *   `block` items of `on-fetch` and `on-parse` kept, those of the failed `on-compute` dropped; nothing is fetched or
 *   parsed again, `on-start-height` does not fire again, and the cursor's `on-after-db-write` is not re-delivered.
 * - A failure in `on-start-height`: h resumes there, its items kept.
 * - A lost `COMMIT` (a database whose block transaction fails after its body ended: after the commit landed, or with the
 *   transaction rolled back — both backends, where a real connection cannot be lost on PGlite): the next run reads the
 *   cursor first, inside a transaction on the writer (whose new session takes the writer lock again first, DB-11);
 *   h with the block's hash — `on-after-db-write` fires for h and the loop goes on; h − 1 — h again from `on-compute`;
 *   anything else halts with `unexpected-cursor` at h (IN-11). A failure of that read keeps the height held.
 * - `commitOutcome`'s table over every cursor.
 * A failure before `on-parse` ended holds nothing: the loop runs again from the cursor (`retries.test.ts`).
 */

const HEAD = 5n;
const H = 3n;

/** What the modules saw, as `<module> <point>@<height>`, and what `keep` read of the block items. */
interface Seen {
  readonly calls: string[];
  /** At each `on-compute` of `keep`: the `keep-parsed` item's number, and whether `keep-computed` was there already. */
  readonly computed: string[];
  /** At each `on-db-write` of `keep`: the `keep-computed` item's number. */
  readonly written: string[];
}

/** A fault to raise once, at a point and height of a module: the error it throws. */
type Faults = Map<string, Error>;

/** Throws the fault planted for `module`'s `point` at `height`, once. */
function fault(faults: Faults, module: string, point: PointName, height: bigint): void {
  const key = `${module} ${point}@${height}`;
  const error = faults.get(key);
  if (error === undefined) return;
  faults.delete(key);
  throw error;
}

/**
 * Module `keep`, from 1: puts `keep-parsed` (`{ n }`, its `on-parse` count) at `on-parse` and `keep-computed` (its
 * `on-compute` count) at `on-compute`, reads both later, writes its row at `on-db-write`; `late`, from H, has an
 * `on-start-height`. Each callback may throw its planted fault — `on-db-write`'s after the row; `arm` runs at `keep`'s
 * `on-db-write` of H, the first time.
 */
function modules(seen: Seen, faults: Faults, arm: () => void = () => undefined): ModuleDeclaration[] {
  let parses = 0;
  let computes = 0;
  let armed = false;
  const note = (module: string, point: PointName, height: bigint) => {
    seen.calls.push(`${module} ${point}@${height}`);
    fault(faults, module, point, height);
  };
  const keep = declaration("keep", {
    provides: [
      { name: "keep-parsed", lifetimes: ["block"] },
      { name: "keep-computed", lifetimes: ["block"] },
      { name: "keep-rows", lifetimes: ["table"], table: { schema: "keep", tables: ["rows"], kind: "append-only" } },
    ],
    points: {
      async "on-fetch"(_p, b) {
        note("keep", "on-fetch", b.height);
      },
      async "on-parse"(_p, b, sink) {
        parses += 1;
        sink.put("keep-parsed", Object.freeze({ n: parses }));
        note("keep", "on-parse", b.height);
      },
      async "on-compute"(_p, b, _read, sink) {
        const parsed = b.items.get("keep-parsed") as { readonly n: number } | undefined;
        seen.computed.push(`${b.height}: parsed ${parsed?.n ?? "none"}, computed ${b.items.has("keep-computed") ? "there" : "not there"}`);
        computes += 1;
        sink.put("keep-computed", Object.freeze({ n: computes }));
        note("keep", "on-compute", b.height);
      },
      async "on-db-write"(_p, b, w) {
        seen.written.push(`${b.height}: computed ${(b.items.get("keep-computed") as { readonly n: number } | undefined)?.n ?? "none"}`);
        await w.execute("INSERT INTO keep.rows (height) VALUES ($1)", [b.height]);
        if (b.height === H && !armed) {
          armed = true;
          arm();
        }
        note("keep", "on-db-write", b.height);
      },
      async "on-after-db-write"(_p, b) {
        note("keep", "on-after-db-write", b.height);
      },
    },
  });
  const late = declaration("late", {
    points: {
      async "on-start-height"(_p, started) {
        note("late", "on-start-height", started.height);
      },
      // Not recorded: it runs once per head in a range holding H, so only a planted fault shows it.
      async "on-finalized"(_p, head) {
        fault(faults, "late", "on-finalized", head.height);
      },
    },
  });
  return [keep, late];
}

/** Why a commit was lost: after it landed, or with the transaction rolled back. */
type LostCommit = "landed" | "lost";

/** The error a lost `COMMIT` gives (DB-13). */
const lostCommit = (): UmbraError =>
  new UmbraError("connection-lost", "the connection was lost during the COMMIT (the test's database)");

/**
 * `db`, whose block transaction loses its `COMMIT` once armed — after the commit (`landed`), or rolled back (`lost`) —
 * and whose next transaction fails before its body once `failNext` is set; `calls` lists each `read` and `transaction`.
 */
function losingCommits(db: Database) {
  const state = { armed: undefined as LostCommit | undefined, failNext: false, calls: [] as string[] };
  const wrapped: Database = {
    read: (body, options) => {
      state.calls.push("read");
      return db.read(body, options);
    },
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      state.calls.push("transaction");
      if (state.failNext) {
        state.failNext = false;
        throw new UmbraError("connection-lost", "the connection was lost before the transaction began (the test's database)");
      }
      let lost: LostCommit | undefined;
      const result = await db.transaction(async (tx) => {
        const value = await body(tx);
        lost = state.armed;
        state.armed = undefined;
        if (lost === "lost") throw lostCommit();
        return value;
      });
      if (lost === "landed") throw lostCommit();
      return result;
    },
    close: () => db.close(),
  };
  return { db: wrapped, state };
}

/** A loop over `started` and `source` — its input's `db` and `observer` replaced by `extra`'s when given — and its stop. */
function loopOver(
  started: Started,
  source: InMemoryBlockSource,
  extra: Partial<Pick<LoopInput, "db" | "observer">> = {},
): { readonly loop: FinalizedLoop; readonly stop: AbortController } {
  const stop = new AbortController();
  return { loop: new FinalizedLoop({ ...loopInput(started, source, stop), ...extra }), stop };
}

/** One run of `loop`: its failure, or — once it waits for a head above HEAD, stopped — undefined. */
async function runOnce(loop: FinalizedLoop, source: InMemoryBlockSource, stop: AbortController): Promise<unknown> {
  const running = loop.run().then(
    () => undefined,
    (error: unknown) => error,
  );
  const outcome = await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running]);
  if (outcome === "waiting") stop.abort();
  return running;
}

/** The calls of `call` (`<module> <point>@<height>`) in `seen`. */
const count = (seen: Seen, call: string): number => seen.calls.filter((c) => c === call).length;

/** The retryable failure a first run stops with: at H, before the commit, its cause retryable. */
function expectRetryable(failure: unknown): void {
  expect(failure).toBeInstanceOf(HeightFailure);
  expect((failure as HeightFailure).height).toBe(H);
  expect((failure as HeightFailure).committed).toBe(false);
}

describe.each(RUNNER_BACKENDS)("a height held for a retry (IN-10, IN-11) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  async function setUp(faults: Faults, arm?: () => void) {
    const { db } = await backend.database();
    const seen: Seen = { calls: [], computed: [], written: [] };
    const started = await startWith(db, modules(seen, faults, arm), [entry("keep", 1), entry("late", Number(H))]);
    return { db, seen, started, source: new InMemoryBlockSource({ head: HEAD }) };
  }

  /** IN-10's "processed again from on-compute": every height once, H's points before on-compute once, its later ones twice. */
  function fromComputeProblems(seen: Seen): string[] {
    const problems: string[] = [];
    const times = (call: string, expected: number) => {
      if (count(seen, call) !== expected) problems.push(`${call} ran ${count(seen, call)} times, not ${expected}`);
    };
    for (const height of [1n, 2n, 4n, 5n]) {
      for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"]) times(`keep ${point}@${height}`, 1);
    }
    times(`keep on-fetch@${H}`, 1);
    times(`keep on-parse@${H}`, 1);
    times(`late on-start-height@${H}`, 1);
    times(`keep on-compute@${H}`, 2);
    times(`keep on-after-db-write@${H}`, 1);
    return problems;
  }

  it("a connection lost in on-db-write of h: the next run processes h from on-compute with its on-parse items, the failed on-compute's dropped", async () => {
    const faults: Faults = new Map([[`keep on-db-write@${H}`, new UmbraError("connection-lost", "the writer's connection was lost")]]);
    const { db, seen, started, source } = await setUp(faults);
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    expect(await cursorOf(db)).toBe(H - 1n);
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(fromComputeProblems(seen)).toEqual([]);
    expect(count(seen, `keep on-db-write@${H}`)).toBe(2);
    // Both on-computes of H read the one parse of H, and not their own item: the first try's keep-computed was dropped.
    expect(seen.computed.filter((line) => line.startsWith(`${H}:`))).toEqual([
      `${H}: parsed ${H}, computed not there`,
      `${H}: parsed ${H}, computed not there`,
    ]);
    // Each on-db-write of H saw its own on-compute's item: the third on-compute (H's first try), then the fourth.
    expect(seen.written.filter((line) => line.startsWith(`${H}:`))).toEqual([`${H}: computed 3`, `${H}: computed 4`]);
    expect(await heightsIn(db, "keep.rows")).toEqual([1n, 2n, 3n, 4n, 5n]);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("a node unreachable in on-compute of h: h is processed again from on-compute; a later run of the loop holds nothing", async () => {
    const faults: Faults = new Map([
      [`keep on-compute@${H}`, new UmbraError("node-unreachable", "the node did not answer")],
      // The run that processes H again then stops at H + 1, before its on-parse ended: the run after starts from H.
      [`keep on-fetch@${H + 1n}`, new UmbraError("node-unreachable", "the node did not answer")],
    ]);
    const { db, seen, started, source } = await setUp(faults);
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    const second = await runOnce(loop, source, stop);
    expect(second).toBeInstanceOf(HeightFailure);
    expect(second).toMatchObject({ height: H + 1n, committed: false });
    expect(await cursorOf(db)).toBe(H);
    const before = seen.calls.length;
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    // H again from on-compute; its on-after-db-write once in the second run, then re-delivered by the third.
    for (const [call, times] of [
      [`keep on-fetch@${H}`, 1],
      [`keep on-parse@${H}`, 1],
      [`late on-start-height@${H}`, 1],
      [`keep on-compute@${H}`, 2],
      [`keep on-db-write@${H}`, 1],
      [`keep on-after-db-write@${H}`, 2],
    ] as const) {
      expect(count(seen, call), call).toBe(times);
    }
    expect(seen.computed.filter((line) => line.startsWith(`${H}:`))).toEqual([
      `${H}: parsed ${H}, computed not there`,
      `${H}: parsed ${H}, computed not there`,
    ]);
    // The third run starts from the cursor H, which it re-delivers, and fetches H + 1 again: H was held once.
    expect(seen.calls.slice(before, before + 3)).toEqual([
      `keep on-after-db-write@${H}`,
      `keep on-fetch@${H + 1n}`,
      `keep on-parse@${H + 1n}`,
    ]);
    expect(count(seen, `keep on-fetch@${H + 1n}`)).toBe(2);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("a node unreachable in on-parse of h holds nothing: the next run starts from the cursor, re-delivered, and fetches h again", async () => {
    const faults: Faults = new Map([[`keep on-parse@${H}`, new UmbraError("node-unreachable", "the node did not answer")]]);
    const { db, seen, started, source } = await setUp(faults);
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    const before = seen.calls.length;
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(seen.calls.slice(before, before + 4)).toEqual([
      `keep on-after-db-write@${H - 1n}`,
      `keep on-fetch@${H}`,
      `keep on-parse@${H}`,
      `late on-start-height@${H}`,
    ]);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("a connection lost in on-start-height of h: h resumes at on-start-height, its on-parse items kept, not parsed again", async () => {
    const faults: Faults = new Map([[`late on-start-height@${H}`, new UmbraError("connection-lost", "the reader's connection was lost")]]);
    const { db, seen, started, source } = await setUp(faults);
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(count(seen, `keep on-fetch@${H}`)).toBe(1);
    expect(count(seen, `keep on-parse@${H}`)).toBe(1);
    expect(count(seen, `late on-start-height@${H}`)).toBe(2);
    expect(count(seen, `keep on-compute@${H}`)).toBe(1);
    expect(seen.computed.filter((line) => line.startsWith(`${H}:`))).toEqual([`${H}: parsed ${H}, computed not there`]);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("a COMMIT lost after it landed: the next run reads the cursor in a transaction first, finds h, fires on-after-db-write for h and goes on", async () => {
    const { db: raw, seen, started, source } = await setUp(new Map(), () => {
      losing.state.armed = "landed";
    });
    const losing = losingCommits(raw);
    const committed: bigint[] = [];
    const observer = { committed: (block: BlockRef) => void committed.push(block.height) };
    const { loop, stop } = loopOver(started, source, { db: losing.db, observer });
    expectRetryable(await runOnce(loop, source, stop));
    expect(await cursorOf(raw)).toBe(H);
    expect(committed).toEqual([1n, 2n]);
    const calls = losing.state.calls.length;
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(losing.state.calls[calls]).toBe("transaction");
    expect(committed).toEqual([1n, 2n, 3n, 4n, 5n]);
    for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"]) {
      expect(count(seen, `keep ${point}@${H}`), point).toBe(1);
    }
    expect(seen.calls.indexOf(`keep on-after-db-write@${H}`)).toBeLessThan(seen.calls.indexOf(`keep on-fetch@${H + 1n}`));
    expect(await heightsIn(raw, "keep.rows")).toEqual([1n, 2n, 3n, 4n, 5n]);
  }, 60_000);

  it("a COMMIT lost after it landed, then on-after-db-write of h failing in the next run: it stops at h with h committed", async () => {
    const faults: Faults = new Map();
    const { db: raw, seen, started, source } = await setUp(faults, () => {
      losing.state.armed = "landed";
      faults.set(`keep on-after-db-write@${H}`, new Error("keep cannot finish h"));
    });
    const losing = losingCommits(raw);
    const { loop, stop } = loopOver(started, source, { db: losing.db });
    expectRetryable(await runOnce(loop, source, stop));
    const failure = await runOnce(loop, source, stop);
    expect(failure).toBeInstanceOf(HeightFailure);
    expect(failure).toMatchObject({ height: H, committed: true, point: "on-after-db-write", module: "keep" });
    expect(count(seen, `keep on-after-db-write@${H}`)).toBe(1);
    expect(count(seen, `keep on-fetch@${H + 1n}`)).toBe(0);
    expect(await cursorOf(raw)).toBe(H);
  }, 60_000);

  it("a COMMIT lost with its transaction rolled back: the next run finds h − 1 and processes h again from on-compute", async () => {
    const { db: raw, seen, started, source } = await setUp(new Map(), () => {
      losing.state.armed = "lost";
    });
    const losing = losingCommits(raw);
    const { loop, stop } = loopOver(started, source, { db: losing.db });
    expectRetryable(await runOnce(loop, source, stop));
    expect(await cursorOf(raw)).toBe(H - 1n);
    const calls = losing.state.calls.length;
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(losing.state.calls[calls]).toBe("transaction");
    expect(fromComputeProblems(seen)).toEqual([]);
    expect(count(seen, `keep on-db-write@${H}`)).toBe(2);
    expect(await heightsIn(raw, "keep.rows")).toEqual([1n, 2n, 3n, 4n, 5n]);
  }, 60_000);

  it("a COMMIT lost, then the cursor moved by another writer: the next run halts with unexpected-cursor at h", async () => {
    const { db: raw, seen, started, source } = await setUp(new Map(), () => {
      losing.state.armed = "lost";
    });
    const losing = losingCommits(raw);
    const { loop, stop } = loopOver(started, source, { db: losing.db });
    expectRetryable(await runOnce(loop, source, stop));
    // Another writer: blocks 2 and above gone, the cursor 1.
    await raw.transaction(async (tx) => {
      await tx.execute("DELETE FROM core_block_commit.hashes WHERE height > 1");
      await tx.execute("DELETE FROM core_block_commit.blocks WHERE height > 1");
    });
    const failure = await runOnce(loop, source, stop);
    expect(failure).toBeInstanceOf(HeightFailure);
    expect(failure).toMatchObject({ height: H, committed: false, point: undefined, module: undefined });
    expect((failure as HeightFailure).cause).toBeInstanceOf(UnexpectedCursor);
    expect((failure as HeightFailure).message).toMatch(/after the COMMIT of height 3 was lost the cursor is at height 1/);
    expect(count(seen, `keep on-compute@${H}`)).toBe(1);
    expect(count(seen, `keep on-after-db-write@${H}`)).toBe(0);
    expect(await cursorOf(raw)).toBe(1n);
  }, 60_000);

  it("a lost connection on the way to the held h (on-finalized of the head) keeps h held for the run after it", async () => {
    const faults: Faults = new Map([[`keep on-db-write@${H}`, new UmbraError("connection-lost", "the writer's connection was lost")]]);
    const { db, seen, started, source } = await setUp(faults, () => {
      // Fires in the second run only: the first announced the head when its range did not hold H.
      faults.set(`late on-finalized@${HEAD}`, new UmbraError("connection-lost", "the reader's connection was lost"));
    });
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    const second = await runOnce(loop, source, stop);
    expectRetryable(second);
    expect((second as HeightFailure).point).toBe("on-finalized");
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(fromComputeProblems(seen)).toEqual([]);
    expect(count(seen, `keep on-db-write@${H}`)).toBe(2);
    expect(await cursorOf(db)).toBe(HEAD);
  }, 60_000);

  it("a connection lost in on-db-write of h, then every block deleted by another writer: the next run halts with unexpected-cursor, naming the transaction lost before its COMMIT and no cursor", async () => {
    const faults: Faults = new Map([[`keep on-db-write@${H}`, new UmbraError("connection-lost", "the writer's connection was lost")]]);
    const { db, started, source } = await setUp(faults);
    const { loop, stop } = loopOver(started, source);
    expectRetryable(await runOnce(loop, source, stop));
    await db.transaction(async (tx) => {
      await tx.execute("DELETE FROM core_block_commit.hashes");
      await tx.execute("DELETE FROM core_block_commit.blocks");
    });
    const failure = await runOnce(loop, source, stop);
    expect(failure).toMatchObject({ height: H, committed: false });
    expect((failure as HeightFailure).cause).toBeInstanceOf(UnexpectedCursor);
    expect((failure as HeightFailure).message).toMatch(
      /after the block transaction of height 3 was lost before its COMMIT the cursor is at none, not height 2, where it was/,
    );
    expect(await cursorOf(db)).toBeNull();
  }, 60_000);

  it("a lost connection while the next run reads the cursor keeps h held for the run after it", async () => {
    const { db: raw, seen, started, source } = await setUp(new Map(), () => {
      losing.state.armed = "lost";
    });
    const losing = losingCommits(raw);
    const { loop, stop } = loopOver(started, source, { db: losing.db });
    expectRetryable(await runOnce(loop, source, stop));
    losing.state.failNext = true;
    const failure = await runOnce(loop, source, stop);
    expectRetryable(failure);
    expect(((failure as HeightFailure).cause as UmbraError).code).toBe("connection-lost");
    expect(await runOnce(loop, source, stop)).toBeUndefined();
    expect(fromComputeProblems(seen)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);
});

/** A loop whose `commitOutcome` a test calls. */
class Outcomes extends FinalizedLoop {
  outcome(held: HeldHeight, cursor: BlockRef | null): CommitOutcome {
    return this.commitOutcome(held, cursor);
  }
}

describe("commitOutcome: what the cursor says after a lost block transaction (IN-10, IN-11)", () => {
  const loop = new Outcomes({} as LoopInput);
  const block = (height: bigint): BlockRef => inMemoryBlock(height);
  const other = (height: bigint): BlockRef => ({ ...inMemoryBlock(height), hash: new Uint8Array(32).fill(7) });
  const held = (previous: BlockRef | null, uncertain: boolean, height = H): HeldHeight => {
    const run: HeightRun = { height, block: block(height), range: {} as HeightRun["range"], items: new BlockItems(height), previous };
    return { run, items: new Map(), from: "on-compute", uncertain };
  };

  it("after an uncertain COMMIT: h with the block's hash committed, h − 1 not, anything else unexpected", () => {
    const uncertain = held(block(H - 1n), true);
    expect(loop.outcome(uncertain, block(H))).toBe("committed");
    expect(loop.outcome(uncertain, block(H - 1n))).toBe("not-committed");
    expect(loop.outcome(uncertain, other(H))).toBe("unexpected");
    expect(loop.outcome(uncertain, other(H - 1n))).toBe("unexpected");
    expect(loop.outcome(uncertain, block(H - 2n))).toBe("unexpected");
    expect(loop.outcome(uncertain, block(H + 1n))).toBe("unexpected");
    expect(loop.outcome(uncertain, null)).toBe("unexpected");
  });

  it("at S on a new database: no cursor is h − 1", () => {
    const first = held(null, true, 1n);
    expect(loop.outcome(first, null)).toBe("not-committed");
    expect(loop.outcome(first, block(1n))).toBe("committed");
    expect(loop.outcome(first, other(1n))).toBe("unexpected");
    expect(loop.outcome(first, block(0n))).toBe("unexpected");
  });

  it("after a transaction lost before its COMMIT: only h − 1 is expected, h itself is unexpected", () => {
    const certain = held(block(H - 1n), false);
    expect(loop.outcome(certain, block(H - 1n))).toBe("not-committed");
    expect(loop.outcome(certain, block(H))).toBe("unexpected");
    expect(loop.outcome(certain, null)).toBe("unexpected");
  });
});
