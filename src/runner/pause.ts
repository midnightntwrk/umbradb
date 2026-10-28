/**
 * The pause of the finalized loop between heights (`openspec/changes/core-arch/specs/backups/spec.md` BK-1 as amended;
 * owner decision Q152 B; task 15.1a; `design.md` §9.1): `ProcessHandle.pause()` and `resume()`, and the backup a
 * running process writes on SIGUSR2 (`backupOnSignal`, CF-4), hold the loop while they need it still
 * (`./process.ts`).
 *
 * **Holds.** Anyone who needs the loop paused takes a hold ({@link LoopPauses.hold}) and releases it when done; the loop
 * pauses at its next point between heights while at least one hold is kept, and goes on once the last is released, so
 * a backup on signal taken while a host program paused the loop does not resume it. A hold's `reached` resolves once the
 * loop is paused for it — or once it is released, if that comes first.
 *
 * **The loop's side** ({@link LoopPause}, `LoopInput.pause`): the loop calls {@link LoopPauses.between} at each point
 * between two heights — no transaction open, every read of the height before ended (`./loop.ts`) — and runs its wait for
 * the head through {@link LoopPauses.idle}, which counts as between heights: a hold asked for while the loop waits is
 * reached at once, and when the wait ends the loop's next step is a point between heights, where it stays. A pause ends
 * when the loop's signal aborts (a stop while paused ends the process, RN-13): the loop then ends with its signal,
 * whatever holds are kept.
 */

/** A hold on the loop (see the module comment). */
export interface PauseHold {
  /** Resolves once the loop is paused for this hold, or once the hold is released, whichever comes first. */
  readonly reached: Promise<void>;
  /** Releases the hold: the loop goes on once no other hold is kept. Again, nothing. */
  release(): void;
}

/** What the loop is given to pause between heights (`LoopInput.pause`, `./loop.ts`). */
export interface LoopPause {
  /**
   * The loop is between two heights: resolves at once while no hold is kept, else once every hold is released or
   * `signal` aborts; each hold kept meanwhile is told it was reached.
   */
  between(signal: AbortSignal): Promise<void>;
  /** Runs `body`, the loop's wait for the head, as between heights: a hold kept or asked for meanwhile is reached at once. */
  idle<T>(body: () => Promise<T>): Promise<T>;
}

/** The pauses of one process's loop (see the module comment). */
export class LoopPauses implements LoopPause {
  /** Each hold kept, with what tells it that it was reached (none once told). */
  readonly #holds = new Map<symbol, (() => void) | null>();
  /** True while the loop is between heights: at {@link between}, or in {@link idle}. */
  #between = false;
  /** Wakes the loop held at {@link between}. */
  #lift: (() => void) | undefined;

  /** Whether a hold is kept. */
  get held(): boolean {
    return this.#holds.size > 0;
  }

  /** Whether the loop is paused now: a hold is kept and the loop is between heights. */
  get paused(): boolean {
    return this.held && this.#between;
  }

  /** A new hold (see the module comment): reached at once while the loop is between heights. */
  hold(): PauseHold {
    const token = Symbol("hold");
    let tell!: () => void;
    const reached = new Promise<void>((resolve) => {
      tell = resolve;
    });
    if (this.#between) {
      tell();
      this.#holds.set(token, null);
    } else {
      this.#holds.set(token, tell);
    }
    return Object.freeze({
      reached,
      release: () => {
        if (!this.#holds.has(token)) return;
        this.#holds.get(token)?.();
        this.#holds.delete(token);
        if (this.#holds.size === 0) this.#lift?.();
      },
    });
  }

  async between(signal: AbortSignal): Promise<void> {
    this.#between = true;
    try {
      while (this.held) {
        this.#reached();
        if (signal.aborted) return;
        await new Promise<void>((resolve) => {
          const done = (): void => {
            signal.removeEventListener("abort", done);
            this.#lift = undefined;
            resolve();
          };
          this.#lift = done;
          signal.addEventListener("abort", done, { once: true });
        });
      }
    } finally {
      this.#between = false;
    }
  }

  async idle<T>(body: () => Promise<T>): Promise<T> {
    this.#between = true;
    this.#reached();
    try {
      return await body();
    } finally {
      this.#between = false;
    }
  }

  /** Tells every hold not told yet that the loop is paused for it. */
  #reached(): void {
    for (const [token, tell] of this.#holds) {
      if (tell === null) continue;
      tell();
      this.#holds.set(token, null);
    }
  }
}
