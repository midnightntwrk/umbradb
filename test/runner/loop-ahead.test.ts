import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { BlockItems } from "../../src/runner/block-context.js";
import type { BlockSource, PreparedBlock } from "../../src/runner/block-source.js";
import { FinalizedLoop, type LoopInput } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { cursorOf, InMemoryBlockSource, loopInput, RUNNER_BACKENDS, type Started, startWith } from "./loop-harness.js";

/**
 * `FinalizedLoop.ahead` (`src/runner/loop.ts`): the block context a part will get at a height above the one in
 * progress, when the source has that height prepared. On both backends, over the in-memory source with a hand-made
 * `ahead`:
 * - during a height's points before its commit (its `on-compute`, its `on-db-write` and its `on-settle`) it gives the
 *   context of a height above it: its height, hashes and the `block` items the source prepared, `continues` false (the
 *   loop decides it when the height's own callbacks run);
 * - it gives none for the height in progress, for a part the range does not hold, when the source has nothing
 *   prepared, past the loop's last height, in another range of the graph, and outside a height's processing;
 * - asking changes nothing: every height commits as without it.
 */

/** The in-memory source with `ahead` answering from `prepared`; the loop still fetches and parses each height itself. */
function withAhead(memory: InMemoryBlockSource, prepared: ReadonlyMap<bigint, PreparedBlock>): BlockSource {
  return {
    cursor: (read) => memory.cursor(read),
    finalizedHead: () => memory.finalizedHead(),
    latestHead: () => memory.latestHead(),
    waitForHead: (above, signal) => memory.waitForHead(above, signal),
    block: (height) => memory.block(height),
    ahead: (height) => prepared.get(height) ?? null,
  } as BlockSource;
}

/** The block the in-memory source gives at `height`, prepared with one `block` item, `marker`. */
async function preparedAt(memory: InMemoryBlockSource, height: bigint, part: ModuleDeclaration): Promise<PreparedBlock> {
  const items = new BlockItems(height, () => undefined);
  await items.collect(part, "on-parse", async (sink) => sink.put("marker", `prepared ${height}`));
  return { block: await memory.block(height), items };
}

/** What a callback saw when it asked for the next height. */
interface Asked {
  readonly at: string;
  readonly next: BlockContext | null;
  readonly others: readonly (BlockContext | null)[];
  readonly further: BlockContext | null;
}

describe.each(RUNNER_BACKENDS)("the next height's block context, ahead, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs heights 1 to `head` with a module that asks the loop for the next height at each point; returns what it saw. */
  async function run(
    head: bigint,
    options: { readonly preparedHeights: readonly bigint[]; readonly input?: Partial<LoopInput>; readonly late?: bigint },
  ): Promise<{ asked: Asked[]; started: Started; loop: FinalizedLoop; memory: InMemoryBlockSource }> {
    const { db } = await backend.database();
    const asked: Asked[] = [];
    let loop!: FinalizedLoop;
    const ask = (point: string) => async (_p: unknown, b: { height: bigint }) => {
      asked.push({
        at: `${point}@${b.height}`,
        next: loop.ahead(b.height + 1n, "asker"),
        others: [loop.ahead(b.height, "asker"), loop.ahead(b.height - 1n, "asker"), loop.ahead(b.height + 1n, "absent")],
        further: loop.ahead(b.height + 2n, "asker"),
      });
    };
    const asker = declaration("asker", {
      provides: [{ name: "marker", lifetimes: ["block"] }],
      points: {
        "on-compute": ask("on-compute"),
        "on-db-write": ask("on-db-write"),
        "on-settle": async (_p: unknown, run: { last: bigint }) => ask("on-settle")(_p, { height: run.last }),
        "on-after-db-write": ask("on-after-db-write"),
      } as ModuleDeclaration["points"],
    });
    const user = options.late === undefined ? [asker] : [asker, declaration("late", { points: {} })];
    const entries = options.late === undefined ? [entry("asker", 1)] : [entry("asker", 1), entry("late", Number(options.late))];
    const started = await startWith(db, user, entries);
    const memory = new InMemoryBlockSource({ head });
    const prepared = new Map<bigint, PreparedBlock>();
    for (const height of options.preparedHeights) prepared.set(height, await preparedAt(memory, height, asker));
    const controller = new AbortController();
    loop = new FinalizedLoop({ ...loopInput(started, memory, controller), source: withAhead(memory, prepared), ...options.input });
    const running = loop.run();
    await Promise.race([memory.waiting(head), running]);
    controller.abort();
    await running;
    return { asked, started, loop, memory };
  }

  it("gives the next height's context during a height's points before its commit, with the items the source prepared", async () => {
    const { asked, started, loop, memory } = await run(4n, { preparedHeights: [2n, 3n, 4n] });
    const by = new Map(asked.map((entry) => [entry.at, entry]));
    for (const height of [1n, 2n]) {
      for (const point of ["on-compute", "on-db-write", "on-settle"]) {
        const { next, others } = by.get(`${point}@${height}`) as Asked;
        const block = await memory.block(height + 1n);
        expect(next, `${point}@${height}`).not.toBeNull();
        expect(next?.height).toBe(height + 1n);
        expect(next?.hash).toEqual(block.hash);
        expect(next?.parentHash).toEqual(block.parentHash);
        expect(next?.items.get("marker")).toBe(`prepared ${height + 1n}`);
        expect(next?.active("asker")).toBe(true);
        expect(next?.continues).toBe(false);
        // Never the height in progress, one below it, or a part the range does not hold.
        expect(others).toEqual([null, null, null]);
        // Two heights above, when prepared, as well.
        expect(by.get(`${point}@${height}`)?.further?.height).toBe(height + 2n);
        expect(by.get(`${point}@${height}`)?.further?.items.get("marker")).toBe(`prepared ${height + 2n}`);
      }
      // After the commit the height is no longer in progress.
      expect(by.get(`on-after-db-write@${height}`)?.next).toBeNull();
    }
    // At 3, height 4 is given and nothing is prepared above it; at 4, the last height, nothing is.
    expect(by.get("on-compute@3")?.next?.height).toBe(4n);
    expect(by.get("on-compute@3")?.further).toBeNull();
    expect(by.get("on-compute@4")?.next).toBeNull();
    // Asking changed nothing: every height committed.
    expect(await cursorOf(started.db)).toBe(4n);
    // Outside a height's processing: none.
    expect(loop.ahead(4n, "asker")).toBeNull();
  }, 60_000);

  it("gives none when the source has nothing prepared, past the loop's last height, and across a range of the graph", async () => {
    // Nothing prepared at 3.
    const sparse = await run(3n, { preparedHeights: [2n] });
    const first = new Map(sparse.asked.map((entry) => [entry.at, entry.next]));
    expect(first.get("on-compute@1")?.height).toBe(2n);
    expect(first.get("on-compute@2")).toBeNull();
    // The core's stop at 2: height 3 is prepared, and never given.
    const stopped = await run(3n, { preparedHeights: [2n, 3n], input: { coreStop: 2n } });
    const second = new Map(stopped.asked.map((entry) => [entry.at, entry.next]));
    expect(second.get("on-compute@1")?.height).toBe(2n);
    expect(second.get("on-compute@2")).toBeNull();
    expect(await cursorOf(stopped.started.db)).toBe(2n);
    // A module that starts at 3 makes 3 another range than 2.
    const ranged = await run(4n, { preparedHeights: [2n, 3n, 4n], late: 3n });
    const third = new Map(ranged.asked.map((entry) => [entry.at, entry.next]));
    expect(third.get("on-compute@1")?.height).toBe(2n);
    expect(third.get("on-compute@2")).toBeNull();
    expect(third.get("on-compute@3")?.height).toBe(4n);
    expect(await cursorOf(ranged.started.db)).toBe(4n);
  }, 120_000);
});
