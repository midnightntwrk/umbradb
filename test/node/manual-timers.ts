import type { NodeTimers } from "../../src/node/index.js";

/**
 * A clock the tests move by hand, given to the node client and its WebSocket transport as their timers
 * (`NodeClientOptions.timers`): nothing scheduled on it runs until {@link ManualTimers.advance} reaches it, so the
 * back-off delays, the call timeouts, the connect timeout and the heartbeat are checked to the millisecond, while the
 * sockets underneath run in real time (no global fake timers: `ws` and the test's own servers keep Node.js's timers).
 */
export class ManualTimers implements NodeTimers {
  #now = 0;
  #sequence = 0;
  readonly #scheduled = new Map<number, { readonly at: number; readonly run: () => void }>();

  /** Milliseconds since the clock started. */
  get now(): number {
    return this.#now;
  }

  readonly setTimeout = (run: () => void, ms: number): number => {
    const id = ++this.#sequence;
    this.#scheduled.set(id, { at: this.#now + Math.max(0, ms), run });
    return id;
  };

  readonly clearTimeout = (handle: unknown): void => {
    this.#scheduled.delete(handle as number);
  };

  /** The delays, from now, of the timers still scheduled, shortest first. */
  pending(): number[] {
    return [...this.#scheduled.values()].map((timer) => timer.at - this.#now).sort((a, b) => a - b);
  }

  /**
   * Moves the clock `ms` forward, running each timer that falls due on the way at its own time, in order (ties in the
   * order they were set), and letting the event loop turn after each — promise reactions, and socket events that are
   * already waiting — before the next.
   */
  async advance(ms: number): Promise<void> {
    const target = this.#now + ms;
    for (;;) {
      let next: [number, { readonly at: number; readonly run: () => void }] | undefined;
      for (const entry of this.#scheduled) {
        if (entry[1].at <= target && (next === undefined || entry[1].at < next[1].at)) next = entry;
      }
      if (next === undefined) break;
      this.#scheduled.delete(next[0]);
      this.#now = next[1].at;
      next[1].run();
      await turns();
    }
    this.#now = target;
    await turns();
  }
}

/** Lets the event loop turn a few times: promise reactions run, and socket events already received are delivered. */
export async function turns(count = 5): Promise<void> {
  for (let index = 0; index < count; index++) await new Promise<void>((resolve) => setImmediate(resolve));
}

/** Waits, in real time, until `condition` holds; fails naming `what` after `ms` milliseconds. */
export async function until(condition: () => boolean, what: string, ms = 10_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!condition()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`);
    await new Promise<void>((resolve) => setTimeout(resolve, 2));
  }
}
