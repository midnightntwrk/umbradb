/**
 * The core's lockstep bookkeeping (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-6, PP-7, PP-9;
 * decision records Q5, Q24; `design.md` §8; task 14.3): what the core knows of each private instance its `core` entry
 * lists in `lockstepInstances`, and the wait the finalized loop makes before `BEGIN` of each height until they let it.
 *
 * **What it learns** (PP-6: "THE core SHALL learn each instance's height from `hello` and `report`, so a core restart
 * cannot deadlock"): the core's transport (`./core-transport.ts`) tells it each listed instance's {@link Lockstep.hello}
 * — its committed height then, its start − 1 before its first commit, and whether the core refused it `lockstep-behind`
 * (PP-7) —, each {@link Lockstep.reported} height whose hash the core found to be the public block's, a report whose hash
 * was not ({@link Lockstep.mismatched}: `report-hash-mismatch`, the instance's connection closed), and the close of the
 * connection that held the instance's id ({@link Lockstep.disconnected}). A `hello` sets the height it gives, also below
 * the one known (the instance's database replaced); a report only raises it.
 *
 * **Who holds height h** ({@link Lockstep.holding}): a listed instance that is not connected — one not seen since the
 * core started included, whose height the core cannot know (Q24: the core waits for a down lockstep instance) —, one the
 * core refused, and one whose committed height is below h − 1. **The wait** ({@link Lockstep.wait}) resolves once none
 * holds h, and with false when its signal aborts first (a stop: the height's transaction never began). While it waits
 * the core raises the condition `waiting-for-lockstep` ({@link Lockstep.condition}: the height and every instance holding
 * it, as `/status` shows it, AE-3), and logs the instances that hold it because they are down or refused — not one that
 * is processing h − 1, the wait every height makes in lockstep — once each time that changes, and that the height
 * resumes.
 */

/** Why the core does not count a listed instance (PP-6, PP-7). */
export type LockstepRefusal = "lockstep-behind" | "report-hash-mismatch";

/** A listed instance as the core sees it (PP-9: its id, its connection, its synced height). */
export interface LockstepInstance {
  readonly instance: string;
  /** Whether a connection past its `hello` holds its id now. */
  readonly connected: boolean;
  /** Its committed height the core last learned (its `hello`'s, then its reports'); null when not seen since it started. */
  readonly height: bigint | null;
  /** Why the core does not count it, or null. */
  readonly refused: LockstepRefusal | null;
}

/** The condition `waiting-for-lockstep` (PP-6, AE-3): the core waits before `BEGIN` of `height` for `instances`. */
export interface LockstepCondition {
  readonly code: "waiting-for-lockstep";
  readonly height: bigint;
  readonly instances: readonly LockstepInstance[];
}

/** What {@link Lockstep} takes. */
export interface LockstepOptions {
  /** `lockstepInstances`. */
  readonly listed: readonly string[];
  /** Where its log lines go; nowhere unless given. */
  readonly log?: (line: string) => void;
}

/** One listed instance's state. */
interface Entry {
  connected: boolean;
  height: bigint | null;
  refused: LockstepRefusal | null;
}

/** Whether `entry` holds height `height` (see the module comment). */
const holds = (entry: LockstepInstance, height: bigint): boolean =>
  !entry.connected || entry.refused !== null || entry.height === null || entry.height < height - 1n;

/** How a holding instance that is down or refused is named in a log line; null for one that is processing. */
function downText(entry: LockstepInstance): string | null {
  const at = entry.height === null ? "" : ` at ${entry.height}`;
  if (entry.refused !== null) return `${entry.instance} (${entry.refused}${at})`;
  if (!entry.connected) return `${entry.instance} (not connected${entry.height === null ? "" : `, last${at}`})`;
  return null;
}

/** The core's lockstep bookkeeping and wait (see the module comment). */
export class Lockstep {
  readonly #entries = new Map<string, Entry>();
  readonly #log: (line: string) => void;
  /** Told of every change. */
  readonly #changes = new Set<() => void>();
  /** The height the loop waits to commit, while it waits. */
  #waiting: bigint | null = null;

  constructor(options: LockstepOptions) {
    for (const instance of options.listed) this.#entries.set(instance, { connected: false, height: null, refused: null });
    this.#log = options.log ?? (() => undefined);
  }

  /** The listed ids, each once, in the list's order. */
  get listed(): readonly string[] {
    return Object.freeze([...this.#entries.keys()]);
  }

  /** Whether `instance` is listed. */
  isListed(instance: string): boolean {
    return this.#entries.has(instance);
  }

  /** A connection holds `instance`'s id from its `hello` at `height` on, refused `lockstep-behind` or not (PP-7). */
  hello(instance: string, height: bigint, refused: "lockstep-behind" | null): void {
    this.#change(instance, (entry) => {
      entry.connected = true;
      entry.height = height;
      entry.refused = refused;
    });
  }

  /** `instance` reported `height`, its hash the public block's: its committed height, when higher and it counts. */
  reported(instance: string, height: bigint): void {
    this.#change(instance, (entry) => {
      if (entry.connected && entry.refused === null && (entry.height === null || height > entry.height)) entry.height = height;
    });
  }

  /** `instance` reported a hash that is not the public block's (PP-6): refused until its next `hello`. */
  mismatched(instance: string): void {
    this.#change(instance, (entry) => {
      entry.refused = "report-hash-mismatch";
    });
  }

  /** The connection holding `instance`'s id closed. */
  disconnected(instance: string): void {
    this.#change(instance, (entry) => {
      entry.connected = false;
    });
  }

  /** Every listed instance as the core sees it now, in the list's order. */
  instances(): readonly LockstepInstance[] {
    return Object.freeze(
      [...this.#entries].map(([instance, entry]) =>
        Object.freeze({ instance, connected: entry.connected, height: entry.height, refused: entry.refused }),
      ),
    );
  }

  /** The listed instances that hold `height` now (see the module comment). */
  holding(height: bigint): readonly LockstepInstance[] {
    return Object.freeze(this.instances().filter((entry) => holds(entry, height)));
  }

  /**
   * Resolves true once no listed instance holds `height` — only those `counts` keeps, for the negative controls —, or
   * false when `signal` aborts first; raises `waiting-for-lockstep` meanwhile (see the module comment).
   */
  async wait(height: bigint, signal: AbortSignal, counts: (instance: LockstepInstance) => boolean = () => true): Promise<boolean> {
    let logged: string | null = null;
    try {
      for (;;) {
        if (signal.aborted) return false;
        const holding = this.holding(height).filter(counts);
        if (holding.length === 0) {
          if (logged !== null) this.#log(`lockstep: height ${height} resumes: every lockstep instance has committed ${height - 1n}`);
          return true;
        }
        this.#waiting = height;
        const down = holding.map(downText).filter((text) => text !== null);
        const text = down.join(", ");
        if (down.length > 0 && text !== logged) {
          this.#log(`lockstep: height ${height} waits for ${text}`);
          logged = text;
        }
        await this.#changed(signal);
      }
    } finally {
      this.#waiting = null;
    }
  }

  /** `waiting-for-lockstep` while the loop waits, naming the instances that hold its height now; null otherwise. */
  condition(): LockstepCondition | null {
    const height = this.#waiting;
    if (height === null) return null;
    return Object.freeze({ code: "waiting-for-lockstep", height, instances: this.holding(height) });
  }

  /** Changes `instance`'s entry, if it is listed, and tells the wait. */
  #change(instance: string, change: (entry: Entry) => void): void {
    const entry = this.#entries.get(instance);
    if (entry === undefined) return;
    change(entry);
    for (const told of [...this.#changes]) told();
  }

  /** Resolves at the next change, or once `signal` aborts. */
  #changed(signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve) => {
      const done = (): void => {
        this.#changes.delete(done);
        signal.removeEventListener("abort", done);
        resolve();
      };
      this.#changes.add(done);
      signal.addEventListener("abort", done, { once: true });
    });
  }
}
