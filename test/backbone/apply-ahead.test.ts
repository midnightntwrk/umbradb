import { describe, expect, it } from "vitest";
import { APPLY_AHEAD_DEFAULT, applyAheadOf, ownedApplyInput, sameApplyInput } from "../../src/backbone/core-ledger-state/apply-ahead.js";
import type { ApplyBlock } from "../../src/ledger/worker/engine.js";

/**
 * The parts of `src/backbone/core-ledger-state/apply-ahead.ts` on hand-made inputs:
 * - two apply inputs are the same when every member is, bytes by content, the `ahead` mark apart (rule 1);
 * - an input kept for the next block is a copy that owns its bytes: a later change of the buffers it was built from
 *   does not reach it;
 * - the `applyAhead` setting is read from the process's latest `core` revision of the build, on unless it says off.
 */

const key = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

function input(change: Partial<ApplyBlock> = {}): ApplyBlock {
  return {
    ledger: "v9",
    height: 7n,
    hash: key(7),
    parentHash: key(6),
    timestampMs: 1_000n,
    parentTimestampMs: 994n,
    firstRegularAtParentTime: false,
    transactions: 2,
    outcomes: [{ outcome: "success" }, { outcome: "failure" }] as never,
    release: [key(1)],
    contracts: [key(2), key(3)],
    ...change,
  };
}

describe("sameApplyInput", () => {
  it("holds for two inputs built apart with the same members, and with the ahead mark on either", () => {
    expect(sameApplyInput(input(), input())).toBe(true);
    expect(sameApplyInput(input({ ahead: true }), input())).toBe(true);
    expect(sameApplyInput(input(), input({ ahead: true }))).toBe(true);
    // An absent member and an undefined one are the same input.
    const { outcomes: _dropped, ...without } = input();
    expect(sameApplyInput(without, { ...without, outcomes: undefined } as never)).toBe(true);
  });

  it("fails for any member that differs", () => {
    const changes: Partial<ApplyBlock>[] = [
      { ledger: "v8" },
      { height: 8n },
      { hash: key(8) },
      { parentHash: key(5) },
      { timestampMs: 1_001n },
      { parentTimestampMs: 995n },
      { firstRegularAtParentTime: true },
      { transactions: 3 },
      { outcomes: [{ outcome: "success" }, { outcome: "success" }] as never },
      { outcomes: [{ outcome: "success" }] as never },
      { release: [key(9)] },
      { release: [] },
      { release: [key(1), key(1)] },
      { contracts: [key(3), key(2)] },
      { contracts: [key(2)] },
    ];
    for (const change of changes) {
      expect(sameApplyInput(input(), input(change)), JSON.stringify(Object.keys(change))).toBe(false);
      expect(sameApplyInput(input(change), input()), JSON.stringify(Object.keys(change))).toBe(false);
    }
    const { outcomes: _dropped, ...without } = input();
    expect(sameApplyInput(without, input())).toBe(false);
    expect(sameApplyInput(input({ hash: Uint8Array.of(7) }), input())).toBe(false);
  });
});

describe("ownedApplyInput", () => {
  it("copies every byte string, so a change of the buffers it was built from does not reach it", () => {
    const given = input();
    const owned = ownedApplyInput({ ...given, ahead: true });
    expect(sameApplyInput(owned, given)).toBe(true);
    // No ahead mark is kept: it is the input of the block, whenever it is sent.
    expect(owned.ahead).toBeUndefined();
    given.hash.fill(0xaa);
    (given.release as Uint8Array[])[0]?.fill(0xbb);
    (given.contracts as Uint8Array[])[1]?.fill(0xcc);
    expect(owned.hash).toEqual(key(7));
    expect(owned.release).toEqual([key(1)]);
    expect(owned.contracts).toEqual([key(2), key(3)]);
    expect(sameApplyInput(owned, given)).toBe(false);
  });
});

describe("the applyAhead setting", () => {
  /** A `core` revision at `start`, of this build's version or not, with `settings`. */
  const entry = (start: number, buildVersion: boolean, settings: Record<string, unknown> = {}) => ({ id: "core", start, buildVersion, settings });
  const of = (...entries: ReturnType<typeof entry>[]) => applyAheadOf({ entries } as never);

  it("is on unless the latest core revision of the build turns it off", () => {
    expect(APPLY_AHEAD_DEFAULT).toBe(true);
    expect(of()).toBe(true);
    expect(of(entry(0, true))).toBe(true);
    expect(of(entry(0, true, { applyAhead: false }))).toBe(false);
    expect(of(entry(0, true, { applyAhead: true }))).toBe(true);
    // The latest revision of the build's version gives it; a later revision of another version does not.
    expect(of(entry(0, true, { applyAhead: false }), entry(9, true, { applyAhead: true }), entry(20, false, { applyAhead: false }))).toBe(true);
    expect(of(entry(0, true, { applyAhead: true }), entry(9, true, { applyAhead: false }))).toBe(false);
  });
});
