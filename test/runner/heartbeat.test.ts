import { Worker } from "node:worker_threads";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Heartbeat, HEARTBEAT_INTERVAL_MS, lastTick, tickAgeMs } from "../../src/runner/heartbeat.js";

/**
 * The runner's heartbeat. The main thread ticks every second, writing the tick's time (`process.hrtime.bigint()`, a
 * monotonic clock every thread of the process shares) into one 64-bit slot of a `SharedArrayBuffer` with one atomic
 * store. The admin worker reads it with one atomic load (no torn read), so it can tell how long ago the main thread
 * last ran its event loop without asking it. A callback that awaits leaves the ticks running; one that blocks the main
 * thread stops them. [AE-2, A62, A63; CORE-ARCH §4.18]
 */

afterEach(() => {
  vi.useRealTimers();
});

describe("the heartbeat (AE-2)", () => {
  it("ticks at once, then every second, telling its listener each time; stops when stopped", () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    let ticks = 0;
    const before = process.hrtime.bigint();
    const heartbeat = new Heartbeat(() => {
      ticks += 1;
    });
    expect(ticks).toBe(1);
    expect(lastTick(heartbeat.buffer)).toBeGreaterThanOrEqual(before);
    expect(lastTick(heartbeat.buffer)).toBeLessThanOrEqual(process.hrtime.bigint());
    expect(HEARTBEAT_INTERVAL_MS).toBe(1_000);
    vi.advanceTimersByTime(999);
    expect(ticks).toBe(1);
    const first = lastTick(heartbeat.buffer);
    vi.advanceTimersByTime(1);
    expect(ticks).toBe(2);
    expect(lastTick(heartbeat.buffer)).toBeGreaterThan(first);
    vi.advanceTimersByTime(3_000);
    expect(ticks).toBe(5);
    heartbeat.stop();
    vi.advanceTimersByTime(5_000);
    expect(ticks).toBe(5);
  });

  it("a listener that throws stops no tick", () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    let calls = 0;
    const heartbeat = new Heartbeat(() => {
      calls += 1;
      throw new Error("a listener failed");
    });
    const first = lastTick(heartbeat.buffer);
    vi.advanceTimersByTime(2_000);
    expect(calls).toBe(3);
    expect(lastTick(heartbeat.buffer)).toBeGreaterThan(first);
    heartbeat.stop();
  });

  it("its buffer is one 64-bit slot of shared memory; tickAgeMs is the time since the tick, in milliseconds", () => {
    const heartbeat = new Heartbeat();
    heartbeat.stop();
    expect(heartbeat.buffer).toBeInstanceOf(SharedArrayBuffer);
    expect(heartbeat.buffer.byteLength).toBe(8);
    const tick = lastTick(heartbeat.buffer);
    expect(tickAgeMs(heartbeat.buffer, tick + 2_500_000n)).toBe(2.5);
    expect(tickAgeMs(heartbeat.buffer, tick)).toBe(0);
    expect(tickAgeMs(heartbeat.buffer)).toBeGreaterThanOrEqual(0);
    expect(tickAgeMs(heartbeat.buffer)).toBeLessThan(60_000);
  });

  it("another thread reads the very tick the main thread wrote, on the same clock", async () => {
    const heartbeat = new Heartbeat();
    heartbeat.stop();
    const worker = new Worker(
      `const { parentPort, workerData } = require("node:worker_threads");
       const tick = Atomics.load(new BigInt64Array(workerData), 0);
       parentPort.postMessage({ tick, now: process.hrtime.bigint() });`,
      { eval: true, workerData: heartbeat.buffer },
    );
    const seen = await new Promise<{ tick: bigint; now: bigint }>((resolve, reject) => {
      worker.once("message", resolve);
      worker.once("error", reject);
    });
    await worker.terminate();
    expect(seen.tick).toBe(lastTick(heartbeat.buffer));
    expect(seen.now).toBeGreaterThanOrEqual(seen.tick);
    expect(seen.now).toBeLessThanOrEqual(process.hrtime.bigint());
  });
});
