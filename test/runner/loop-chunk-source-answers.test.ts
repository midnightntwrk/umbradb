import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BlockRef, BlockSource } from "../../src/runner/block-source.js";
import type { FinalizedLoop } from "../../src/runner/loop.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { type CaseOptions, type CaseOutcome, runCase, where } from "./loop-chunk-runs.js";
import { cursorOf, type InMemoryBlockSource, RUNNER_BACKENDS, type RunnerBackend } from "./loop-harness.js";

/**
 * What a chunk's blocks ask of the source from `on-compute` on is answered before the chunk's transaction opens
 * (`src/runner/loop.ts`, fast-sync mode; `BlockSource.answered`), on PostgreSQL 18 and PGlite 0.5.10. Heights 1 to 10
 * in chunks of 5; module `led` awaits, at each block's `on-compute`, an answer of the source about that block (as
 * `core-ledger-state` awaits the node's state root), and the source's answer about block 8 does not come.
 * - While the loop waits for it no transaction is open, the cursor is the chunk before's, and the database answers a
 *   read.
 * - The loop's stop ends the wait: the chunk's first block, whose `on-compute` had its answer, is stored, and the loop
 *   returns.
 * - A pause asked meanwhile is reached once the answer came, after the chunk's first block.
 * - An answer that is a failure reaches the block's `on-compute`, which fails as with the mode off: the blocks below
 *   it are committed, and the loop halts there.
 * - With the mode off, for a chunk's first block, and once the loop's stop came, the source is not asked ahead.
 */

const HEAD = 10n;
const STUCK = 8n;

/** How long a step that must not wait on the source may take. */
const BOUND_MS = 5_000;

/** A promise and what settles it. */
function gate<T>(): { readonly promise: Promise<T>; resolve(value: T): void; reject(error: unknown): void } {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((done, failed) => {
    resolve = done;
    reject = failed;
  });
  promise.catch(() => undefined);
  return { promise, resolve, reject };
}

/** The source's answers about blocks: each at once, but block {@link STUCK}'s, which the test settles. */
class Answers {
  readonly stuck = gate<string>();
  /** Resolves when block {@link STUCK}'s answer is first awaited. */
  readonly awaited = gate<void>();
  readonly #asked = new Map<bigint, Promise<string>>();

  /** The answer about `block`, asked once and kept. */
  of(block: Pick<BlockRef, "height">): Promise<string> {
    let answer = this.#asked.get(block.height);
    if (answer === undefined) {
      answer = block.height === STUCK ? this.stuck.promise : Promise.resolve(`answer ${block.height}`);
      this.#asked.set(block.height, answer);
    }
    if (block.height === STUCK) this.awaited.resolve();
    return answer;
  }
}

/** The in-memory chain as a source that is asked ahead for a block's answer (`BlockSource.answered`), marked in `order`. */
function answering(memory: InMemoryBlockSource, answers: Answers, order: string[]): BlockSource {
  return {
    cursor: (read) => memory.cursor(read),
    finalizedHead: () => memory.finalizedHead(),
    latestHead: () => memory.latestHead(),
    waitForHead: (above, signal) => memory.waitForHead(above, signal),
    block: (height) => memory.block(height),
    async answered(block) {
      order.push(`answered@${block.height}`);
      await answers.of(block).catch(() => undefined);
    },
  };
}

/** Module `led`: at `on-compute` it awaits the source's answer about the block, and logs it. */
function asking(answers: Answers, got: string[]): ModuleDeclaration {
  return declaration("led", {
    points: {
      async "on-compute"(_p, b: BlockContext) {
        got.push(await answers.of(b));
      },
    },
  });
}

/** What a run in progress gives a test. */
interface Running {
  readonly outcome: Promise<CaseOutcome>;
  readonly answers: Answers;
  readonly order: string[];
  readonly got: string[];
  loop(): FinalizedLoop;
  db(): Database;
  controller(): AbortController;
}

/** Starts a case with `led` over the answering source; `more` its other options. */
function start(backend: RunnerBackend, more: Partial<CaseOptions> = {}): Running {
  const answers = new Answers();
  const order: string[] = [];
  const got: string[] = [];
  let made: { loop: FinalizedLoop; db: Database; controller: AbortController } | undefined;
  const outcome = runCase(backend, {
    head: HEAD,
    order,
    modules: [asking(answers, got)],
    source: (memory) => answering(memory, answers, order),
    onLoop: (loop, db, controller) => {
      made = { loop, db, controller };
    },
    ...more,
  });
  outcome.catch(() => undefined);
  const given = () => {
    if (made === undefined) throw new Error("the loop is not made yet");
    return made;
  };
  return { outcome, answers, order, got, loop: () => given().loop, db: () => given().db, controller: () => given().controller };
}

/** The failure of a node call the process's stop ended: the node client closed. */
const closed = (): UmbraError => new UmbraError("handle-closed", "the node client was closed (the test's source)", { handle: "node-client" });

/** `promise`'s value, or `"late"` when it has not settled within {@link BOUND_MS}. */
const within = <T>(promise: Promise<T>): Promise<T | "late"> => Promise.race([promise, sleep(BOUND_MS).then(() => "late" as const)]);

describe.each(RUNNER_BACKENDS)("what a chunk's blocks ask of the source, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("is answered before the chunk's BEGIN, for each block after the first, and never with the mode off", async () => {
    const on = start(backend, { blocks: 5 });
    on.answers.stuck.resolve(`answer ${STUCK}`);
    const outcome = await on.outcome;
    expect(outcome.failures).toEqual([]);
    expect(outcome.cursor).toBe(HEAD);
    // Each chunk: its first block's on-compute, then the answers of its later blocks, then the BEGIN.
    const marks = on.order.filter((mark) => mark.startsWith("answered@") || mark === "BEGIN" || /^on-compute@(1|6)$/.test(mark));
    expect(marks).toEqual([
      "on-compute@1",
      ...[2n, 3n, 4n, 5n].map((h) => `answered@${h}`),
      "BEGIN",
      "on-compute@6",
      ...[7n, 8n, 9n, 10n].map((h) => `answered@${h}`),
      "BEGIN",
    ]);
    expect(on.got).toEqual(Array.from({ length: Number(HEAD) }, (_, i) => `answer ${i + 1}`));
    const off = start(backend);
    off.answers.stuck.resolve(`answer ${STUCK}`);
    expect((await off.outcome).cursor).toBe(HEAD);
    expect(off.order.filter((mark) => mark.startsWith("answered@"))).toEqual([]);
  }, 120_000);

  it("is waited for with no transaction open; the loop's stop ends the wait, stores the chunk's first block, and the loop returns", async () => {
    const run = start(backend, { blocks: 5 });
    try {
      expect(await within(run.answers.awaited.promise)).not.toBe("late");
      // Let whatever the loop does next happen: it must stay before the BEGIN.
      await sleep(200);
      expect(run.loop().blockTransaction()).toBeNull();
      expect(await within(cursorOf(run.db()))).toBe(5n);
      expect(run.order.filter((mark) => mark === "BEGIN")).toHaveLength(1);
    } finally {
      // The stop: the loop's signal, then the process closes the node client, which fails the pending call.
      run.controller().abort();
      run.answers.stuck.reject(closed());
    }
    const outcome = await within(run.outcome);
    expect(outcome).not.toBe("late");
    expect((outcome as CaseOutcome).failures).toEqual([]);
    expect((outcome as CaseOutcome).cursor).toBe(6n);
  }, 120_000);

  it("is waited for with no transaction open; a pause asked meanwhile is reached after the chunk's first block once the answer came", async () => {
    const pauses = new LoopPauses();
    const run = start(backend, { blocks: 5, pause: pauses });
    let hold: PauseHold | undefined;
    try {
      expect(await within(run.answers.awaited.promise)).not.toBe("late");
      await sleep(200);
      expect(run.loop().blockTransaction()).toBeNull();
      // Asked while the loop waits for the answer: it is inside a height, so the hold is not reached yet.
      hold = pauses.hold();
      let reachedAt: bigint | null | undefined;
      const reached = hold.reached.then(async () => {
        reachedAt = await cursorOf(run.db());
      });
      await sleep(200);
      expect(reachedAt).toBeUndefined();
      expect(run.loop().blockTransaction()).toBeNull();
      run.answers.stuck.resolve(`answer ${STUCK}`);
      expect(await within(reached)).not.toBe("late");
      expect(reachedAt).toBe(6n);
    } finally {
      run.answers.stuck.resolve(`answer ${STUCK}`);
      hold?.release();
    }
    const outcome = await run.outcome;
    expect(outcome.failures).toEqual([]);
    expect(outcome.cursor).toBe(HEAD);
  }, 120_000);

  it("is not asked for once the loop's stop came: a stop during the takes stores the chunk's first block with nothing asked ahead", async () => {
    const run = start(backend, {
      blocks: 5,
      // The stop comes while block 8 is taken: 6 to 8 are taken, and the chunk would be 6..8.
      async at(point, height) {
        if (point === "on-fetch" && height === 8n) run.controller().abort();
      },
    });
    run.answers.stuck.resolve(`answer ${STUCK}`);
    const outcome = await run.outcome;
    expect(outcome.failures).toEqual([]);
    expect(outcome.cursor).toBe(6n);
    expect(run.order.filter((mark) => mark.startsWith("answered@"))).toEqual(["answered@2", "answered@3", "answered@4", "answered@5"]);
  }, 120_000);

  it("reaches the block's on-compute when it is a failure: the blocks below it are committed and the loop halts there, as with the mode off", async () => {
    const failing = async (blocks: number | undefined): Promise<CaseOutcome> => {
      const run = start(backend, blocks === undefined ? {} : { blocks });
      run.answers.stuck.reject(new Error(`the node has no answer about block ${STUCK}`));
      return run.outcome;
    };
    const off = await failing(undefined);
    const on = await failing(5);
    const expected = [{ height: STUCK, point: "on-compute", module: "led", committed: false }];
    expect(off.failures.map(where)).toEqual(expected);
    expect(on.failures.map(where)).toEqual(expected);
    expect(off.cursor).toBe(STUCK - 1n);
    expect(on.cursor).toBe(STUCK - 1n);
    expect(on.facts).toEqual([...[1n, 2n, 3n, 4n, 5n, 6n, 7n].map((h) => `told committed ${h}`), `told rolledBack ${STUCK}`]);
  }, 120_000);
});
