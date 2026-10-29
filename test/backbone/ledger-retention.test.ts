import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  type CoreRevision,
  coreRevisionsOf,
  releasedBy,
  retainedFrom,
  retentionWindow,
} from "../../src/backbone/core-ledger-state/retention.js";

/**
 * The retention window: the states alive after block h are the latest and the `retainStates` before it. A revision
 * that raises the setting fills the window from its start; one that lowers it releases the states leaving the window
 * in its first block. [LG-12, A103]
 *
 * The oracle is the rule run one block at a time: a set of alive heights, where each block adds its own and releases
 * every one below h − R(h). The implementation's closed form is checked against it by hand-computed cases, and by
 * fast-check (seed 20261026) over random revision histories.
 */

const revision = (start: number, retainStates: number, last: number | null = null): CoreRevision => ({
  start: BigInt(start),
  last: last === null ? null : BigInt(last),
  retainStates,
  sweep: "on",
});

/** Revisions from `[start, retainStates]` pairs in order, each ending where the next starts. */
const history = (...pairs: readonly (readonly [number, number])[]): CoreRevision[] =>
  pairs.map(([start, retain], i) => revision(start, retain, i + 1 < pairs.length ? (pairs[i + 1] as readonly [number, number])[0] - 1 : null));

/** The rule block by block (see the module comment): the alive heights after each block from the first revision's start to `to`. */
function aliveByBlock(revisions: readonly CoreRevision[], to: number): Map<number, number[]> {
  const alive = new Set<number>();
  const after = new Map<number, number[]>();
  const first = Number(revisions[0]?.start ?? 0n);
  for (let h = first; h <= to; h++) {
    const r = revisions.find((rev) => BigInt(h) >= rev.start && (rev.last === null || BigInt(h) <= rev.last)) as CoreRevision;
    alive.add(h);
    for (const j of [...alive]) if (j < h - r.retainStates) alive.delete(j);
    after.set(h, [...alive].sort((a, b) => a - b));
  }
  return after;
}

describe("LG-12's retention window (task 12.4)", () => {
  it("keeps the latest state and the retainStates before it; 0 keeps the latest only", () => {
    expect(retainedFrom(history([0, 0]), 0n)).toBe(0n);
    expect(retainedFrom(history([0, 0]), 7n)).toBe(7n);
    expect(retainedFrom(history([0, 1_000]), 999n)).toBe(0n);
    expect(retainedFrom(history([0, 1_000]), 5_000n)).toBe(4_000n);
    // retainStates 1,000 at cursor 5,000: 4,000 is the oldest state loadable, 3,999 is not. [A103]
    expect(retentionWindow(history([0, 1_000]), 5_000n)).toEqual({ from: 4_000n, to: 5_000n });
    expect(retentionWindow(history([0, 1_000]), null)).toBeNull();
  });

  it("releases at block h the states leaving the window: h − R − 1 with a constant R, none at block 0", () => {
    expect(releasedBy(history([0, 0]), 0n)).toEqual({ from: 0n, to: 0n });
    expect(releasedBy(history([0, 0]), 1n)).toEqual({ from: 0n, to: 1n });
    expect(releasedBy(history([0, 0]), 9n)).toEqual({ from: 8n, to: 9n });
    expect(releasedBy(history([0, 3]), 3n)).toEqual({ from: 0n, to: 0n });
    expect(releasedBy(history([0, 3]), 4n)).toEqual({ from: 0n, to: 1n });
  });

  it("fills a raised window from the revision's start: the states released before it stay released", () => {
    // 2 until 9, then 5 from 10: after 9 the window is 7–9; at 10 nothing is released and it grows to 7–12, then slides.
    const raised = history([0, 2], [10, 5]);
    expect(retentionWindow(raised, 9n)).toEqual({ from: 7n, to: 9n });
    expect(retentionWindow(raised, 10n)).toEqual({ from: 7n, to: 10n });
    expect(retentionWindow(raised, 12n)).toEqual({ from: 7n, to: 12n });
    expect(retentionWindow(raised, 13n)).toEqual({ from: 8n, to: 13n });
    for (const h of [10n, 11n, 12n]) expect(releasedBy(raised, h)).toEqual({ from: 7n, to: 7n });
    expect(releasedBy(raised, 13n)).toEqual({ from: 7n, to: 8n });
  });

  it("releases every state leaving a lowered window in the revision's first block", () => {
    // 5 until 19, then 1 from 20: after 19 the window is 14–19; block 20 releases 14 to 18 and keeps 19 and 20.
    const lowered = history([0, 5], [20, 1]);
    expect(retentionWindow(lowered, 19n)).toEqual({ from: 14n, to: 19n });
    expect(releasedBy(lowered, 20n)).toEqual({ from: 14n, to: 19n });
    expect(retentionWindow(lowered, 20n)).toEqual({ from: 19n, to: 20n });
    expect(releasedBy(lowered, 21n)).toEqual({ from: 19n, to: 20n });
  });

  it("is the block-by-block rule over any history of revisions (fast-check, seed 20261026)", () => {
    const pairs = fc
      .array(fc.tuple(fc.integer({ min: 1, max: 40 }), fc.integer({ min: 0, max: 12 })), { minLength: 0, maxLength: 5 })
      .map((rest) => {
        let start = 0;
        return [[0, rest[0]?.[1] ?? 0] as const, ...rest.map(([gap, retain]) => [(start += gap), retain] as const)];
      });
    fc.assert(
      fc.property(pairs, (list) => {
        const revisions = history(...list);
        const to = Number(revisions.at(-1)?.start ?? 0n) + 30;
        const model = aliveByBlock(revisions, to);
        let before: number[] = [];
        for (let h = 0; h <= to; h++) {
          const alive = model.get(h) as number[];
          const window = retentionWindow(revisions, BigInt(h)) as { from: bigint; to: bigint };
          expect([Number(window.from), Number(window.to)]).toEqual([alive[0], h]);
          expect(alive).toEqual(Array.from({ length: h - (alive[0] as number) + 1 }, (_, i) => (alive[0] as number) + i));
          const released = releasedBy(revisions, BigInt(h));
          const gone = before.filter((j) => !alive.includes(j));
          expect(Array.from({ length: Number(released.to - released.from) }, (_, i) => Number(released.from) + i)).toEqual(gone);
          before = alive;
        }
      }),
      { seed: 20261026, numRuns: 300 },
    );
  });

  it("reads the core revisions of a configuration: each to the next one's start, its retainStates and sweep (0 and on unless set)", () => {
    const entry = (id: string, start: number, settings: Record<string, unknown> | null) => ({ id, start, settings });
    const config = {
      entries: [
        entry("core", 0, { retainStates: 3, sweep: "off" }),
        entry("core-ledger-state", 0, {}),
        entry("core", 50, { retainStates: 0 }),
        entry("core", 20, {}),
        entry("core", 90, null),
      ],
    };
    expect(coreRevisionsOf(config as never)).toEqual([
      { ...revision(0, 3, 19), sweep: "off" },
      revision(20, 0, 49),
      revision(50, 0, 89),
      revision(90, 0, null),
    ]);
  });
});
