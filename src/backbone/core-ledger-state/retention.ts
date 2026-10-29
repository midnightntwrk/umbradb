/**
 * The `core` entry's revisions as `core-ledger-state` reads them, and the retention window over them. Pure: no
 * database, no ledger package. [LG-12, LG-14, Q41]
 *
 * **The window.** The system keeps the latest state alive, plus the `retainStates` states before it. When block h
 * commits, the state of h − R(h) − 1 is released, R(h) being the setting of the revision covering h. A revision that
 * raises R fills the window from its start (a state released before it stays released); one that lowers R releases the
 * states leaving the window in its first block. [LG-12]
 *
 * So the states alive after block h are the heights L(h) to h, where L(h) = max(L(h − 1), h − R(h)): a released state
 * is never alive again, and the lowest alive height never moves down. Over the revisions this is
 * L(h) = max(S, max over the revisions starting at or below h of min(their last height, h) − their R), where S is the
 * first revision's start ({@link retainedFrom}). Block h releases the heights L(h − 1) to L(h) − 1 ({@link releasedBy}).
 * At the cursor c the window is L(c) to c ({@link retentionWindow}); `core-ledger-state`'s load of a retained state
 * accepts only heights inside it (`state-not-retained` outside). [LG-12]
 *
 * Every machine computes the same window from the same configuration history, which is recorded and checked, so no row
 * records the window. [CF-6]
 */

import type { CheckedConfig } from "../../config/validate.js";

/** One `core` revision as `core-ledger-state` reads it: its range, `retainStates` and `sweep`. [LG-12, LG-14] */
export interface CoreRevision {
  readonly start: bigint;
  /** Its last height: the next revision's start − 1, or null for the latest. */
  readonly last: bigint | null;
  readonly retainStates: number;
  readonly sweep: "on" | "off";
}

/** The revisions of the `core` entry in `config`, in start order, each lasting until the next one's start. [CF-5] */
export function coreRevisionsOf(config: Pick<CheckedConfig, "entries">): CoreRevision[] {
  const cores = config.entries.filter((entry) => entry.id === "core").sort((a, b) => a.start - b.start);
  return cores.map((entry, index) => {
    const next = cores[index + 1];
    const settings = (entry.settings ?? {}) as { readonly retainStates?: unknown; readonly sweep?: unknown };
    return Object.freeze({
      start: BigInt(entry.start),
      last: next === undefined ? null : BigInt(next.start - 1),
      retainStates: typeof settings.retainStates === "number" ? settings.retainStates : 0,
      sweep: settings.sweep === "off" ? "off" : "on",
    });
  });
}

/** The revision covering `height`, or undefined (below the first). */
export function revisionAt(revisions: readonly CoreRevision[], height: bigint): CoreRevision | undefined {
  return revisions.find((revision) => revision.start <= height && (revision.last === null || height <= revision.last));
}

/** L(h): the lowest height whose state is alive after block `height` commits (see the module comment). */
export function retainedFrom(revisions: readonly CoreRevision[], height: bigint): bigint {
  const first = revisions[0]?.start ?? 0n;
  let from = first;
  for (const revision of revisions) {
    if (revision.start > height) break;
    const last = revision.last === null || revision.last > height ? height : revision.last;
    const low = last - BigInt(revision.retainStates);
    if (low > from) from = low;
  }
  return from;
}

/**
 * The heights block `height` releases, `from` to `to` − 1 (none when they are equal): L(h − 1) to L(h) − 1. At the first
 * height none, as L of a height below the first revision is its start.
 */
export function releasedBy(
  revisions: readonly CoreRevision[],
  height: bigint,
  from: (revisions: readonly CoreRevision[], height: bigint) => bigint = retainedFrom,
): { readonly from: bigint; readonly to: bigint } {
  return { from: from(revisions, height - 1n), to: from(revisions, height) };
}

/** The window of states loadable at the cursor `cursor`: L(cursor) to the cursor; null before anything committed. */
export function retentionWindow(
  revisions: readonly CoreRevision[],
  cursor: bigint | null,
  from: (revisions: readonly CoreRevision[], height: bigint) => bigint = retainedFrom,
): { readonly from: bigint; readonly to: bigint } | null {
  if (cursor === null) return null;
  return { from: from(revisions, cursor), to: cursor };
}
