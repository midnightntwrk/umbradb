/**
 * Fast-sync mode's policy: whether the finalized loop stores a chunk of consecutive heights in one transaction from a
 * height, and where the chunk ends (`docs/research/fast-sync-mode.md`). Core; pure.
 *
 * A chunk forms only far behind the finalized head: it holds only heights `distance` or more behind the head the loop
 * read for its pass, so the cursor comes up to the head one block per transaction. A chunk stays inside one range of
 * the resolved graph, where no entry starts or stops and no revision's setting changes, and does not pass the loop's
 * last height. It holds two blocks or more; a height where none forms is processed alone, as with the mode off.
 */

/** The `core` entry's `fastSync`: the most blocks per chunk (below 2: the mode is off), and the distance kept from the head. */
export interface FastSync {
  readonly blocks: number;
  readonly distance: number;
}

/** The setting's defaults (`src/config/core-settings.ts`): off. */
export const FAST_SYNC_DEFAULT: FastSync = Object.freeze({ blocks: 0, distance: 600 });

/**
 * The most blocks a chunk may hold: it bounds what a chunk keeps until its `COMMIT` (its blocks' items, the ledger
 * worker's kept parses, the held trace records).
 */
export const FAST_SYNC_MAX_BLOCKS = 1_000;

/** What bounds a chunk besides the setting. */
export interface ChunkLimits {
  /** The finalized head the loop read for this pass. */
  readonly head: bigint;
  /** The last height of the range of the resolved graph holding the chunk's first height; null for a range with no end. */
  readonly rangeEnd: bigint | null;
  /** The loop's last height (the core's stop, the height before an upgrade boundary); null for none. */
  readonly last: bigint | null;
  /**
   * The highest height of a chunk that did not commit, while the cursor is below it; null for none. No chunk starts at
   * or below it: those heights are stored one block per transaction.
   */
  readonly alone: bigint | null;
}

/**
 * The last height of the chunk starting at `first`: the lowest of `first` + `blocks` − 1, the head − `distance`, the
 * range's end and the loop's last height. Null when no chunk starts there: the mode is off, that end is not above
 * `first`, or `first` is at or below `alone`.
 */
export function chunkEnd(setting: FastSync, first: bigint, limits: ChunkLimits): bigint | null {
  if (!Number.isInteger(setting.blocks) || setting.blocks < 2) return null;
  if (limits.alone !== null && first <= limits.alone) return null;
  let end = first + BigInt(setting.blocks) - 1n;
  const far = limits.head - BigInt(Math.max(0, setting.distance));
  if (far < end) end = far;
  if (limits.rangeEnd !== null && limits.rangeEnd < end) end = limits.rangeEnd;
  if (limits.last !== null && limits.last < end) end = limits.last;
  return end > first ? end : null;
}
