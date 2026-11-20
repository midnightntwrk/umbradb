/**
 * Which heights `core-ledger-state` compares with the node's ledger state root (`midnight_ledgerStateRoot`), and what it
 * remembers of those comparisons. Pure: no database, no ledger package, no Node.js import.
 *
 * **The checked heights** ({@link rootChecked}): the node's root is a security check (the replay's root equals the
 * node's), so it is asked only at:
 * - block 0, always: its root also decides whether the genesis state already includes block 0's transactions;
 * - every height that is a multiple of the `core` entry's `ledgerRootInterval` (600 by default, about an hour of 6 s
 *   blocks; 1 checks every height, as before the setting existed);
 * - the first height of each run of processing (a start, any retry: the block context's `continues` is false), so a
 *   restart never lengthens the unchecked gap;
 * - the first block of each ledger-version change (the v8 → v9 conversion block) and of each runtime `spec_version`
 *   change, compared with the block before as this process applied it.
 * A backup restore compares the backup's root with the node's on its own (`src/backup/restore.ts`), whatever the
 * interval. Between checked heights the replay's own root is still computed and stored at every block; only the
 * comparison is thinned. A replay that diverges from the node at height d is found at the next checked height c ≥ d,
 * up to `ledgerRootInterval` − 1 blocks late, and blocks d to c − 1 are committed by then: recovery is a backup
 * restore at or below the last height whose root matched, which the `root-mismatch` names (`lastMatchedHeight`).
 *
 * The roots' prefetch of the node source (`../core-block-fetch/node-source.ts`) asks only for heights the height alone
 * selects (block 0 and the multiples of the interval: {@link rootCheckedByHeight}); a height checked for another reason
 * is asked at its `on-compute`, unprefetched.
 *
 * **What is remembered** ({@link RootChecks}), per process context, in memory: the last block applied (its height,
 * runtime version and ledger), to see a change at the next one, and the last height whose root matched in this process.
 * Nothing of it is stored: after a restart the first height is checked anyway, and until a check passes in the new
 * process the last match is not known (`lastMatchedHeight` null), since no table records which heights were compared.
 */

/** The `ledgerRootInterval` unless the `core` entry sets one: 600 heights, about an hour at one block per 6 s. */
export const DEFAULT_LEDGER_ROOT_INTERVAL = 600;

/** Why a height may be checked besides the height itself (see the module comment). */
export interface RootCheckContext {
  /** `ledgerRootInterval`, at least 1. */
  readonly interval: number;
  /** Whether the height is the first of a run of processing (`continues` false), or follows no block applied here. */
  readonly first?: boolean;
  /** Whether the block's ledger differs from the block before's. */
  readonly ledgerChanged?: boolean;
  /** Whether the block's runtime `spec_version` (`MNSV`) differs from the block before's. */
  readonly runtimeChanged?: boolean;
}

/** Whether the height alone selects `height` for the root check: block 0, or a multiple of `interval`. */
export function rootCheckedByHeight(height: bigint, interval: number): boolean {
  return height === 0n || height % BigInt(interval) === 0n;
}

/** Whether `core-ledger-state` compares the node's root at `height` (see the module comment). */
export function rootChecked(height: bigint, context: RootCheckContext): boolean {
  return (
    rootCheckedByHeight(height, context.interval) ||
    context.first === true ||
    context.ledgerChanged === true ||
    context.runtimeChanged === true
  );
}

/** The `core` entry's `ledgerRootInterval` in `settings`, or {@link DEFAULT_LEDGER_ROOT_INTERVAL}. */
export function ledgerRootIntervalOf(settings: Readonly<Record<string, unknown>> | null | undefined): number {
  const value = settings?.ledgerRootInterval;
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 ? value : DEFAULT_LEDGER_ROOT_INTERVAL;
}

/** A block as {@link RootChecks} remembers it: what the next block is compared with. */
export interface AppliedBlock {
  readonly height: bigint;
  readonly specVersion: number;
  readonly ledger: string;
}

/** What one process context remembers of its root checks (see the module comment). */
export class RootChecks {
  #last: AppliedBlock | null = null;
  #lastMatched: bigint | null = null;

  /** The context of `block`'s check: `first` when it is a run's first height or follows no block applied here. */
  contextOf(block: AppliedBlock, interval: number, continues: boolean): RootCheckContext {
    const last = this.#last;
    const follows = last !== null && last.height === block.height - 1n;
    return Object.freeze({
      interval,
      first: !continues || !follows,
      ledgerChanged: follows && last.ledger !== block.ledger,
      runtimeChanged: follows && last.specVersion !== block.specVersion,
    });
  }

  /** `block` was applied: its root checked and matched (`matched`), or not checked. */
  applied(block: AppliedBlock, matched: boolean): void {
    this.#last = Object.freeze({ height: block.height, specVersion: block.specVersion, ledger: block.ledger });
    if (matched) this.#lastMatched = block.height;
  }

  /** The last height whose root matched the node's in this process; null before any. */
  get lastMatched(): bigint | null {
    return this.#lastMatched;
  }
}
