/**
 * Padded snapshots (debug, decision Q57): the scan file, the read table and the nullifier table hold `size` entries,
 * the real outputs spread among them and the other slots noise, to time every step at sizes the chain has not reached.
 *
 * Real output `i` of `R = first_free` sits at slot `⌊i·N/R⌋` of `N = size` slots. Without padding, slot and position
 * are the same.
 */

/** The manifest's fields this needs. */
export interface Slots {
  readonly firstFree: number;
  readonly padding?: { readonly size: number };
}

/** `⌊a / b⌋` for non-negative safe integers, exact even where the division of doubles rounds up to an integer. */
function floorDiv(a: number, b: number): number {
  let q = Math.floor(a / b);
  while (q * b > a) q--;
  while ((q + 1) * b <= a) q++;
  return q;
}

/** How many entries the scan file and the read table hold. */
export function slotCount(m: Slots): number {
  return m.padding?.size ?? m.firstFree;
}

/** The slot of tree position `position` (an output of the snapshot). */
export function slotOf(m: Slots, position: number): number {
  if (!Number.isSafeInteger(position) || position < 0 || position >= m.firstFree) {
    throw new Error(`position ${position} is not in the snapshot (0 to ${m.firstFree - 1})`);
  }
  if (m.padding === undefined) return position;
  return floorDiv(position * m.padding.size, m.firstFree);
}

/** The tree position held at `slot`, or null when the slot holds noise. */
export function positionAtSlot(m: Slots, slot: number): number | null {
  const n = slotCount(m);
  if (!Number.isSafeInteger(slot) || slot < 0 || slot >= n) throw new Error(`slot ${slot} is not in the snapshot (0 to ${n - 1})`);
  if (m.padding === undefined) return slot;
  // The smallest i with ⌊i·N/R⌋ ≥ slot is ⌈slot·R/N⌉; it is the slot's output only if it lands exactly there.
  const r = m.firstFree;
  const i = floorDiv(slot * r + m.padding.size - 1, m.padding.size);
  return i < r && floorDiv(i * m.padding.size, r) === slot ? i : null;
}
