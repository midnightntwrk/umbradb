import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { BlockSource } from "../../src/runner/block-source.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { settlesWithin } from "../db/backends.js";

/**
 * The in-memory block source: the block-source interface over blocks held in memory, for tests and module authors.
 * [RN-14; design §3]
 *
 * - A finalized head that only rises.
 * - The finalized block at each height up to it (given, or a default chain whose hashes link).
 * - A wait for the head to pass a height, which a signal ends.
 * - The cursor, read from the cursor table through the read it is given (`core-block-commit`,
 *   `src/backbone/core-block-commit/`).
 */

const sha256 = (text: string): Uint8Array => new Uint8Array(createHash("sha256").update(text, "utf8").digest());

/** What `promise` settles with: "resolved", or the error. */
function outcome(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

describe("inMemoryBlock: the default chain", () => {
  it("hashes each height, and links each block to the one before; block 0's parent is 32 zero bytes", () => {
    expect(inMemoryBlock(5n)).toEqual({
      height: 5n,
      hash: sha256("umbradb in-memory block 5"),
      parentHash: sha256("umbradb in-memory block 4"),
    });
    expect(inMemoryBlock(1n).parentHash).toEqual(inMemoryBlock(0n).hash);
    expect(inMemoryBlock(0n).parentHash).toEqual(new Uint8Array(32));
    expect(inMemoryBlock(7n).hash).toHaveLength(32);
    expect(Object.isFrozen(inMemoryBlock(3n))).toBe(true);
  });

  it("refuses a negative height", () => {
    expect(() => inMemoryBlock(-1n)).toThrow("an in-memory block's height is at least 0, not -1");
  });
});

describe("InMemoryBlockSource: the block source over blocks in memory (RN-14)", () => {
  it("is a BlockSource", () => {
    const source: BlockSource = new InMemoryBlockSource({ head: 0n });
    expect(typeof source.cursor).toBe("function");
  });

  it("reports its finalized head as the block there", async () => {
    const source = new InMemoryBlockSource({ head: 4n });
    expect(source.head).toBe(4n);
    expect(await source.finalizedHead()).toEqual(inMemoryBlock(4n));
  });

  it("gives the finalized block at every height up to the head, and refuses one above it or below 0", async () => {
    const source = new InMemoryBlockSource({ head: 3n });
    expect(await source.block(0n)).toEqual(inMemoryBlock(0n));
    expect(await source.block(3n)).toEqual(inMemoryBlock(3n));
    await expect(source.block(4n)).rejects.toThrow(
      "the in-memory source has no finalized block at 4: its finalized head is 3",
    );
    await expect(source.block(-1n)).rejects.toThrow("an in-memory block's height is at least 0, not -1");
  });

  it("gives the blocks it was given in place of the default ones", async () => {
    const custom = { height: 2n, hash: new Uint8Array(32).fill(9), parentHash: new Uint8Array(32).fill(8) };
    const source = new InMemoryBlockSource({ head: 3n, blocks: [custom] });
    expect(await source.block(2n)).toBe(custom);
    expect(await source.block(1n)).toEqual(inMemoryBlock(1n));
    const atHead = new InMemoryBlockSource({ head: 2n, blocks: [custom] });
    expect(await atHead.finalizedHead()).toBe(custom);
  });

  it("refuses a negative head", () => {
    expect(() => new InMemoryBlockSource({ head: -1n })).toThrow("the in-memory source's head is at least 0, not -1");
  });

  it("raises its head, never lowers it, and accepts the same head again", async () => {
    const source = new InMemoryBlockSource({ head: 2n });
    source.finalize(5n);
    expect(source.head).toBe(5n);
    source.finalize(5n);
    expect(source.head).toBe(5n);
    expect(() => source.finalize(4n)).toThrow(
      "the in-memory source's finalized head cannot go back from 5 to 4: a finalized block stays finalized",
    );
    expect(source.head).toBe(5n);
  });

  it("waitForHead resolves at once when the head is already above, and when it rises above later", async () => {
    const source = new InMemoryBlockSource({ head: 3n });
    const never = new AbortController().signal;
    await expect(source.waitForHead(2n, never)).resolves.toBeUndefined();
    const waiting = source.waitForHead(3n, never);
    expect(await settlesWithin(waiting, 50)).toBe(false);
    source.finalize(3n);
    expect(await settlesWithin(waiting, 50)).toBe(false);
    source.finalize(4n);
    await expect(waiting).resolves.toBeUndefined();
  });

  it("wakes each waiter only once the head passes its own height", async () => {
    const source = new InMemoryBlockSource({ head: 1n });
    const never = new AbortController().signal;
    const low = source.waitForHead(1n, never);
    const high = source.waitForHead(4n, never);
    source.finalize(3n);
    await expect(low).resolves.toBeUndefined();
    expect(await settlesWithin(high, 50)).toBe(false);
    source.finalize(5n);
    await expect(high).resolves.toBeUndefined();
  });

  it("waitForHead rejects with the signal's reason when it aborts, before or while waiting", async () => {
    const source = new InMemoryBlockSource({ head: 1n });
    const before = new AbortController();
    const reason = new Error("stop");
    before.abort(reason);
    expect(await outcome(source.waitForHead(5n, before.signal))).toBe(reason);
    const during = new AbortController();
    const waiting = source.waitForHead(5n, during.signal);
    const later = new Error("stop later");
    during.abort(later);
    expect(await outcome(waiting)).toBe(later);
    // An aborted wait is gone: raising the head later wakes nothing, and waiting() does not see it.
    source.finalize(9n);
    expect(await settlesWithin(source.waiting(5n), 50)).toBe(false);
  });

  it("an aborted signal wins over a head that is already above", async () => {
    const source = new InMemoryBlockSource({ head: 9n });
    const aborted = new AbortController();
    aborted.abort();
    expect(await outcome(source.waitForHead(1n, aborted.signal))).toBeInstanceOf(DOMException);
  });

  it("waiting(above) resolves once a wait for a head above `above` is pending, at once if one is", async () => {
    const source = new InMemoryBlockSource({ head: 1n });
    const signal = new AbortController().signal;
    const later = source.waiting(3n);
    const other = source.waiting(4n);
    expect(await settlesWithin(later, 50)).toBe(false);
    void source.waitForHead(2n, signal);
    expect(await settlesWithin(later, 50)).toBe(false);
    void source.waitForHead(3n, signal);
    await expect(later).resolves.toBeUndefined();
    expect(await settlesWithin(source.waiting(3n), 50)).toBe(true);
    expect(await settlesWithin(other, 50)).toBe(false);
    // A wait that resolved at once was never pending.
    void source.waitForHead(0n, signal);
    expect(await settlesWithin(source.waiting(0n), 50)).toBe(false);
    source.finalize(10n);
  });

  it("a woken wait is no longer pending", async () => {
    const source = new InMemoryBlockSource({ head: 1n });
    const waiting = source.waitForHead(1n, new AbortController().signal);
    await source.waiting(1n);
    source.finalize(2n);
    await waiting;
    expect(await settlesWithin(source.waiting(1n), 50)).toBe(false);
  });

  it("reads the cursor from the cursor table, through the read it is given", async () => {
    const source = new InMemoryBlockSource({ head: 1n });
    const asked: string[] = [];
    const none = await source.cursor({
      query: async (sql) => {
        asked.push(sql);
        return [{ present: false }];
      },
    });
    expect(none).toBeNull();
    expect(asked).toEqual(["SELECT to_regclass('core_block_commit.blocks') IS NOT NULL AS present"]);
    const hash = new Uint8Array(32).fill(1);
    const parentHash = new Uint8Array(32).fill(2);
    const cursor = await source.cursor({
      query: async (sql) => (sql.startsWith("SELECT to_regclass") ? [{ present: true }] : [{ height: 4n, hash, parent_hash: parentHash }]),
    });
    expect(cursor).toEqual({ height: 4n, hash, parentHash });
  });
});
