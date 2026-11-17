import { describe, expect, it } from "vitest";
import { threadMemory } from "../../src/trace/memory.js";

/**
 * What the block trace says of memory (`src/trace/memory.ts`): a thread's memory outside its heap counts a WebAssembly
 * memory it holds, to the MiB, and its growth.
 */

describe("a thread's memory", () => {
  it("counts a WebAssembly memory it holds outside the heap, and its growth", () => {
    const before = threadMemory();
    expect(before).not.toBeNull();
    // 1,600 pages of 64 KiB: 100 MiB.
    const memory = new WebAssembly.Memory({ initial: 1_600 });
    const held = threadMemory();
    expect((held?.external as number) - (before?.external as number)).toBeGreaterThan(99);
    expect((held?.external as number) - (before?.external as number)).toBeLessThan(110);
    memory.grow(800);
    const grown = threadMemory();
    expect((grown?.external as number) - (held?.external as number)).toBeGreaterThan(49);
    expect(memory.buffer.byteLength).toBe(2_400 * 65_536);
    for (const value of [grown?.heap, grown?.rss]) expect(value).toBeGreaterThan(0);
    // To one decimal.
    expect(Number.isInteger((grown?.external as number) * 10)).toBe(true);
  });
});
