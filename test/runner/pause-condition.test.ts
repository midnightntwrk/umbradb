import { describe, expect, it } from "vitest";
import { LoopPauses, type LoopPaused } from "../../src/runner/pause.js";

/**
 * What the pause tells `/status` (`src/runner/pause.ts`). While the loop is paused (a hold kept and the loop between
 * heights), {@link LoopPauses.pausedAt} gives the time it paused and who holds it (`pause` for `ProcessHandle.pause()`,
 * `signal` for a backup on SIGUSR2), else null. [AE-3, Q174 B]
 * - The time is the moment the loop paused, kept while any hold is kept, including the loop's step from its wait for
 *   the head to the pause between heights.
 * - `pause` is shown while a `pause` hold is kept, since only `resume()` lifts it.
 * - Each change of what it gives is told once (`onChange`, which publishes to the admin endpoints), and nothing else
 *   is.
 */

/** A clock the test moves. */
function clock(start = 1_000): { now: () => number; at(ms: number): void } {
  let ms = start;
  return { now: () => ms, at: (next) => (ms = next) };
}

/** A few turns of the event loop, for a promise that would settle to settle. */
async function turns(count = 5): Promise<void> {
  for (let turn = 0; turn < count; turn++) await new Promise((resolve) => setImmediate(resolve));
}

/** A `LoopPauses` on `time`, counting what it tells and recording `pausedAt` at each. */
function watched(time = clock()): { pauses: LoopPauses; told: (LoopPaused | null)[]; time: typeof time } {
  const told: (LoopPaused | null)[] = [];
  const pauses: LoopPauses = new LoopPauses({ now: time.now, onChange: () => told.push(pauses.pausedAt) });
  return { pauses, told, time };
}

describe("LoopPauses.pausedAt: the paused condition's facts (AE-3, Q174 B)", () => {
  it("is null while no hold is kept, the loop between heights or waiting for the head", async () => {
    const { pauses, told } = watched();
    expect(pauses.pausedAt).toBeNull();
    await pauses.between(new AbortController().signal);
    await pauses.idle(async () => expect(pauses.pausedAt).toBeNull());
    expect(told).toEqual([]);
  });

  it("is null while a hold waits for the loop to reach a pause, then the time it paused, by pause, until released", async () => {
    const { pauses, told, time } = watched();
    const hold = pauses.hold("pause");
    time.at(2_000);
    expect(pauses.pausedAt).toBeNull();
    expect(told).toEqual([]);
    time.at(3_000);
    const between = pauses.between(new AbortController().signal);
    await hold.reached;
    expect(pauses.pausedAt).toEqual({ since: 3_000, by: "pause" });
    time.at(9_000);
    expect(pauses.pausedAt).toEqual({ since: 3_000, by: "pause" });
    hold.release();
    await between;
    expect(pauses.pausedAt).toBeNull();
    expect(told).toEqual([{ since: 3_000, by: "pause" }, null]);
  });

  it("pauses at once while the loop waits for the head, and keeps its time when the wait ends at the pause", async () => {
    const { pauses, told, time } = watched();
    let wake!: () => void;
    const waiting = pauses.idle(() => new Promise<void>((resolve) => (wake = resolve)));
    time.at(4_000);
    const hold = pauses.hold("signal");
    expect(pauses.pausedAt).toEqual({ since: 4_000, by: "signal" });
    time.at(5_000);
    wake();
    await waiting;
    const between = pauses.between(new AbortController().signal);
    await turns();
    expect(pauses.pausedAt).toEqual({ since: 4_000, by: "signal" });
    // The step from the wait to the pause told nothing: the condition never left.
    expect(told).toEqual([{ since: 4_000, by: "signal" }]);
    hold.release();
    await between;
    expect(told).toEqual([{ since: 4_000, by: "signal" }, null]);
  });

  it("shows pause while a pause hold is kept, signal while only a backup's is, and keeps the time the loop paused", async () => {
    const { pauses, told, time } = watched();
    time.at(1_500);
    const signal = pauses.hold("signal");
    const between = pauses.between(new AbortController().signal);
    await signal.reached;
    expect(pauses.pausedAt).toEqual({ since: 1_500, by: "signal" });
    time.at(2_500);
    const pause = pauses.hold("pause");
    expect(pauses.pausedAt).toEqual({ since: 1_500, by: "pause" });
    time.at(3_500);
    pause.release();
    expect(pauses.pausedAt).toEqual({ since: 1_500, by: "signal" });
    const again = pauses.hold("pause");
    signal.release();
    expect(pauses.pausedAt).toEqual({ since: 1_500, by: "pause" });
    again.release();
    await between;
    expect(pauses.pausedAt).toBeNull();
    expect(told).toEqual([
      { since: 1_500, by: "signal" },
      { since: 1_500, by: "pause" },
      { since: 1_500, by: "signal" },
      { since: 1_500, by: "pause" },
      null,
    ]);
  });

  it("gives a new time to the next pause, and takes pause as a hold's default", async () => {
    const { pauses, time } = watched();
    time.at(10_000);
    const first = pauses.hold();
    const between = pauses.between(new AbortController().signal);
    await first.reached;
    expect(pauses.pausedAt).toEqual({ since: 10_000, by: "pause" });
    first.release();
    await between;
    time.at(20_000);
    const second = pauses.hold();
    const next = pauses.between(new AbortController().signal);
    await second.reached;
    expect(pauses.pausedAt).toEqual({ since: 20_000, by: "pause" });
    second.release();
    await next;
  });

  it("is null once the loop's signal ends the pause, the hold still kept", async () => {
    const { pauses, told, time } = watched();
    time.at(6_000);
    const hold = pauses.hold("pause");
    const stop = new AbortController();
    const between = pauses.between(stop.signal);
    await hold.reached;
    expect(pauses.pausedAt).toEqual({ since: 6_000, by: "pause" });
    stop.abort();
    await between;
    expect(pauses.held).toBe(true);
    expect(pauses.pausedAt).toBeNull();
    expect(told).toEqual([{ since: 6_000, by: "pause" }, null]);
    hold.release();
    expect(told).toEqual([{ since: 6_000, by: "pause" }, null]);
  });

  it("tells nothing for a hold released before the loop reached it", async () => {
    const { pauses, told } = watched();
    const hold = pauses.hold("signal");
    hold.release();
    await hold.reached;
    await pauses.between(new AbortController().signal);
    expect(pauses.pausedAt).toBeNull();
    expect(told).toEqual([]);
  });

  it("reads the wall clock unless given one", async () => {
    const pauses = new LoopPauses();
    const before = Date.now();
    const hold = pauses.hold("pause");
    const between = pauses.between(new AbortController().signal);
    await hold.reached;
    const since = pauses.pausedAt?.since as number;
    expect(since).toBeGreaterThanOrEqual(before);
    expect(since).toBeLessThanOrEqual(Date.now());
    hold.release();
    await between;
  });
});
