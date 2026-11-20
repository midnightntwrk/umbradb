import { describe, expect, it } from "vitest";
import {
  DEFAULT_LEDGER_ROOT_INTERVAL,
  ledgerRootIntervalOf,
  RootChecks,
  rootChecked,
  rootCheckedByHeight,
} from "../../src/backbone/core-ledger-state/root-checks.js";

/**
 * The heights `core-ledger-state` compares with the node's root (`src/backbone/core-ledger-state/root-checks.ts`, the
 * node call budget's FR-007), on their own: the predicate, the interval setting, and what a process context remembers.
 * The process-level checks (the heights asked over a tape, the halts) are in `ledger-root-interval.test.ts`.
 */

describe("the checked heights", () => {
  it("are block 0 and the multiples of the interval, by the height alone", () => {
    const checked = (interval: number, to: number) =>
      Array.from({ length: to + 1 }, (_, h) => h).filter((h) => rootCheckedByHeight(BigInt(h), interval));
    expect(checked(10, 35)).toEqual([0, 10, 20, 30]);
    expect(checked(600, 1_800)).toEqual([0, 600, 1_200, 1_800]);
    // Interval 1: every height, as before the setting.
    expect(checked(1, 7)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    // An interval larger than the chain: block 0 only.
    expect(checked(1_000, 999)).toEqual([0]);
  });

  it("add a run's first height and the first block of a ledger or runtime change", () => {
    expect(rootChecked(7n, { interval: 10 })).toBe(false);
    expect(rootChecked(7n, { interval: 10, first: true })).toBe(true);
    expect(rootChecked(7n, { interval: 10, ledgerChanged: true })).toBe(true);
    expect(rootChecked(7n, { interval: 10, runtimeChanged: true })).toBe(true);
    expect(rootChecked(7n, { interval: 10, first: false, ledgerChanged: false, runtimeChanged: false })).toBe(false);
    expect(rootChecked(0n, { interval: 10 })).toBe(true);
    expect(rootChecked(20n, { interval: 10 })).toBe(true);
  });

  it("take the core entry's ledgerRootInterval, 600 unless it sets a whole number of at least 1", () => {
    expect(DEFAULT_LEDGER_ROOT_INTERVAL).toBe(600);
    expect(ledgerRootIntervalOf({ ledgerRootInterval: 10 })).toBe(10);
    expect(ledgerRootIntervalOf({ ledgerRootInterval: 1 })).toBe(1);
    for (const settings of [undefined, null, {}, { ledgerRootInterval: 0 }, { ledgerRootInterval: 1.5 }, { ledgerRootInterval: "10" }]) {
      expect(ledgerRootIntervalOf(settings)).toBe(600);
    }
  });
});

describe("what a process context remembers of its checks", () => {
  const block = (height: bigint, specVersion = 1_000_000, ledger = "v8") => ({ height, specVersion, ledger });

  it("sees a run's first height, a gap, and a ledger or runtime change from the block applied before", () => {
    const checks = new RootChecks();
    // Nothing applied yet: the first height of the process.
    expect(checks.contextOf(block(5n), 10, true)).toMatchObject({ first: true, ledgerChanged: false, runtimeChanged: false });
    checks.applied(block(5n), true);
    expect(checks.contextOf(block(6n), 10, true)).toMatchObject({ first: false, ledgerChanged: false, runtimeChanged: false });
    // A block that does not continue the one before (a retry), or one that follows another height.
    expect(checks.contextOf(block(6n), 10, false).first).toBe(true);
    expect(checks.contextOf(block(8n), 10, true).first).toBe(true);
    expect(checks.contextOf(block(6n, 2_000_000), 10, true)).toMatchObject({ first: false, runtimeChanged: true });
    expect(checks.contextOf(block(6n, 1_000_000, "v9"), 10, true)).toMatchObject({ first: false, ledgerChanged: true });
  });

  it("keeps the last height whose root matched, which an unchecked height does not move", () => {
    const checks = new RootChecks();
    expect(checks.lastMatched).toBeNull();
    checks.applied(block(10n), true);
    checks.applied(block(11n), false);
    checks.applied(block(12n), false);
    expect(checks.lastMatched).toBe(10n);
    checks.applied(block(20n), true);
    expect(checks.lastMatched).toBe(20n);
  });
});
