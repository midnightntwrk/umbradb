import { describe, expect, it } from "vitest";
import type { ItemSink, PointName, Revision } from "../../src/modules/declaration.js";
import { BlockItems, revisionAt } from "../../src/runner/block-context.js";
import { declaration } from "../modules/declarations.js";
import { blockItem } from "../modules/graph-fixtures.js";

/**
 * The block items of one height and the revision a block context's settings come from (task 5.2; RN-5, RN-7): a
 * callback's puts are buffered and published when it completes — dropped when it fails —, so a callback sees only the
 * items of callbacks that completed before it started; only the module that declares an item with the `block`
 * lifetime may put it, once per block; a put refused inside a callback fails the callback even when the module catches
 * the refusal, and one from a sink kept past its callback is reported. The loop's own tests are `loop.test.ts`.
 */

const P = declaration("p", { provides: [blockItem("x"), blockItem("y"), { name: "t", lifetimes: ["table"] }] });
const Q = declaration("q", { provides: [blockItem("z")] });

/** What `collect` settles with: "resolved", or the error. */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

/** The late uses reported to the items, with the module and point. */
function reporting(): { readonly items: BlockItems; readonly late: [string, string, PointName][] } {
  const late: [string, string, PointName][] = [];
  return { items: new BlockItems(7n, (error, module, point) => late.push([error.message, module, point])), late };
}

describe("BlockItems: one height's block items (RN-5)", () => {
  it("publishes a callback's puts when it completes, in put order, and none before", async () => {
    const items = new BlockItems(7n);
    let during: ReadonlyMap<string, unknown> | undefined;
    await items.collect(P, "on-parse", async (sink) => {
      sink.put("y", 2);
      sink.put("x", 1);
      during = items.visible();
      await Promise.resolve();
    });
    expect(during?.size).toBe(0);
    expect([...items.visible()]).toEqual([
      ["y", 2],
      ["x", 1],
    ]);
    expect(items.height).toBe(7n);
  });

  it("visible() is a copy: changing it changes nothing published", async () => {
    const items = new BlockItems(1n);
    await items.collect(P, "on-fetch", async (sink) => sink.put("x", 1));
    const seen = items.visible() as Map<string, unknown>;
    seen.set("x", 99);
    seen.delete("x");
    expect(items.visible().get("x")).toBe(1);
  });

  it("drops the puts of a callback that fails, and passes its error on unchanged", async () => {
    const items = new BlockItems(1n);
    const error = new Error("broke");
    const failed = await outcome(
      items.collect(P, "on-parse", async (sink) => {
        sink.put("x", 1);
        throw error;
      }),
    );
    expect(failed).toBe(error);
    expect(items.visible().size).toBe(0);
  });

  it("keeps each callback's puts apart: a sibling running at the same time sees none until it completes", async () => {
    const items = new BlockItems(1n);
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const first = items.collect(P, "on-parse", async (sink) => {
      sink.put("x", 1);
      await gate;
    });
    let seenBySibling: boolean | undefined;
    await items.collect(Q, "on-parse", async (sink) => {
      sink.put("z", 3);
      seenBySibling = items.visible().has("x");
    });
    expect(seenBySibling).toBe(false);
    expect([...items.visible().keys()]).toEqual(["z"]);
    release();
    await first;
    expect([...items.visible().keys()]).toEqual(["z", "x"]);
  });

  it("refuses an item the module does not provide, or provides without the block lifetime", async () => {
    const items = new BlockItems(3n);
    const undeclared = await outcome(items.collect(Q, "on-fetch", async (sink) => sink.put("x", 1)));
    expect(String(undeclared)).toBe(
      "Error: q put the item x, which it does not declare with the block lifetime, at height 3: a module puts only " +
        "the block items it declares (RN-5)",
    );
    const tableOnly = await outcome(items.collect(P, "on-fetch", async (sink) => sink.put("t", 1)));
    expect(String(tableOnly)).toMatch(/^Error: p put the item t, which it does not declare with the block lifetime/);
    expect(items.visible().size).toBe(0);
  });

  it("refuses a second put of one item in one block: in one callback, or after an earlier callback published it", async () => {
    const items = new BlockItems(4n);
    const twice = await outcome(
      items.collect(P, "on-fetch", async (sink) => {
        sink.put("x", 1);
        sink.put("x", 2);
      }),
    );
    expect(String(twice)).toBe("Error: p put the item x twice at height 4: an item is put at most once per block (RN-5)");
    expect(items.visible().size).toBe(0);
    await items.collect(P, "on-fetch", async (sink) => sink.put("x", 1));
    const again = await outcome(items.collect(P, "on-parse", async (sink) => sink.put("x", 2)));
    expect(String(again)).toBe("Error: p put the item x twice at height 4: an item is put at most once per block (RN-5)");
    expect(items.visible().get("x")).toBe(1);
  });

  it("throws the refusal at the put, and fails the callback with it even when the module catches it", async () => {
    const items = new BlockItems(1n);
    let thrown: unknown;
    const caught = await outcome(
      items.collect(P, "on-compute", async (sink) => {
        sink.put("x", 1);
        try {
          sink.put("x", 2);
        } catch (error) {
          thrown = error;
        }
        sink.put("y", 2);
      }),
    );
    expect(thrown).toBeInstanceOf(Error);
    expect(caught).toBe(thrown);
    expect(items.visible().size).toBe(0);
  });

  it("fails the callback with its first refusal, not a later one", async () => {
    const items = new BlockItems(1n);
    const failed = await outcome(
      items.collect(P, "on-compute", async (sink) => {
        for (const item of ["not-mine", "t"]) {
          try {
            sink.put(item, 1);
          } catch {
            // The module goes on.
          }
        }
      }),
    );
    expect(String(failed)).toMatch(/put the item not-mine/);
  });

  it("refuses a put from a sink kept past its callback, and reports it with the module and the point", async () => {
    const { items, late } = reporting();
    let kept: ItemSink | undefined;
    await items.collect(P, "on-parse", async (sink) => {
      kept = sink;
    });
    expect(() => kept?.put("x", 1)).toThrow(
      "p put the item x after its on-parse callback at height 7 ended: a sink is valid only while its callback runs (RN-5)",
    );
    expect(late).toEqual([
      [
        "p put the item x after its on-parse callback at height 7 ended: a sink is valid only while its callback runs (RN-5)",
        "p",
        "on-parse",
      ],
    ]);
    expect(items.visible().size).toBe(0);
  });

  it("reports nothing for a refusal inside a callback, which fails the callback instead", async () => {
    const { items, late } = reporting();
    await outcome(items.collect(Q, "on-fetch", async (sink) => sink.put("x", 1)));
    expect(late).toEqual([]);
  });

  it("refuses a late put when the callback failed too, and publishes nothing", async () => {
    const { items, late } = reporting();
    let kept: ItemSink | undefined;
    await outcome(
      items.collect(P, "on-parse", async (sink) => {
        kept = sink;
        throw new Error("broke");
      }),
    );
    expect(() => kept?.put("x", 1)).toThrow(/after its on-parse callback at height 7 ended/);
    expect(late).toHaveLength(1);
    expect(items.visible().size).toBe(0);
  });

  it("gives each callback a frozen sink whose only property is put", async () => {
    const items = new BlockItems(1n);
    let sink: ItemSink | undefined;
    await items.collect(P, "on-fetch", async (s) => {
      sink = s;
    });
    expect(Object.keys(sink as object)).toEqual(["put"]);
    expect(Object.isFrozen(sink)).toBe(true);
  });

  it("works without a late-use report", async () => {
    const items = new BlockItems(1n);
    let kept: ItemSink | undefined;
    await items.collect(P, "on-fetch", async (s) => {
      kept = s;
    });
    expect(() => kept?.put("x", 1)).toThrow(/after its on-fetch callback/);
  });
});

describe("revisionAt: the calling module's revision covering a height (RN-7)", () => {
  const revision = (start: number, stop: number | null, k: number): Revision => ({
    start: BigInt(start),
    stop: stop === null ? null : BigInt(stop),
    version: "1.0.0",
    settings: { k },
  });

  it("is the last revision starting at or before h whose stop, if any, is at or after h", () => {
    // Revisions without a stop continue to the next one's start (CF-5): at 5 the second takes over.
    const revisions = [revision(1, null, 1), revision(5, 9, 2), revision(12, null, 3)];
    const at = (h: number) => revisionAt(revisions, BigInt(h))?.settings.k;
    expect([0, 1, 4, 5, 9, 12, 100].map(at)).toEqual([undefined, 1, 1, 2, 2, 3, 3]);
    // With effective stops (task 4.3's), a height in a gap has none: the module does not run there (RN-7).
    const effective = [revision(1, 4, 1), revision(5, 9, 2), revision(12, null, 3)];
    expect([4, 5, 10, 11, 12].map((h) => revisionAt(effective, BigInt(h))?.settings.k)).toEqual([1, 2, undefined, undefined, 3]);
  });

  it("is none for no revisions, before the first start, and after an explicit stop", () => {
    expect(revisionAt([], 1n)).toBeUndefined();
    expect(revisionAt([revision(3, 4, 1)], 2n)).toBeUndefined();
    expect(revisionAt([revision(3, 4, 1)], 5n)).toBeUndefined();
    expect(revisionAt([revision(3, 4, 1)], 4n)?.settings.k).toBe(1);
    expect(revisionAt([revision(3, 3, 1)], 3n)?.settings.k).toBe(1);
  });

  it("returns the revision object itself", () => {
    const only = revision(1, null, 1);
    expect(revisionAt([only], 8n)).toBe(only);
  });
});
