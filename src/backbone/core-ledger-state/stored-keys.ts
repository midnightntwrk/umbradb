/**
 * The keys found stored that `core-ledger-state` keeps for one process context (`./core-ledger-state.ts`), and when
 * they are emptied. Core.
 *
 * **The keys** ({@link StoredKeys.known}, a {@link KnownKeySet} of `./run-reclaim.ts`). Step 3 of a run's computation
 * asks the database which of the keys it needs are not rows of `nodes` (the `missing` read) and asks only about those
 * the set lacks; it learns the keys that read finds stored. Step 10 takes every key the run deletes out of the set,
 * before the net write, whose `DELETE` (`./sql.ts`'s `deleteNodes`) is the only statement in `src/` that deletes rows
 * of `nodes`.
 *
 * What the set holds: a key in it was a row of `nodes` when a settle of this process found it stored, the settles since
 * then all committed on the writer's session that committed the one before, and none of them deleted it. A key wrongly
 * held as a row would let a block whose child list references a missing node commit; a key missing from the set costs
 * one read. So the set is used only while that holds, and emptied otherwise:
 * - at a block's `on-compute`, before the block is handed over, when its context says the block before does not
 *   continue into it (`BlockContext.continues` false: a process's first block, every block made again after a failure,
 *   the block after a `COMMIT` whose answer was lost, whoever committed it, a block on a writer's session other than
 *   the one that committed the block before); {@link StoredKeys.begin};
 * - when a settle throws, before its error goes on ({@link StoredKeys.failed});
 * - by its bound, before a key that would pass it ({@link KnownKeySet}).
 *
 * A worker restart after a refused eviction changes no table and empties nothing; nor does `sweep` turning off or on,
 * since a run that does not sweep deletes no row. A node row deleted by hand while the process runs is seen at once if
 * its key is not remembered; if it is, the deletion goes unseen while the key stays remembered, until a block that does
 * not continue the one before, or the bound, empties the remembered keys.
 *
 * **The trace's `knownEmptied`** ({@link StoredKeys.settled}): a settle did not start from what earlier heights
 * learned, because the block before did not continue into its block or because the bound emptied the set while it ran.
 * Every attempt of a height after a failure does not continue, so the attempt that commits says so, whatever the
 * attempts before it did. A process's first block says so too.
 */

import { KnownKeySet } from "./run-reclaim.js";

/** The keys found stored of one process context, and when they are emptied (see the module comment). */
export class StoredKeys {
  /** The keys found stored. */
  readonly known: KnownKeySet;
  /** Whether the block whose settle comes next did not continue the block before. */
  #afresh = false;

  constructor(known: KnownKeySet = new KnownKeySet()) {
    this.known = known;
  }

  /**
   * A block's `on-compute`, before it is handed over: `continues`, its context's. When the block before does not
   * continue into it, the set is emptied, and the settle that follows starts afresh.
   */
  begin(continues: boolean): void {
    if (continues) return;
    this.known.clear();
    this.#afresh = true;
  }

  /** A settle threw: the set is emptied before its error goes on. */
  failed(): void {
    this.known.clear();
  }

  /**
   * A settle ended, its net write made, `emptiedBefore` the set's {@link KnownKeySet.emptied} when it began: whether it
   * did not start from what earlier heights learned (the block before did not continue into its block, or the bound
   * emptied the set while it ran). Each settle asks once, for the trace's `knownEmptied`.
   */
  settled(emptiedBefore: number): boolean {
    const afresh = this.#afresh || this.known.emptied !== emptiedBefore;
    this.#afresh = false;
    return afresh;
  }
}
