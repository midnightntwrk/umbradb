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
 *
 * **What `/status` shows** (AE-3 as amended, owner decision Q174 B; task 8.3b): {@link LoopPauses.pausedAt} gives, while
 * the loop is paused — a hold kept and the loop between heights —, the time it paused and who holds it, which the
 * process lists as the condition `paused` (`./process.ts`). The time is the moment the loop paused, kept while a hold is
 * kept: the loop's step from its wait for the head to its next point between heights does not end the pause. `by` is
 * `pause` while a hold of `ProcessHandle.pause()` is kept — only `resume()` lifts it —, else `signal` (a backup on
 * SIGUSR2). Each change of what it gives is told once to `onChange` (the process publishes it to the admin endpoints).
 */

/** Who holds the loop: `ProcessHandle.pause()` (`pause`), or a backup on SIGUSR2 (`signal`). */
export type PauseBy = "pause" | "signal";

/** The loop's pause as `/status` shows it (see the module comment): when it paused (ms since the epoch), and by whom. */
export interface LoopPaused {
  readonly since: number;
  readonly by: PauseBy;
}

/** What {@link LoopPauses} is given. */
export interface LoopPausesOptions {
  /** Told once each time what {@link LoopPauses.pausedAt} gives changes. */
  readonly onChange?: () => void;
  /** The wall clock in ms; `Date.now` unless given (a test's). */
  readonly now?: () => number;
}

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
  /** Each hold kept, with who holds it and what tells it that it was reached (none once told). */
  readonly #holds = new Map<symbol, { readonly by: PauseBy; tell: (() => void) | null }>();
  /** True while the loop is between heights: at {@link between}, or in {@link idle}. */
  #between = false;
  /** Wakes the loop held at {@link between}. */
  #lift: (() => void) | undefined;
  /** When the loop paused, while holds have been kept since; null otherwise. */
  #since: number | null = null;
  /** What {@link pausedAt} gave when {@link #changed} last looked, as text. */
  #shown = "none";
  readonly #onChange: (() => void) | undefined;
  readonly #now: () => number;

  constructor(options: LoopPausesOptions = {}) {
    this.#onChange = options.onChange;
    this.#now = options.now ?? Date.now;
  }

  /** Whether a hold is kept. */
  get held(): boolean {
    return this.#holds.size > 0;
  }

  /** Whether the loop is paused now: a hold is kept and the loop is between heights. */
  get paused(): boolean {
    return this.held && this.#between;
  }

  /** While the loop is paused, when it paused and who holds it; else null (see the module comment). */
  get pausedAt(): LoopPaused | null {
    if (!this.paused) return null;
    const by: PauseBy = [...this.#holds.values()].some((hold) => hold.by === "pause") ? "pause" : "signal";
    return Object.freeze({ since: this.#since as number, by });
  }

  /** A new hold by `by` (see the module comment): reached at once while the loop is between heights. */
  hold(by: PauseBy = "pause"): PauseHold {
    const token = Symbol("hold");
    let tell!: () => void;
    const reached = new Promise<void>((resolve) => {
      tell = resolve;
    });
    if (this.#between) {
      tell();
      this.#holds.set(token, { by, tell: null });
    } else {
      this.#holds.set(token, { by, tell });
    }
    this.#changed();
    return Object.freeze({
      reached,
      release: () => {
        const hold = this.#holds.get(token);
        if (hold === undefined) return;
        hold.tell?.();
        this.#holds.delete(token);
        if (this.#holds.size === 0) {
          this.#since = null;
          this.#lift?.();
        }
        this.#changed();
      },
    });
  }

  async between(signal: AbortSignal): Promise<void> {
    this.#between = true;
    try {
      while (this.held) {
        this.#reached();
        this.#changed();
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
      this.#changed();
    }
  }

  async idle<T>(body: () => Promise<T>): Promise<T> {
    this.#between = true;
    this.#reached();
    this.#changed();
    try {
      return await body();
    } finally {
      // Not told: the loop's next step is a point between heights, where a kept hold holds it still (see above).
      this.#between = false;
    }
  }

  /** Tells every hold not told yet that the loop is paused for it. */
  #reached(): void {
    for (const hold of this.#holds.values()) {
      if (hold.tell === null) continue;
      hold.tell();
      hold.tell = null;
    }
  }

  /** Notes when the loop paused, and tells `onChange` when what {@link pausedAt} gives changed since it last looked. */
  #changed(): void {
    if (this.paused) this.#since ??= this.#now();
    const paused = this.pausedAt;
    const shown = paused === null ? "none" : `${paused.since} ${paused.by}`;
    if (shown === this.#shown) return;
    this.#shown = shown;
    this.#onChange?.();
  }
}
