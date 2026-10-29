/**
 * The runner's heartbeat. The main thread ticks every second, independently of the work: a callback that awaits I/O
 * leaves the ticks running, while one that blocks the main thread with computation stops them. `GET /health/live`
 * answers 200 while the last tick is within the liveness timeout (`livenessTimeoutMs`), and 503 otherwise.
 * [AE-2, CF-4; design §1; CORE-ARCH §4.18]
 *
 * **Where the tick goes:** one 64-bit slot of a `SharedArrayBuffer` ({@link Heartbeat.buffer}), the tick's time as
 * `process.hrtime.bigint()` in nanoseconds — a monotonic clock that every thread of the process reads alike, so a wall
 * clock that jumps changes nothing —, written with one `Atomics.store` and read with one `Atomics.load` (no torn read).
 * The admin worker (`../admin/`) reads it at each request, so it tells a stuck main thread from a busy one without
 * asking the main thread anything.
 *
 * The heartbeat's timer keeps Node.js running (a process whose loop waits on an in-memory source, or that stays up
 * refused or halted, has nothing else that would), until {@link Heartbeat.stop}.
 */

/** How often the main thread ticks: every second. [AE-2] */
export const HEARTBEAT_INTERVAL_MS = 1_000;

/** The bytes of a heartbeat buffer: one 64-bit slot. */
const BYTES = 8;

/** The time of `buffer`'s last tick: nanoseconds of `process.hrtime.bigint()`, one atomic read. */
export function lastTick(buffer: SharedArrayBuffer): bigint {
  return Atomics.load(new BigInt64Array(buffer), 0);
}

/** Milliseconds from `buffer`'s last tick to `now` (`process.hrtime.bigint()` unless given). */
export function tickAgeMs(buffer: SharedArrayBuffer, now: bigint = process.hrtime.bigint()): number {
  return Number(now - lastTick(buffer)) / 1e6;
}

/** The heartbeat (see the module comment): it ticks once at once, then every {@link HEARTBEAT_INTERVAL_MS}. */
export class Heartbeat {
  /** The shared memory the ticks are written to. */
  readonly buffer: SharedArrayBuffer = new SharedArrayBuffer(BYTES);
  readonly #slot = new BigInt64Array(this.buffer);
  readonly #onTick: () => void;
  readonly #timer: NodeJS.Timeout;

  /** Starts ticking; `onTick` is told after each tick (a listener that throws stops no tick). */
  constructor(onTick: () => void = () => undefined) {
    this.#onTick = onTick;
    this.tick();
    this.#timer = setInterval(() => this.tick(), HEARTBEAT_INTERVAL_MS);
  }

  /** Writes the time now as the last tick, then tells the listener. */
  tick(): void {
    Atomics.store(this.#slot, 0, process.hrtime.bigint());
    try {
      this.#onTick();
    } catch {
      // A listener's failure is its own: the heartbeat goes on.
    }
  }

  /** Stops ticking: the buffer keeps the last tick. */
  stop(): void {
    clearInterval(this.#timer);
  }
}
