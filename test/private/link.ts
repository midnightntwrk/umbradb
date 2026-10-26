import type { PublicWakes } from "../../src/backbone/core-private-source/index.js";

/**
 * The tests' stand-in for the core's process transport (task 14.2), as far as a private process's block intake sees it
 * (PP-3, PP-4): a link that is connected or dropped, carrying the core's `committed` messages. While connected each
 * message wakes the private source's wait for the public cursor; while dropped every message is lost; and connecting
 * again wakes it, as PP-3's "after every reconnect" says. It is the private source's only wake-up in A114, so whatever
 * the private process does after a drop it does because of the reconnect, not a timer.
 */
export class TestLink implements PublicWakes {
  #connected = true;
  readonly #waiters = new Set<() => void>();
  readonly #watchers: (() => void)[] = [];
  /** The `committed` messages sent while the link was dropped. */
  lost = 0;

  next(signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      const done = (): void => {
        this.#waiters.delete(wake);
        signal.removeEventListener("abort", abort);
      };
      const wake = (): void => {
        done();
        resolve();
      };
      const abort = (): void => {
        done();
        reject(signal.reason);
      };
      this.#waiters.add(wake);
      signal.addEventListener("abort", abort, { once: true });
      for (const watcher of this.#watchers.splice(0)) watcher();
    });
  }

  /** Resolves once the private source waits for a wake-up (at once if it does). */
  waiting(): Promise<void> {
    if (this.#waiters.size > 0) return Promise.resolve();
    return new Promise<void>((resolve) => this.#watchers.push(resolve));
  }

  /** The core committed a height: a `committed` message, lost while the link is dropped. */
  committed(): void {
    if (this.#connected) this.#wake();
    else this.lost += 1;
  }

  /** The transport drops: messages are lost until {@link connect}. */
  drop(): void {
    this.#connected = false;
  }

  /** The transport connects again, which wakes the private source (PP-3). */
  connect(): void {
    this.#connected = true;
    this.#wake();
  }

  #wake(): void {
    for (const wake of [...this.#waiters]) wake();
  }
}
