import { afterEach, describe, expect, it, vi } from "vitest";
import { threadMemory } from "../../src/trace/memory.js";
import { startTrace, stopTrace, traceEndBlock } from "../../src/trace/trace.js";
import { endApply, startWorkerTrace, stopWorkerTrace, type WorkerTraceEntry } from "../../src/trace/worker-trace.js";

/**
 * What the block trace says of memory (`src/trace/memory.ts`): a thread's memory outside its heap counts a WebAssembly
 * memory it holds, to the MiB, and its growth; where the runtime gives no report, the trace's lines carry none.
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

describe("a thread's memory where the runtime gives no report", () => {
  afterEach(() => {
    stopTrace();
    stopWorkerTrace();
    vi.restoreAllMocks();
  });

  /** The keys of one height's line and of one worker's line, each trace started and stopped around them. */
  function traced(): { readonly height: string[]; readonly worker: string[] } {
    const blocks: string[] = [];
    startTrace({ blocks: (text) => void blocks.push(text), statements: () => undefined, worker: () => undefined });
    traceEndBlock(1n);
    stopTrace();
    const entries: WorkerTraceEntry[] = [];
    startWorkerTrace((entry) => entries.push(entry));
    endApply(1n, 0);
    stopWorkerTrace();
    const [line] = blocks.join("").trimEnd().split("\n");
    return { height: Object.keys(JSON.parse(line as string) as object).sort(), worker: Object.keys(entries[0] as object).sort() };
  }

  it("is none, and neither a height's line nor a worker's line carries memory", () => {
    // Negative control: where the runtime reports it, the same calls give it.
    expect(traced()).toEqual({ height: ["h", "mem", "t"], worker: ["ext", "h", "heap", "rss", "spanMs", "tx"] });
    // A runtime without `process.memoryUsage` (a browser): the read throws.
    vi.spyOn(process, "memoryUsage").mockImplementation(() => {
      throw new TypeError("process.memoryUsage is not a function");
    });
    expect(threadMemory()).toBeNull();
    expect(traced()).toEqual({ height: ["h", "t"], worker: ["h", "spanMs", "tx"] });
  });
});
