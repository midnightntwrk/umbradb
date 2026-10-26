/**
 * One height's block items and the settings a block context carries (`openspec/changes/core-arch/specs/runner/spec.md`
 * RN-5, RN-7; `design.md` §2; CORE-ARCH §4.3, §4.10).
 *
 * **Block items (RN-5).** {@link BlockItems} holds the `block` items published for one height. A callback that may put
 * items (`on-fetch`, `on-parse`, `on-compute`) gets a sink of its own through {@link BlockItems.collect}: its puts are
 * buffered and published, in put order, when the callback completes, and dropped when it fails. A wave of parallel
 * callbacks starts them one after another without waiting, and a callback may put before its first `await`, so a
 * shared map would show an item to a sibling that started before its putter completed; with the buffer, a callback sees
 * only the items of callbacks that completed before it started ({@link BlockItems.visible}, a copy the runner takes as
 * the callback starts). Only the module that declares an item with the `block` lifetime may put it, at most once per
 * block — a second put in one callback, or after an earlier callback published it, is refused. A refused put throws at
 * the put and fails the callback even when the module catches it, so it is a callback error (RN-8); a put from a sink
 * kept past its callback throws too and is reported to the runner, as no callback is left to fail.
 *
 * **Settings (RN-7).** A block context's settings are those of the calling module's revision covering the height
 * ({@link revisionAt}).
 */

import type { ItemSink, ModuleDeclaration, PointName, Revision } from "../modules/declaration.js";

/** Told of a put from a sink kept past its callback: the refusal, the module and the point of that callback. */
export type LateUse = (error: Error, module: string, point: PointName) => void;

/** The `block` items of one height (see the module comment). */
export class BlockItems {
  readonly height: bigint;
  /** The items published so far, in publication order. */
  protected readonly published = new Map<string, unknown>();
  readonly #onLateUse: LateUse;

  constructor(height: bigint, onLateUse: LateUse = () => undefined) {
    this.height = height;
    this.#onLateUse = onLateUse;
  }

  /** The items published so far: a copy, so what a callback holds does not change while it runs. */
  visible(): ReadonlyMap<string, unknown> {
    return new Map(this.published);
  }

  /**
   * Runs `body` — `part`'s callback at `point` — with a sink of its own; when `body` resolves, publishes its puts, or
   * rejects with its first refused put, if any; when `body` rejects, publishes nothing and rejects with its error.
   */
  async collect(part: ModuleDeclaration, point: PointName, body: (sink: ItemSink) => Promise<void>): Promise<void> {
    const buffer = new Map<string, unknown>();
    let running = true;
    let refused: Error | undefined;
    const sink: ItemSink = Object.freeze({
      put: (item: string, value: unknown): void => {
        const refusal = this.#refusal(part, point, item, buffer, running);
        if (refusal !== undefined) {
          if (running) refused ??= refusal;
          else this.#onLateUse(refusal, part.id, point);
          throw refusal;
        }
        buffer.set(item, value);
      },
    });
    try {
      await body(sink);
    } finally {
      running = false;
    }
    if (refused !== undefined) throw refused;
    for (const [item, value] of buffer) this.published.set(item, value);
  }

  /** Why `part` may not put `item` now, or undefined. */
  #refusal(
    part: ModuleDeclaration,
    point: PointName,
    item: string,
    buffer: ReadonlyMap<string, unknown>,
    running: boolean,
  ): Error | undefined {
    const at = `at height ${this.height}`;
    if (!running) {
      return new Error(
        `${part.id} put the item ${item} after its ${point} callback ${at} ended: a sink is valid only while its ` +
          "callback runs (RN-5)",
      );
    }
    if (!part.provides.some((declared) => declared.name === item && declared.lifetimes.includes("block"))) {
      return new Error(
        `${part.id} put the item ${item}, which it does not declare with the block lifetime, ${at}: a module puts ` +
          "only the block items it declares (RN-5)",
      );
    }
    if (buffer.has(item) || this.published.has(item)) {
      return new Error(`${part.id} put the item ${item} twice ${at}: an item is put at most once per block (RN-5)`);
    }
    return undefined;
  }
}

/**
 * The revision of `revisions` (one module's, in start order) covering `height`: the last whose start is at or before it
 * and whose stop, if it has one, is at or after it — a revision without a stop runs until the next one starts (CF-5).
 * Undefined when none does.
 */
export function revisionAt(revisions: readonly Revision[], height: bigint): Revision | undefined {
  let covering: Revision | undefined;
  for (const revision of revisions) {
    if (revision.start <= height && (revision.stop === null || height <= revision.stop)) covering = revision;
  }
  return covering;
}
